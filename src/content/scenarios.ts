import type { ScenarioConfig } from '../domain/scenario';

export const scenarios: ScenarioConfig[] = [
  {
    id: 'loma-de-burro',
    title: 'Loma de burro',
    intro: 'Seguí la señal de advertencia y elegí cómo aproximarte. La situación aparecerá al acercarte a la loma.',
    visual: { kind: 'speed-bump', label: 'Loma de burro' },
    trigger: { kind: 'distance', startDistance: 56, decisionDistance: 14 },
    events: {
      safe: { effect: 'adjust-speed', targetSpeed: 4, bounce: 0.7, shake: 0.25 },
      unsafe: { effect: 'impact', bounce: 2.5, shake: 1 },
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
      safe: { effect: 'adjust-speed', targetSpeed: 3, bounce: 0.3, shake: 0.12 },
      unsafe: { effect: 'impact', bounce: 1.8, shake: 0.7 },
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
  {
    id: 'senal-pare',
    title: 'Señal PARE',
    intro: 'Acercate a la intersección y observá la señal y la línea de detención. Elegí cómo continuar con seguridad.',
    visual: { kind: 'stop-intersection', label: 'Intersección con PARE' },
    trigger: { kind: 'distance', startDistance: 90, decisionDistance: 25 },
    maxSpeed: 16,
    events: {
      safe: { effect: 'stop', targetSpeed: 0, settleMs: 2800 },
      unsafe: { effect: 'impact', bounce: 1.3, shake: 0.75 },
    },
    source: {
      title: 'Decreto 779/1995, Anexo L — Sistema de Señalización Vial Uniforme',
      publisher: 'Estado Nacional Argentino',
      jurisdiction: 'Argentina, nacional; alcance provincial sujeto a Ley 13.927',
      reference: 'Capítulo III, punto 11, señal R.27 Pare; detenerse antes de la encrucijada.',
      url: 'https://www.argentina.gob.ar/normativa/recurso/30389/texactdto779-1995-anexoL/htm',
    },
    decision: {
      id: 'detencion-senal-pare',
      prompt: 'Llegás a una intersección señalizada con PARE. ¿Qué deberías hacer?',
      options: [
        { id: 'pare-detenerse', label: 'Detenerme por completo antes de la línea y avanzar cuando el cruce esté libre.' },
        { id: 'pare-ceder-sin-detener', label: 'Reducir la velocidad y seguir si no veo otros vehículos.' },
        { id: 'pare-frenar-despues', label: 'Frenar después de la línea para mirar mejor la intersección.' },
      ],
      correctOptionId: 'pare-detenerse',
      explanation: 'PARE exige detener completamente el vehículo antes de la línea de detención o, si no existe, antes de la senda peatonal. Después, avanzá cuando el cruce esté despejado y sea seguro.',
    },
  },
  {
    id: 'semaforo-rojo-cruce-peatonal',
    title: 'Semáforo y cruce peatonal',
    intro: 'La luz roja regula la intersección y hay una senda peatonal. Identificá dónde detenerte y cuándo podés avanzar.',
    visual: { kind: 'traffic-light', label: 'Semáforo y cruce peatonal' },
    trigger: { kind: 'distance', startDistance: 90, decisionDistance: 25 },
    maxSpeed: 16,
    events: {
      safe: { effect: 'stop', targetSpeed: 0, settleMs: 2800 },
      unsafe: { effect: 'impact', bounce: 1.5, shake: 0.9 },
    },
    source: {
      title: 'Ley 24.449 — Tránsito y Seguridad Vial, texto actualizado',
      publisher: 'Estado Nacional Argentino',
      jurisdiction: 'Argentina, nacional; alcance provincial sujeto a Ley 13.927',
      reference: 'Artículo 44, incisos a) 1 y 2, y b): luz roja, detención antes de línea o senda, luz verde y cruce peatonal.',
      url: 'https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/actualizacion',
    },
    decision: {
      id: 'semaforo-rojo-cruce-peatonal',
      prompt: 'El semáforo está en rojo y te acercás a una senda peatonal. ¿Cuál es la conducta correcta?',
      options: [
        { id: 'rojo-detener', label: 'Detenerme antes de la línea y esperar la luz verde, sin invadir la senda.' },
        { id: 'rojo-avanzar', label: 'Avanzar despacio si no veo peatones en ese momento.' },
        { id: 'rojo-acelerar', label: 'Acelerar para despejar el cruce antes de que llegue alguien.' },
      ],
      correctOptionId: 'rojo-detener',
      explanation: 'Con luz roja hay que detenerse antes de la línea marcada o de la senda peatonal. Esperá la habilitación verde y permití que terminen de cruzar las personas que ya iniciaron el cruce.',
    },
  },
  {
    id: 'prioridad-derecha-marcas-viales',
    title: 'Prioridad de paso y marcas viales',
    intro: 'Se aproxima una encrucijada urbana sin semáforo ni señal de prioridad. Observá el vehículo que llega desde tu derecha y la senda peatonal.',
    visual: { kind: 'priority-intersection', label: 'Encrucijada sin señalizar' },
    trigger: { kind: 'distance', startDistance: 90, decisionDistance: 25 },
    maxSpeed: 16,
    events: {
      safe: { effect: 'adjust-speed', targetSpeed: 3, bounce: 0.2, shake: 0.08 },
      unsafe: { effect: 'impact', bounce: 1.5, shake: 0.85 },
    },
    source: {
      title: 'Ley 24.449, artículo 41 y Decreto 779/1995, Anexo L',
      publisher: 'Estado Nacional Argentino',
      jurisdiction: 'Argentina; Provincia de Buenos Aires adhiere por Ley 13.927',
      reference: 'Art. 41, prioridad del vehículo que cruza desde la derecha y excepciones; Anexo L, marcas H.4 Línea de detención y H.5 Senda peatonal.',
      url: 'https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/actualizacion',
    },
    decision: {
      id: 'ceder-prioridad-derecha',
      prompt: 'Ambas calles están pavimentadas y no hay señalización que cambie la prioridad. Un auto se acerca desde tu derecha. ¿Cómo actuás?',
      options: [
        { id: 'ceder-derecha', label: 'Reducir la velocidad, cederle el paso y cruzar cuando la encrucijada esté libre.' },
        { id: 'pasar-primero', label: 'Acelerar porque mi vehículo ya está más cerca del cruce.' },
        { id: 'detener-siempre', label: 'Detenerme siempre y asumir que la línea blanca por sí sola otorga prioridad al otro auto.' },
      ],
      correctOptionId: 'ceder-derecha',
      explanation: 'En esta situación equivalente y sin señalización específica, debe cederse al vehículo que cruza desde la derecha. La prioridad tiene excepciones: entre ellas, señalización en contrario, ferrocarriles, servicios de urgencia en misión, semiautopistas, peatones en la senda y reglas de rotonda; también cambia en ciertos ingresos o maniobras. La línea H.4 indica dónde detenerse cuando lo exige la autoridad, una señal o semáforo, un cruce peatonal o ferroviario, o si la bocacalle está ocupada: no asigna por sí sola la prioridad entre vehículos. La senda H.5 es el lugar de cruce peatonal y quienes cruzan allí tienen prioridad, salvo indicación de semáforo o autoridad.',
    },
  },
];
