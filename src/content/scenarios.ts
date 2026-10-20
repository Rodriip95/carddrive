import type { ScenarioConfig } from '../domain/scenario';

export const scenarios: ScenarioConfig[] = [
  {
    id: 'loma-de-burro',
    title: 'Loma de burro',
    intro: 'Seguí la señal de advertencia y elegí cómo aproximarte. La situación aparecerá al acercarte a la loma.',
    visual: { kind: 'speed-bump', label: 'Loma de burro' },
    trigger: { kind: 'distance', startDistance: 56, decisionDistance: 14 },
    events: {
      safe: { targetSpeed: 4, bounce: 0.7, shake: 0.25 },
      unsafe: { bounce: 2.5, shake: 1 },
    },
    decision: {
      id: 'aproximacion-loma-de-burro',
      prompt: 'La señal advierte una loma de burro más adelante. ¿Qué conducta es la más segura?',
      options: [
        { id: 'reducir-antes', label: 'Reducir la velocidad antes de llegar y cruzar con suavidad.' },
        { id: 'frenar-encima', label: 'Frenar bruscamente cuando las ruedas ya estén sobre la loma.' },
        { id: 'acelerar-loma', label: 'Acelerar para pasar la loma lo más rápido posible.' },
      ],
      correctOptionId: 'reducir-antes',
      explanation: 'La señal anticipa un cambio en la calzada. Reducir la velocidad antes de la loma y cruzarla suavemente ayuda a mantener el control y evita frenadas o aceleraciones bruscas.',
    },
  },
  {
    id: 'cruce-peatonal',
    title: 'Cruce peatonal',
    intro: 'Se aproxima un cruce peatonal. Prestá atención a la señal y decidí cómo avanzar.',
    visual: { kind: 'pedestrian-crossing', label: 'Cruce peatonal' },
    trigger: { kind: 'distance', startDistance: 56, decisionDistance: 14 },
    events: {
      safe: { targetSpeed: 3, bounce: 0.3, shake: 0.12 },
      unsafe: { bounce: 1.8, shake: 0.7 },
    },
    decision: {
      id: 'aproximacion-cruce-peatonal',
      prompt: 'Hay un cruce peatonal más adelante. ¿Qué deberías hacer?',
      options: [
        { id: 'ceder-paso', label: 'Reducir la velocidad y estar listo para ceder el paso.' },
        { id: 'mantener-velocidad', label: 'Mantener la velocidad porque todavía no ves peatones.' },
        { id: 'tocar-bocina', label: 'Tocar bocina y atravesar el cruce sin reducir la velocidad.' },
      ],
      correctOptionId: 'ceder-paso',
      explanation: 'Al aproximarte a un cruce peatonal, reducí la velocidad, observá ambos lados y cedé el paso a quien esté cruzando o por cruzar.',
    },
  },
];
