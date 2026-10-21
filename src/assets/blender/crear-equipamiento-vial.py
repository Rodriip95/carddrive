import bpy, math, os
from mathutils import Vector
base=r'C:\Users\rodri\OneDrive\Escritorio\paginaAstral\three\three-playground'
col=bpy.data.collections.new('Equipamiento_vial_low_poly')
bpy.context.scene.collection.children.link(col)
def mat(name,color,metal=0,rough=.38,emission=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 n=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
 n.inputs['Base Color'].default_value=(*color,1); n.inputs['Metallic'].default_value=metal; n.inputs['Roughness'].default_value=rough
 if emission: n.inputs['Emission Color'].default_value=(*color,1); n.inputs['Emission Strength'].default_value=emission
 return m
orange=mat('Vial_naranja',(.95,.17,.015))
white=mat('Vial_blanco',(.88,.9,.86))
dark=mat('Vial_goma',(.025,.032,.04),0,.7)
metal=mat('Vial_metal',(.33,.4,.43),.45)
yellow=mat('Vial_amarillo',(.95,.62,.015))
red=mat('Semaforo_rojo',(.85,.015,.01),0,.3,.4)
amber=mat('Semaforo_ambar',(1,.4,.015),0,.3,.2)
green=mat('Semaforo_verde',(.015,.55,.12),0,.3,.15)
lamp=mat('Farol_luz',(.95,.88,.62),0,.3,2)
face=mat('Senal_superficie_SVG',(.96,.96,.94),0,.45)
roots=[]
def root(name,loc):
 o=bpy.data.objects.new(name,None); col.objects.link(o); o.location=loc; roots.append(o); return o
def attach(o,name,r,ma):
 o.name=name
 for c in list(o.users_collection): c.objects.unlink(o)
 col.objects.link(o); o.parent=r
 if ma: o.data.materials.append(ma)
 return o
def box(name,r,loc,size,ma):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
 o=attach(bpy.context.object,name,r,ma); o.scale=size
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 return o
def cone(name,r,loc,r1,r2,depth,ma,vertices=12):
 bpy.ops.mesh.primitive_cone_add(vertices=vertices,radius1=r1,radius2=r2,depth=depth,location=loc)
 return attach(bpy.context.object,name,r,ma)
def mesh(name,r,verts,faces,ma):
 me=bpy.data.meshes.new(name); me.from_pydata(verts,[],faces); me.update()
 o=bpy.data.objects.new(name,me); col.objects.link(o); o.parent=r; me.materials.append(ma)
 return o
def bar(name,r,a,b,radius,ma):
 a,b=Vector(a),Vector(b)
 o=cone(name,r,(a+b)/2,radius,radius,(b-a).length,ma)
 o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler()
 return o
# Cono con franjas como anillos de geometria, sin texturas.
r=root('cono-transito',(-5,2,0))
box('Cono_base',r,(0,0,.045),(.45,.45,.09),dark)
levels=[(.09,.195),(.27,.148),(.39,.116),(.51,.085),(.63,.053),(.75,.022)]
for i in range(len(levels)-1):
 z1,a=levels[i];z2,b=levels[i+1]
 cone('Cono_franja_'+str(i),r,(0,0,(z1+z2)/2),a,b,z2-z1,white if i in (1,3) else orange)
# Valla estable con dos travesanos y pies.
r=root('valla-obra',(-3,2,0))
for x in (-.82,.82):
 box('Valla_pie',r,(x,0,.055),(.18,.72,.11),dark)
 box('Valla_pata',r,(x,0,.56),(.085,.09,1.05),metal)
for z in (.55,.91):
 box('Valla_tablero',r,(0,0,z),(2,.12,.25),white)
 # Franjas recortadas dentro del tablero en las dos caras.
 for side in (-1,1):
  for j in range(-4,5):
   xa=j*.32; polygon=[(xa-.12,-.125),(xa+.04,-.125),(xa+.22,.125),(xa+.06,.125)]
   for boundary,sgn in [(-1,1),(1,-1)]:
    out=[]
    for k,p in enumerate(polygon):
     q=polygon[(k+1)%len(polygon)]
     pin=(p[0]-boundary)*sgn>=0; qin=(q[0]-boundary)*sgn>=0
     if pin: out.append(p)
     if pin!=qin:
      t=(boundary-p[0])/(q[0]-p[0]); out.append((boundary,p[1]+t*(q[1]-p[1])))
    polygon=out
    if not polygon: break
   if len(polygon)>2:
    verts=[(x,side*.061,z+zz) for x,zz in polygon]
    mesh('Valla_franja_naranja',r,verts,[list(range(len(verts))) if side<0 else list(reversed(range(len(verts))))],orange)
# Semaforo: lentes independientes y viseras abiertas.
r=root('semaforo',(.1,2,0))
cone('Semaforo_zocalo',r,(0,0,.08),.18,.14,.16,dark)
bar('Semaforo_poste',r,(0,0,.12),(0,0,2.65),.055,metal)
box('Semaforo_carcasa',r,(0,-.05,2.65),(.42,.25,1.13),dark)
for name,z,ma in [('roja',2.99,red),('ambar',2.65,amber),('verde',2.31,green)]:
 o=cone('Luz_'+name,r,(0,-.187,z),.135,.135,.035,ma,16);o.rotation_euler.x=math.pi/2
 verts=[];fs=[]
 for y in (-.18,-.40):
  for i in range(9):
   a=math.pi*i/8
   verts.append((.16*math.cos(a),y,z+.16*math.sin(a)))
 for i in range(8): fs.append((i,i+1,i+10,i+9))
 o=mesh('Visera_'+name,r,verts,fs,dark)
 mod=o.modifiers.new('Espesor_visera','SOLIDIFY'); mod.thickness=.012
# Loma de burro modular, perfil redondeado facetado.
r=root('loma-de-burro',(0,-1.3,0))
for j in range(10):
 x0=-1.75+j*.35; x1=x0+.35
 profile=[(-.4,0),(-.3,.065),(-.16,.105),(0,.12),(.16,.105),(.3,.065),(.4,0)]
 verts=[(x,y,z) for x in (x0,x1) for y,z in profile]
 fs=[tuple(reversed(range(7))),tuple(range(7,14))]
 fs += [(i,i+1,i+8,i+7) for i in range(6)];fs.append((6,0,7,13))
 mesh('Loma_modulo_'+str(j),r,verts,fs,yellow if j%2==0 else dark)
# Farol de calle con brazo inclinado.
r=root('farol-calle',(2.4,2,0))
cone('Farol_base',r,(0,0,.12),.19,.13,.24,dark)
cone('Farol_poste',r,(0,0,2.5),.085,.052,4.8,metal)
bar('Farol_brazo',r,(0,0,4.86),(0,-.85,5.18),.045,metal)
box('Farol_cabezal',r,(0,-1.03,5.16),(.37,.72,.13),metal)
box('Farol_difusor',r,(0,-1.03,5.087),(.29,.57,.025),lamp)
# Cara UV frontal mira hacia -Y; al exportar glTF queda orientada hacia +Z.
def sign(name,kind,loc):
 r=root(name,loc)
 cone('Cartel_base',r,(0,0,.055),.14,.14,.11,dark)
 bar('Cartel_poste',r,(0,0,.1),(0,0,2.45),.035,metal)
 z=2.15
 if kind=='round': pts=[(.38*math.cos(2*math.pi*i/24),.38*math.sin(2*math.pi*i/24)) for i in range(24)]
 elif kind=='diamond': pts=[(0,-.48),(.48,0),(0,.48),(-.48,0)]
 else: pts=[(-.36,-.48),(.36,-.48),(.36,.48),(-.36,.48)]
 n=len(pts); verts=[(x,y,z+zz) for y in (-.055,-.025) for x,zz in pts]
 fs=[tuple(range(n)),tuple(reversed(range(n,2*n)))]
 fs += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
 mesh('Cartel_chapa',r,verts,fs,metal)
 o=mesh('Cara_SVG',r,[(x*.97,-.057,z+zz*.97) for x,zz in pts],[tuple(range(n))],face)
 uv=o.data.uv_layers.new(name='UVMap')
 # El rombo usa el cuadro completo de la imagen SVG, con las esquinas transparentes.
 w=max(x for x,_ in pts)-min(x for x,_ in pts);h=max(zz for _,zz in pts)-min(zz for _,zz in pts)
 for poly in o.data.polygons:
  for li in poly.loop_indices:
   x,zz=pts[o.data.loops[li].vertex_index];uv.data[li].uv=(x/w+.5,zz/h+.5)
 for x in (-.15,.15):
  o=cone('Cartel_abrazadera',r,(x,.005,2.15),.018,.018,.08,metal,8);o.rotation_euler.x=math.pi/2
 return r
sign('cartel-redondo','round',(4.2,2,0))
sign('cartel-rectangular','rectangle',(5.6,2,0))
sign('cartel-rombo','diamond',(7.1,2,0))
print('Creados:',[(r.name,len(r.children)) for r in roots])

