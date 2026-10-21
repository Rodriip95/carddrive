import {
  BoxGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Shape,
  ShapeGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { sceneConfig } from './config';
import { bumpHeightAt, loadSpeedBump } from './speed-bump';
import type { ScenarioConfig } from '../domain/scenario';

// La línea de detención está en Z=0; el auto avanza hacia +Z.
const intersection = { centerZ: 10, width: 12, length: 100, markingStart: -2, markingEnd: 22 };
const crossingDepth = 2.8;

function addCrossing(object: Group, groundY: number, z: number, width = sceneConfig.road.width, x = 0, rotation = 0) {
  const crossing = new Group();
  crossing.name = 'senda-peatonal';
  crossing.position.set(x, groundY + 0.035, z);
  crossing.rotation.y = rotation;
  const material = new MeshStandardMaterial({ color: 0xf7f4e8, roughness: 0.9 });
  // Distribuimos las franjas según el ancho, con el mismo margen en ambas orillas.
  const margin = 0.12;
  const count = Math.max(2, Math.round(width / 0.7));
  const stripeWidth = (width - margin * 2) / (count + (count - 1) * 0.6);
  const spacing = stripeWidth * 1.6;
  const geometry = new PlaneGeometry(stripeWidth, crossingDepth);
  for (let index = 0; index < count; index++) {
    const stripe = new Mesh(geometry, material);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.x = -width / 2 + margin + stripeWidth / 2 + index * spacing;
    stripe.receiveShadow = true;
    crossing.add(stripe);
  }
  object.add(crossing);
}

function addRoadPaint(object: Group, groundY: number, x: number, z: number, width: number, length: number, color = 0xf7f4e8) {
  const paint = new Mesh(new PlaneGeometry(width, length), new MeshStandardMaterial({ color, roughness: 0.9 }));
  paint.rotation.x = -Math.PI / 2;
  paint.position.set(x, groundY + 0.035, z);
  paint.receiveShadow = true;
  object.add(paint);
}

function addStopLine(object: Group, groundY: number, z: number) {
  addRoadPaint(object, groundY, 0, z, sceneConfig.road.width - 0.24, 0.3);
}

function addIntersection(object: Group, groundY: number) {
  const { centerZ, width, length, markingStart, markingEnd } = intersection;
  const roadWidth = sceneConfig.road.width;
  function pavement(w: number, depth: number, height: number, color: number) {
    const mesh = new Mesh(new PlaneGeometry(w, depth), new MeshStandardMaterial({ color, roughness: 1 }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, groundY + height, centerZ);
    mesh.receiveShadow = true;
    object.add(mesh);
  }
  pavement(length, width + 0.8, 0.004, 0xb9ae91);
  pavement(length, width, 0.018, 0x343b43);
  // Este paño tapa las líneas longitudinales antiguas dentro del cruce y las sendas.
  pavement(roadWidth, markingEnd - markingStart, 0.02, 0x343b43);
  addStopLine(object, groundY, 0);
  addCrossing(object, groundY, 2);
  addCrossing(object, groundY, 18);
  for (const side of [-1, 1]) {
    addCrossing(object, groundY, centerZ, width, side * (roadWidth / 2 + 1.8), Math.PI / 2);
    // Detención en el carril que ingresa desde cada brazo transversal.
    addRoadPaint(object, groundY, side * (roadWidth / 2 + 3.8), centerZ + side * width / 4, 0.3, width / 2 - 0.24);
    const start = roadWidth / 2 + 5;
    const end = length / 2;
    const segmentLength = end - start;
    for (const edge of [-1, 1]) {
      addRoadPaint(object, groundY, side * (start + end) / 2, centerZ + edge * (width / 2 - 0.2), segmentLength, 0.1);
      // Doble línea central, interrumpida antes de la senda y del área de cruce.
      addRoadPaint(object, groundY, side * (start + end) / 2, centerZ + edge * 0.1, segmentLength, 0.1, 0xffe5a0);
      for (let distance = start; distance + 2.5 < end; distance += 5) {
        addRoadPaint(object, groundY, side * (distance + 1.25), centerZ + edge * width / 4, 2.5, 0.1);
      }
    }
    // Bordes de la calle principal hasta las esquinas, sin cruzar la calzada transversal.
    for (const z of [1, 19]) addRoadPaint(object, groundY, side * (roadWidth / 2 - 0.2), z, 0.09, 6);
  }
}

function addPriorityVehicle(object: Group, groundY: number) {
  // Auto de referencia en la vía transversal, llegando desde la derecha.
  const vehicle = new Group();
  vehicle.position.set(-10, groundY, intersection.centerZ - intersection.width / 4);
  const body = new Mesh(
    new BoxGeometry(2.3, 0.65, 1.05),
    new MeshStandardMaterial({ color: 0x2878a8, roughness: 0.65 }),
  );
  body.position.y = 0.48;
  body.castShadow = true;
  vehicle.add(body);
  const cabin = new Mesh(
    new BoxGeometry(1.15, 0.55, 0.88),
    new MeshStandardMaterial({ color: 0xb9d9e8, roughness: 0.45, metalness: 0.05 }),
  );
  cabin.position.set(-0.12, 1.02, 0);
  cabin.castShadow = true;
  vehicle.add(cabin);
  const front = new Mesh(
    new BoxGeometry(0.08, 0.14, 0.72),
    new MeshStandardMaterial({ color: 0xf4e9a6, emissive: 0x5b4715, roughness: 0.45 }),
  );
  front.position.set(1.16, 0.49, 0);
  vehicle.add(front);
  object.add(vehicle);
}

function addWarningSign(object: Group, groundY: number, config: ScenarioConfig) {
  const signX = sceneConfig.road.width / 2 + 1.1;
  const pole = new Mesh(
    new CylinderGeometry(0.045, 0.065, 1.75, 8),
    new MeshStandardMaterial({ color: 0x7b8580, metalness: 0.2, roughness: 0.7 }),
  );
  pole.position.set(signX, groundY + 0.875, 8);
  object.add(pole);

  const sign = new Group();
  sign.position.set(signX, groundY + 2.05, 8);
  sign.rotation.y = Math.PI;
  object.add(sign);

  const triangle = new Shape();
  triangle.moveTo(0, 0.82);
  triangle.lineTo(-0.76, -0.55);
  triangle.lineTo(0.76, -0.55);
  triangle.closePath();
  sign.add(new Mesh(new ShapeGeometry(triangle), new MeshStandardMaterial({ color: 0xd84235, side: DoubleSide, roughness: 0.6 })));

  const faceShape = new Shape();
  faceShape.moveTo(0, 0.65);
  faceShape.lineTo(-0.59, -0.43);
  faceShape.lineTo(0.59, -0.43);
  faceShape.closePath();
  const face = new Mesh(new ShapeGeometry(faceShape), new MeshStandardMaterial({ color: 0xfff8e8, side: DoubleSide, roughness: 0.65 }));
  face.position.z = 0.025;
  sign.add(face);

  const iconMaterial = new MeshStandardMaterial({ color: 0x202b2a, roughness: 0.7 });
  if (config.visual.kind === 'speed-bump') {
    const bumpIcon = new CatmullRomCurve3([
      new Vector3(-0.34, -0.12, 0.055), new Vector3(-0.2, -0.12, 0.055),
      new Vector3(-0.08, 0.1, 0.055), new Vector3(0.08, 0.1, 0.055),
      new Vector3(0.2, -0.12, 0.055), new Vector3(0.34, -0.12, 0.055),
    ]);
    sign.add(new Mesh(new TubeGeometry(bumpIcon, 24, 0.045, 6, false), iconMaterial));
  } else {
    const head = new Mesh(new CircleGeometry(0.1, 12), iconMaterial);
    head.position.set(0, 0.27, 0.06);
    sign.add(head);
    const person = new CatmullRomCurve3([
      new Vector3(0, 0.17, 0.06), new Vector3(-0.05, -0.08, 0.06),
      new Vector3(-0.25, -0.38, 0.06), new Vector3(0.02, -0.05, 0.06),
      new Vector3(0.28, -0.28, 0.06),
    ]);
    sign.add(new Mesh(new TubeGeometry(person, 24, 0.055, 6, false), iconMaterial));
  }
}

function addStopSign(object: Group, groundY: number) {
  const signX = sceneConfig.road.width / 2 + 1.1;
  const pole = new Mesh(
    new CylinderGeometry(0.05, 0.065, 2.2, 8),
    new MeshStandardMaterial({ color: 0x7b8580, metalness: 0.2, roughness: 0.7 }),
  );
  pole.position.set(signX, groundY + 1.1, -0.8);
  object.add(pole);

  const sign = new Group();
  sign.position.set(signX, groundY + 2.65, -0.8);
  sign.rotation.y = Math.PI;
  object.add(sign);
  const octagon = new Shape();
  const radius = 0.82;
  for (let index = 0; index < 8; index++) {
    const angle = Math.PI / 8 + index * Math.PI / 4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) octagon.moveTo(x, y);
    else octagon.lineTo(x, y);
  }
  octagon.closePath();
  sign.add(new Mesh(new ShapeGeometry(octagon), new MeshStandardMaterial({ color: 0xffffff, side: DoubleSide, roughness: 0.6 })));

  const inner = new Shape();
  for (let index = 0; index < 8; index++) {
    const angle = Math.PI / 8 + index * Math.PI / 4;
    const x = Math.cos(angle) * 0.74;
    const y = Math.sin(angle) * 0.74;
    if (index === 0) inner.moveTo(x, y);
    else inner.lineTo(x, y);
  }
  inner.closePath();
  const redFace = new Mesh(new ShapeGeometry(inner), new MeshStandardMaterial({ color: 0xc93431, side: DoubleSide, roughness: 0.55 }));
  redFace.position.z = 0.025;
  sign.add(redFace);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#ffffff';
    context.font = 'bold 112px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('PARE', 256, 84);
  }
  const textMaterial = new MeshStandardMaterial({ map: new CanvasTexture(canvas), transparent: true, side: DoubleSide });
  const text = new Mesh(new PlaneGeometry(1.12, 0.35), textMaterial);
  text.position.z = 0.055;
  sign.add(text);
}

