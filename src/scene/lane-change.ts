// Tres carriles: -1, 0 y 1. La maniobra avanza según la distancia recorrida.
export function createLaneChange(laneWidth: number, changeDistance: number, forwardSign: number) {
  let lane = 0;
  let targetLane = 0;
  let progress = 1;
  let x = 0;
  let yaw = 0;
  let startX = 0;

  function canChange(direction: number) {
    return progress === 1 && Math.abs(lane + direction) <= 1;
  }

  function changeLane(direction: number) {
    if (!canChange(direction)) return;
    targetLane = lane + direction;
    startX = x;
    progress = 0;
  }

  function update(delta: number, speed: number) {
    progress = Math.min(1, progress + delta * Math.abs(speed) / Math.max(changeDistance, 0.001));
    // Curva quíntica: velocidad y aceleración lateral nulas en ambos extremos.
    const t = progress;
    const curve = t * t * t * (10 + t * (-15 + 6 * t));
    const slope = 30 * t * t * (1 - t) * (1 - t);
    const displacement = targetLane * laneWidth - startX;
    x = startX + displacement * curve;
    // La orientación sigue la tangente de la trayectoria y vuelve a cero al terminar.
    yaw = forwardSign * Math.atan(displacement * slope / Math.max(changeDistance, 0.001));
    if (progress === 1) lane = targetLane;
  }

  function returnToLane(safeX: number) {
    // Tras un golpe lateral volvemos desde la última posición segura al carril de origen.
    x = safeX;
    startX = safeX;
    targetLane = lane;
    progress = 0;
    yaw = 0;
  }

  return { update, changeLane, canChange, returnToLane, getX: () => x, getYaw: () => yaw };
}
