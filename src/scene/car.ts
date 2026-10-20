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

  function update(delta: number, roadSpeed: number) {
    currentSpeed = Math.abs(roadSpeed);
    laneChange.update(delta, currentSpeed);
    object.position.x = laneChange.getX();
    object.rotation.y = laneChange.getYaw();
    vehicle.update(delta, currentSpeed);
  }

  return {
    ...vehicle,
    update,
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