function addTrafficLight(object: Group, groundY: number) {
  const lightX = sceneConfig.road.width / 2 + 1.2;
  const pole = new Mesh(
    new CylinderGeometry(0.055, 0.075, 3.2, 8),
    new MeshStandardMaterial({ color: 0x59645f, metalness: 0.25, roughness: 0.65 }),
  );
  pole.position.set(lightX, groundY + 1.6, -0.8);
  object.add(pole);

  const housing = new Mesh(
    new BoxGeometry(0.7, 1.75, 0.48),
    new MeshStandardMaterial({ color: 0x202927, roughness: 0.5 }),
  );
  housing.position.set(lightX, groundY + 3.1, -0.8);
  object.add(housing);

  const lights = (['red', 'amber', 'green'] as const).map((color, index) => {
    const material = new MeshStandardMaterial({
      color: color === 'red' ? 0x5b1717 : color === 'amber' ? 0x5b4715 : 0x174b2a,
      emissive: color === 'red' ? 0xff1616 : color === 'amber' ? 0xffb000 : 0x15d45b,
      emissiveIntensity: color === 'red' ? 1.6 : 0.04,
      roughness: 0.35,
    });
    const bulb = new Mesh(new CircleGeometry(0.2, 20), material);
    bulb.position.set(lightX, groundY + 3.65 - index * 0.55, -1.06);
    object.add(bulb);
    return bulb;
  });

  return (active: 'red' | 'amber' | 'green') => {
    lights.forEach((light, index) => {
      const material = light.material as MeshStandardMaterial;
      material.emissiveIntensity = (['red', 'amber', 'green'] as const)[index] === active ? 1.6 : 0.04;
    });
  };
}

