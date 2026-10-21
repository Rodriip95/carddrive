import { Box3, Group, Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { sceneConfig } from './config';
import { createCarLights } from './car-lights';

// El auto y el tráfico comparten escala, apoyo sobre el suelo, rebote y luces.
export async function loadVehicle(url: string, modelSize: number, lightHeight = sceneConfig.car.lights.height) {
  const gltf = await new GLTFLoader().loadAsync(url);
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

  // El grupo interior centra y escala; el exterior mueve el vehículo en el mundo.
  const centeredModel = new Group();
  centeredModel.add(gltf.scene);
  centeredModel.position.copy(bounds.getCenter(new Vector3())).negate();
  const scaledModel = new Group();
  scaledModel.add(centeredModel);
  const scale = modelSize / longestSide;
  scaledModel.scale.setScalar(scale);
  const object = new Group();
  const body = new Group();
  body.add(scaledModel);
  object.add(body);
  const lights = createCarLights(object, size.clone().multiplyScalar(scale), lightHeight);
  body.add(lights.object);

  let bouncePhase = 0;
  function update(delta: number, speed: number) {
    const { floatAmplitude, floatSpeed, floatFrequencyBoost } = sceneConfig.car;
    speed = Math.abs(speed);
    if (speed === 0) {
      object.position.y = 0;
      bouncePhase = 0;
      return;
    }

    const speedRatio = Math.min(speed / Math.max(sceneConfig.road.maxSpeed, 0.001), 1);
    const frequency = floatSpeed * (1 + speedRatio * floatFrequencyBoost);
    // Acumular la fase evita saltos al cambiar la velocidad.
    bouncePhase = (bouncePhase + delta * frequency) % (Math.PI * 2);
    const movement = Math.min(speed / 4, 1);
    const amplitudeFactor = movement * movement * (3 - 2 * movement);
    const bounce = Math.max(0, Math.sin(bouncePhase));
    object.position.y = bounce * bounce * Math.abs(floatAmplitude) * amplitudeFactor;
  }

  function reset() {
    bouncePhase = 0;
    object.position.y = 0;
  }

  return {
    object,
    body,
    size: size.clone().multiplyScalar(scale),
    groundY: -size.y * scale / 2,
    radius: size.length() * scale / 2 + Math.abs(sceneConfig.car.floatAmplitude),
    update,
    reset,
    updateLights: lights.update,
  };
}
