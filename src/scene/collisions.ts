import { Vector2 } from 'three';
import type { loadCar } from './car';
import type { loadTraffic } from './traffic';
import type { createRoad } from './road';
import type { createCameraFollow } from './camera';
import { sceneConfig } from './config';

export function createCollisions(
  car: Awaited<ReturnType<typeof loadCar>>,
  traffic: Awaited<ReturnType<typeof loadTraffic>>,
  road: ReturnType<typeof createRoad>,
  cameraFollow: ReturnType<typeof createCameraFollow>,
) {
  const forward = -(Math.sign(sceneConfig.road.speed) || -1);
  const previous = traffic.vehicles.map(() => new Vector2());
  const touching = traffic.vehicles.map(() => false);
  let previousX = car.object.position.x;
  let previousHalfWidth = car.size.x / 2;

  function halfWidth() {
    const yaw = car.object.rotation.y;
    // La caja crece al girar: también protege las esquinas durante una maniobra.
    return (Math.abs(Math.cos(yaw)) * car.size.x + Math.abs(Math.sin(yaw)) * car.size.z) / 2;
  }

  function halfLength() {
    const yaw = car.object.rotation.y;
    return (Math.abs(Math.sin(yaw)) * car.size.x + Math.abs(Math.cos(yaw)) * car.size.z) / 2;
  }

  function capturePrevious() {
    previousX = car.object.position.x;
    previousHalfWidth = halfWidth();
    traffic.vehicles.forEach(({ placement }, index) => {
      previous[index]!.set(placement.position.x, placement.position.z);
    });
  }

  function resolve() {
    const { gap } = sceneConfig.collisions;
    traffic.vehicles.forEach((entry, index) => {
      const { vehicle, placement } = entry;
      const width = halfWidth() + vehicle.size.x / 2 + gap;
      const length = halfLength() + vehicle.size.z / 2 + gap;
      const dx = car.object.position.x - placement.position.x;
      const dz = placement.position.z - car.object.position.z;
      if (Math.abs(dx) >= width || Math.abs(dz) >= length) {
        // Una pequeña tolerancia evita repetir la vibración mientras siguen en contacto.
        if (Math.abs(dx) > width + 0.15 || Math.abs(dz) > length + 0.15) touching[index] = false;
        return;
      }

      const previousDx = previousX - previous[index]!.x;
      const lateral = Math.abs(previousDx) >= previousHalfWidth + vehicle.size.x / 2 + gap - 0.001;
      const relativeSpeed = Math.abs(road.getSpeed() - entry.currentSpeed);
      const ahead = previous[index]!.y * forward >= 0;
      if (!touching[index]) {
        road.applyCollision(!lateral && ahead ? entry.currentSpeed * 0.8 : undefined);
        cameraFollow.shake(0.3 + relativeSpeed / 20);
      }
      touching[index] = true;

      if (lateral) car.blockLaneChange(previousX);

      // Primero anulamos la entrada lateral; si aún hay contacto, separamos en Z.
      const safeWidth = halfWidth() + vehicle.size.x / 2 + gap;
      if (Math.abs(car.object.position.x - placement.position.x) < safeWidth) {
        const side = Math.sign(previous[index]!.y) || Math.sign(dz) || forward;
        placement.position.z = car.object.position.z + side * (halfLength() + vehicle.size.z / 2 + gap);
        if (!ahead) entry.currentSpeed = Math.min(entry.currentSpeed, road.getSpeed());
      }
    });
  }

  return { capturePrevious, resolve };
}