export async function createScenarioObject(groundY: number, config: ScenarioConfig) {
  const object = new Group();
  object.name = config.visual.label;
  let setLight: ((active: 'red' | 'amber' | 'green') => void) | null = null;
  let waitingForGreen = false;
  let greenWait = 0;
  let decisionShown = false;
  let assetWarning: string | null = null;

  if (config.visual.kind === 'speed-bump') {
    const bump = await loadSpeedBump(config.visual.asset, sceneConfig.road.width);
    bump.object.position.y = groundY;
    object.add(bump.object);
    assetWarning = bump.warning;
    addWarningSign(object, groundY, config);
  } else if (config.visual.kind === 'pedestrian-crossing') {
    addCrossing(object, groundY, 0);
    addWarningSign(object, groundY, config);
  } else {
    addIntersection(object, groundY);
    if (config.visual.kind === 'stop-intersection') addStopSign(object, groundY);
    else if (config.visual.kind === 'traffic-light') setLight = addTrafficLight(object, groundY);
    else addPriorityVehicle(object, groundY);
  }

  object.position.z = config.trigger.startDistance;

  function update(delta: number, speed: number) {
    const forward = -(Math.sign(sceneConfig.road.speed) || -1);
    object.position.z -= Math.abs(speed) * forward * delta;
    if (waitingForGreen) {
      greenWait += delta;
      if (greenWait >= 2.2) {
        setLight?.('green');
        waitingForGreen = false;
      } else if (greenWait >= 1.4) {
        setLight?.('amber');
      }
    }
    if (!decisionShown && object.position.z <= config.trigger.decisionDistance) {
      decisionShown = true;
      return true;
    }
    return false;
  }

  function reset() {
    object.position.z = config.trigger.startDistance;
    decisionShown = false;
    waitingForGreen = false;
    greenWait = 0;
    setLight?.('red');
  }

  function waitForGreen() {
    if (!setLight) return;
    waitingForGreen = true;
    greenWait = 0;
    setLight('red');
  }

  // Distancia desde el origen del objeto (línea de detención o inicio de la marca) al centro del auto.
  return {
    object, update, reset, waitForGreen, assetWarning,
    getDistance: () => object.position.z,
    getMarkingGap: () => {
      if (config.visual.kind === 'speed-bump') return null;
      const crossingOnly = config.visual.kind === 'pedestrian-crossing';
      return {
        start: object.position.z + (crossingOnly ? -crossingDepth / 2 - 0.3 : intersection.markingStart),
        end: object.position.z + (crossingOnly ? crossingDepth / 2 + 0.3 : intersection.markingEnd),
        hidePosts: !crossingOnly,
      };
    },
    getSurfaceHeight: (x: number, z: number) => groundY + (config.visual.kind === 'speed-bump'
      ? bumpHeightAt(x, z - object.position.z, sceneConfig.road.width) : 0),
  };
}
