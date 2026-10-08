// Cambiá estos valores para experimentar sin tocar la lógica de la escena.
export const sceneConfig = {
  background: 0xb9d9ed,
  sky: {
    transitionSeconds: 6, // Duración aproximada del cambio entre día y noche.
  },
  road: {
    width: 7,
    length: 240,
    speed: -8, // Unidades por segundo; negativo invierte el sentido y 0 detiene el camino.
    markerSpacing: 6,
    maxSpeed: 32,
    speedStep: 4, // Cambio de velocidad objetivo por pulsación.
    acceleration: 6, // Unidades por segundo al cuadrado; menor valor = transición más lenta.
  },
  camera: {
    fov: 45,
    direction: { x: 1, y: 0.5, z: -2 },
    distanceMultiplier: 2, // Mayor valor = cámara más lejos. Usar al menos 1.
  },
  car: {
    lights: {
      intensity: 70, // Potencia de cada faro delantero.
      height: -0.12, // Altura relativa al centro del modelo, como fracción de su altura.
    },
    laneChangeDistance: 32, // Recorrido de cada cambio; mayor valor = curva más suave.
    size: 3, // Dimensión mayor del modelo en unidades de la escena.
    floatAmplitude: 0.008, // Altura máxima del salto desde el suelo; 0 lo deja apoyado.
    floatSpeed: 10, // Velocidad en radianes por segundo.
    floatFrequencyBoost: 0.5, // Hasta un 50 % más de frecuencia a velocidad máxima.
  },
};
