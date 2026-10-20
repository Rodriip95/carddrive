import { sceneConfig } from './config';
import { createLaneChange } from './lane-change';
import { loadVehicle } from './vehicle';

export async function loadCar() {
  const vehicle = await loadVehicle('/models/car.glb', sceneConfig.car.size);
  const { object } = vehicle;
  let currentSpeed = Math.abs(sceneConfig.road.speed);
  const laneChange = createLaneChange(
    sceneConfig.road.width / 3,
    sceneConfig.car.laneChangeDistance,
    -(Math.sign(sceneConfig.road.speed) || -1),
  );
  let bumpHeight = 0;
  let bumpVelocity = 0;

  function update(delta: number, roadSpeed: number) {
    currentSpeed = Math.abs(roadSpeed);
    laneChange.update(delta, currentSpeed);
    object.position.x = laneChange.getX();
    object.rotation.y = laneChange.getYaw();
    vehicle.update(delta, currentSpeed);
    if (bumpVelocity !== 0 || bumpHeight > 0) {
      bumpVelocity -= 6.5 * delta;
      bumpHeight += bumpVelocity * delta;
      if (bumpHeight <= 0) {
        bumpHeight = 0;
        bumpVelocity = 0;
      }
      object.position.y += bumpHeight;
    }
  }

  return {
    ...vehicle,
    update,
    reset() {
      laneChange.reset();
      vehicle.reset();
      bumpHeight = 0;
      bumpVelocity = 0;
      object.position.set(0, 0, 0);
      object.rotation.set(0, 0, 0);
    },
    triggerBump(impulse: number) {
      bumpVelocity = Math.max(bumpVelocity, impulse);
    },
    blockLaneChange(safeX: number) {
      laneChange.returnToLane(safeX);
      object.position.x = safeX;
      object.rotation.y = 0;
    },
    canChangeLane: (direction: number) => currentSpeed > 0 && laneChange.canChange(direction),
    changeLane: (direction: number) => {
      if (currentSpeed > 0) laneChange.changeLane(direction);
    },
  };
}
