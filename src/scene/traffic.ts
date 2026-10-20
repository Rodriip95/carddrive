import { Group, MathUtils } from 'three';
import { sceneConfig } from './config';
import { loadVehicle } from './vehicle';

export async function loadTraffic(groundY: number) {
  const object = new Group();
  object.name = 'traffic';
  const { minSpeed, maxSpeed, truckSize, busSize } = sceneConfig.traffic;
  const forward = -(Math.sign(sceneConfig.road.speed) || -1);
  const halfLength = sceneConfig.road.length / 2 - 10;
  const models = [
    { name: 'truck', url: '/models/camion.glb', size: truckSize, lightHeight: -0.095, lane: -1, z: 12 },
    { name: 'bus', url: '/models/colectivo.glb', size: busSize, lightHeight: -0.16, lane: 1, z: 22 },
  ];
  const vehicles = await Promise.all(models.map(async (model) => {
    const vehicle = await loadVehicle(model.url, model.size, model.lightHeight);
    const placement = new Group();
    placement.name = model.name;
    // Cada modelo tiene distinta altura: alineamos su base con el mismo asfalto.
    placement.position.set(model.lane * sceneConfig.road.width / 3, groundY - vehicle.groundY, model.z * forward);
    placement.rotation.y = forward === 1 ? 0 : Math.PI;
    placement.add(vehicle.object);
    object.add(placement);
    const speed = MathUtils.randFloat(minSpeed, maxSpeed);
    return { vehicle, placement, speed, currentSpeed: speed };
  }));

  function update(delta: number, playerSpeed: number, nightAmount: number) {
    for (const entry of vehicles) {
      const { vehicle, placement, speed } = entry;
      // Después de frenar por un contacto, recupera gradualmente su velocidad propia.
      entry.currentSpeed = Math.min(speed, entry.currentSpeed + sceneConfig.road.acceleration * delta);
      // El jugador permanece en Z=0; el tráfico se mueve a velocidad relativa.
      placement.position.z += (entry.currentSpeed - playerSpeed) * forward * delta;
      // Reciclamos el vehículo detrás de la niebla, sin crear otra malla.
      placement.position.z = MathUtils.euclideanModulo(placement.position.z + halfLength, halfLength * 2) - halfLength;
      vehicle.update(delta, entry.currentSpeed);
      vehicle.updateLights(nightAmount);
    }
  }

  return { object, update, vehicles };
}
