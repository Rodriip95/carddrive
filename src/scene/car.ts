import { Box3, Group, Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import carUrl from '../assets/car.glb?url';
import { sceneConfig } from './config';
import { createLaneChange } from './lane-change';
import { createCarLights } from './car-lights';

export async function loadCar() {
  const gltf = await new GLTFLoader().loadAsync(carUrl);
  gltf.scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  const bounds = new Box3().setFromObject(gltf.scene, true);
  const size = bounds.getSize(new Vector3());
  const longestSide = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(longestSide) || longestSide <= 0) {
    throw new Error('El modelo no tiene geometría visible con un tamaño válido.');
  }

  // El grupo interior centra y escala; el exterior mueve el auto en unidades del mundo.
  const centeredModel = new Group();
  centeredModel.add(gltf.scene);
  centeredModel.position.copy(bounds.getCenter(new Vector3())).negate();
  const scaledModel = new Group();
  scaledModel.add(centeredModel);
  const scale = sceneConfig.car.size / longestSide;
  scaledModel.scale.setScalar(scale);
  const object = new Group();
  object.add(scaledModel);
  const lights = createCarLights(object, size.clone().multiplyScalar(scale));
  object.add(lights.object);

  let bouncePhase = 0;
  let currentSpeed = Math.abs(sceneConfig.road.speed);
  const laneChange = createLaneChange(
    sceneConfig.road.width / 3,
    sceneConfig.car.laneChangeDistance,
    -(Math.sign(sceneConfig.road.speed) || -1),
  );

  function update(delta: number, roadSpeed: number) {
    const { floatAmplitude, floatSpeed, floatFrequencyBoost } = sceneConfig.car;
    const speed = Math.abs(roadSpeed);
    currentSpeed = speed;
    laneChange.update(delta, speed);
    object.position.x = laneChange.getX();
    object.rotation.y = laneChange.getYaw();
    if (speed === 0) {
      object.position.y = 0;
      bouncePhase = 0;
      return;
    }

    const speedRatio = Math.min(speed / Math.max(sceneConfig.road.maxSpeed, 0.001), 1);
    const frequency = floatSpeed * (1 + speedRatio * floatFrequencyBoost);
    // Acumulamos la fase para que variar la frecuencia no produzca saltos de posición.
    bouncePhase = (bouncePhase + delta * frequency) % (Math.PI * 2);
    // Cerca de cero, la altura desaparece suavemente hasta apoyar el auto.
    const movement = Math.min(speed / 4, 1);
    const amplitudeFactor = movement * movement * (3 - 2 * movement);
    // Permanece apoyado entre pequeños saltos, sin atravesar el asfalto.
    const bounce = Math.max(0, Math.sin(bouncePhase));
    object.position.y = bounce * bounce * Math.abs(floatAmplitude) * amplitudeFactor;
  }

  return {
    object,
    // El punto más bajo del salto coincide con la superficie de la carretera.
    groundY: -size.y * scale / 2,
    radius: size.length() * scale / 2 + Math.abs(sceneConfig.car.floatAmplitude),
    update,
    updateLights: lights.update,
    canChangeLane: (direction: number) => currentSpeed > 0 && laneChange.canChange(direction),
    changeLane: (direction: number) => {
      if (currentSpeed > 0) laneChange.changeLane(direction);
    },
  };
}
