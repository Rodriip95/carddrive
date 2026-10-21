import { Box3, BufferGeometry, Float32BufferAttribute, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Perfil del modelo de Blender: distancia longitudinal y altura, en metros.
export const bumpProfile = [[-0.4, 0], [-0.3, 0.065], [-0.16, 0.105], [0, 0.12], [0.16, 0.105], [0.3, 0.065], [0.4, 0]] as const;

export function bumpHeightAt(x: number, z: number, width: number) {
  if (Math.abs(x) > width / 2 || Math.abs(z) >= 0.4) return 0;
  for (let i = 1; i < bumpProfile.length; i++) {
    const [a, low] = bumpProfile[i - 1]!;
    const [b, high] = bumpProfile[i]!;
    if (z <= b) return low + (high - low) * (z - a) / (b - a);
  }
  return 0;
}

export async function loadSpeedBump(url: string | undefined, width: number) {
  const object = new Group();
  let warning: string | null = null;
  try {
    if (!url) throw new Error('Falta el modelo de la loma.');
    const gltf = await new GLTFLoader().loadAsync(url);
    const bounds = new Box3().setFromObject(gltf.scene);
    const size = bounds.getSize(new Vector3());
    if (size.x <= 0 || Math.abs(size.y - 0.12) > 0.001 || Math.abs(size.z - 0.8) > 0.001) {
      throw new Error('El perfil del modelo no coincide con el contacto de las ruedas.');
    }
    // Ajustamos solo el ancho para cubrir los tres carriles.
    gltf.scene.scale.x = width / size.x;
    object.add(gltf.scene);
  } catch {
    warning = 'No se pudo cargar la loma de Blender. Se usa una loma con el mismo perfil de contacto.';
    // El reemplazo comparte exactamente el perfil físico y las franjas del GLB.
    for (let stripe = 0; stripe < 10; stripe++) {
      const x0 = -width / 2 + stripe * width / 10;
      const x1 = x0 + width / 10;
      const positions: number[] = [];
      for (let i = 1; i < bumpProfile.length; i++) {
        const [z0, y0] = bumpProfile[i - 1]!;
        const [z1, y1] = bumpProfile[i]!;
        positions.push(x0, y0, z0, x0, y1, z1, x1, y0, z0, x1, y0, z0, x0, y1, z1, x1, y1, z1);
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
      geometry.computeVertexNormals();
      object.add(new Mesh(geometry, new MeshStandardMaterial({ color: stripe % 2 ? 0x292e33 : 0xf5c51a, roughness: 0.65 })));
    }
  }
  object.traverse((child) => {
    if (child instanceof Mesh) { child.castShadow = true; child.receiveShadow = true; }
  });
  return { object, warning };
}
