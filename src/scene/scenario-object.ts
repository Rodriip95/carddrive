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
import type { ScenarioConfig } from '../domain/scenario';

function addCrossing(object: Group, groundY: number, z: number) {
  const material = new MeshStandardMaterial({ color: 0xf7f4e8, roughness: 0.9 });
  for (let index = -3; index <= 3; index++) {
    const stripe = new Mesh(new BoxGeometry(0.28, 0.025, 2.2), material);
    stripe.position.set(index * 0.52, groundY + 0.02, z);
    stripe.receiveShadow = true;
    object.add(stripe);
  }
}

function addStopLine(object: Group, groundY: number, z: number) {
  const line = new Mesh(
    new BoxGeometry(sceneConfig.road.width, 0.025, 0.18),
    new MeshStandardMaterial({ color: 0xf7f4e8, roughness: 0.9 }),
  );
  line.position.set(0, groundY + 0.025, z);
  line.receiveShadow = true;
  object.add(line);
}

function addIntersection(object: Group, groundY: number) {
  const crossRoad = new Mesh(
    new PlaneGeometry(sceneConfig.road.width + 8, 9),
    new MeshStandardMaterial({ color: 0x343b43, roughness: 1 }),
  );
  crossRoad.rotation.x = -Math.PI / 2;
  crossRoad.position.set(0, groundY + 0.012, -9);
  crossRoad.receiveShadow = true;
  object.add(crossRoad);
  addStopLine(object, groundY, 0);
  addCrossing(object, groundY, -4.3);
}

function addPriorityVehicle(object: Group, groundY: number) {
  // Auto de referencia en la vía transversal, llegando desde la derecha.
  const vehicle = new Group();
  vehicle.position.set(-4.2, groundY, -9);
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
  pole.position.set(signX, groundY + 1.1, 8);
  object.add(pole);

  const sign = new Group();
  sign.position.set(signX, groundY + 2.65, 8);
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
  pole.position.set(lightX, groundY + 1.6, 8);
  object.add(pole);

  const housing = new Mesh(
    new BoxGeometry(0.7, 1.75, 0.48),
    new MeshStandardMaterial({ color: 0x202927, roughness: 0.5 }),
  );
  housing.position.set(lightX, groundY + 3.1, 8);
  object.add(housing);

  const lights = (['red', 'amber', 'green'] as const).map((color, index) => {
    const material = new MeshStandardMaterial({
      color: color === 'red' ? 0x5b1717 : color === 'amber' ? 0x5b4715 : 0x174b2a,
      emissive: color === 'red' ? 0xff1616 : color === 'amber' ? 0xffb000 : 0x15d45b,
      emissiveIntensity: color === 'red' ? 1.6 : 0.04,
      roughness: 0.35,
    });
    const bulb = new Mesh(new CircleGeometry(0.2, 20), material);
    bulb.position.set(lightX, groundY + 3.65 - index * 0.55, 7.74);
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

export function createScenarioObject(groundY: number, config: ScenarioConfig) {
  const object = new Group();
  object.name = config.visual.label;
  let setLight: ((active: 'red' | 'amber' | 'green') => void) | null = null;
  let waitingForGreen = false;
  let greenWait = 0;
  let decisionShown = false;

  if (config.visual.kind === 'speed-bump') {
    const bump = new Mesh(
      new CylinderGeometry(0.24, 0.24, sceneConfig.road.width, 32, 1, false, 0, Math.PI),
      new MeshStandardMaterial({ color: 0xf0c34e, roughness: 0.75 }),
    );
    bump.rotation.z = Math.PI / 2;
    bump.position.y = groundY;
    bump.castShadow = true;
    bump.receiveShadow = true;
    object.add(bump);
    const stripeMaterial = new MeshStandardMaterial({ color: 0x252a2d, roughness: 0.85 });
    for (const z of [-0.1, 0, 0.1]) {
      const stripe = new Mesh(new BoxGeometry(sceneConfig.road.width, 0.015, 0.045), stripeMaterial);
      stripe.position.set(0, groundY + 0.24, z);
      stripe.receiveShadow = true;
      object.add(stripe);
    }
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

  return { object, update, reset, waitForGreen };
}
