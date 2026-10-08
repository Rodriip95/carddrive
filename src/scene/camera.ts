import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { sceneConfig } from './config';

export function createCamera() {
  return new PerspectiveCamera(sceneConfig.camera.fov, 1, 0.1, 100);
}

export function createCameraFollow(camera: PerspectiveCamera) {
  const offset = new Vector3();
  const { direction } = sceneConfig.camera;
  const x = Math.max(Math.abs(direction.x), 0.1);
  const z = Math.max(Math.abs(direction.z), 0.1);
  const angles = [Math.atan2(x, z), Math.atan2(-x, z), Math.atan2(x, -z), Math.atan2(-x, -z)];
  let angle = Math.atan2(direction.x, direction.z);
  let targetAngle = angle;
  let selectedCorner = (direction.z < 0 ? 2 : 0) + (direction.x < 0 ? 1 : 0);
  let horizontalDistance = 0;
  let height = 0;
  return {
    setCorner(index: number) {
      if (!Number.isInteger(index) || index < 0 || index >= angles.length) return;
      selectedCorner = index;
      targetAngle = angles[index];
    },
    getCorner: () => selectedCorner,
    getScreenRight: () => Math.cos(angle) < 0 ? -1 : 1,
    // Guardamos el encuadre cada vez que frameCamera lo recalcula.
    captureOffset() {
      horizontalDistance = Math.hypot(camera.position.x, camera.position.z);
      height = camera.position.y;
    },
    update(target: Vector3, delta = 0) {
      // Interpolamos el ángulo por el arco más corto, conservando la distancia al auto.
      const difference = Math.atan2(Math.sin(targetAngle - angle), Math.cos(targetAngle - angle));
      angle += difference * (1 - Math.exp(-4 * delta));
      offset.set(Math.sin(angle) * horizontalDistance, height, Math.cos(angle) * horizontalDistance);
      camera.position.copy(offset).add(target);
      camera.lookAt(target);
    },
  };
}

// Encuadra una esfera que contiene el auto y todo su movimiento vertical.
export function frameCamera(camera: PerspectiveCamera, radius: number, aspect: number) {
  camera.aspect = aspect;
  const verticalFov = MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const distance = radius / Math.sin(Math.min(verticalFov, horizontalFov) / 2);
  const { direction, distanceMultiplier } = sceneConfig.camera;
  camera.position.set(direction.x, direction.y, direction.z)
    .normalize().multiplyScalar(distance * distanceMultiplier);
  camera.far = Math.max(300, distance * distanceMultiplier + radius * 4);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}
