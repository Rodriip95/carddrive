import {
  BoxGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Shape,
  ShapeGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { sceneConfig } from './config';
import type { ScenarioConfig } from '../domain/scenario';

export function createSpeedBump(groundY: number, config: ScenarioConfig) {
  const object = new Group();
  object.name = config.visual.label;

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
  } else {
    const crossingMaterial = new MeshStandardMaterial({ color: 0xf7f4e8, roughness: 0.9 });
    for (let index = -3; index <= 3; index++) {
      const stripe = new Mesh(new BoxGeometry(0.28, 0.025, 2.2), crossingMaterial);
      stripe.position.set(index * 0.52, groundY + 0.015, 0);
      stripe.receiveShadow = true;
      object.add(stripe);
    }
  }

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
  const border = new Mesh(new ShapeGeometry(triangle), new MeshStandardMaterial({ color: 0xd84235, side: DoubleSide, roughness: 0.6 }));
  border.position.z = 0.02;
  sign.add(border);

  const faceShape = new Shape();
  faceShape.moveTo(0, 0.65);
  faceShape.lineTo(-0.59, -0.43);
  faceShape.lineTo(0.59, -0.43);
  faceShape.closePath();
  const face = new Mesh(new ShapeGeometry(faceShape), new MeshStandardMaterial({ color: 0xfff8e8, side: DoubleSide, roughness: 0.65 }));
  face.position.z = 0.035;
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
    const head = new Mesh(new CylinderGeometry(0.1, 0.1, 0.04, 12), iconMaterial);
    head.position.set(0, 0.27, 0.06);
    sign.add(head);
    const person = new CatmullRomCurve3([
      new Vector3(0, 0.17, 0.06), new Vector3(-0.05, -0.08, 0.06),
      new Vector3(-0.25, -0.38, 0.06), new Vector3(0.02, -0.05, 0.06),
      new Vector3(0.28, -0.28, 0.06),
    ]);
    sign.add(new Mesh(new TubeGeometry(person, 24, 0.055, 6, false), iconMaterial));
  }

  object.position.z = config.trigger.startDistance;
  let decisionShown = false;

  function update(delta: number, speed: number) {
    const forward = -(Math.sign(sceneConfig.road.speed) || -1);
    object.position.z -= Math.abs(speed) * forward * delta;
    if (!decisionShown && object.position.z <= config.trigger.decisionDistance) {
      decisionShown = true;
      return true;
    }
    return false;
  }

  function reset() {
    object.position.z = config.trigger.startDistance;
    decisionShown = false;
  }

  return { object, update, reset };
}
