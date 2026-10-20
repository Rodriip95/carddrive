import type { TrafficSignal } from '../domain/signals';

const annexL = (reference: string) => ({
  title: 'Decreto 779/1995, Anexo L — Sistema de Señalización Vial Uniforme',
  publisher: 'Estado Nacional Argentino',
  jurisdiction: 'Argentina, nacional; alcance provincial sujeto a Ley 13.927',
  reference,
  url: 'https://www.argentina.gob.ar/normativa/recurso/30389/texactdto779-1995-anexoL/htm',
});

export const provincialSignalScope = {
  text: 'La Provincia de Buenos Aires adhiere a las Leyes Nacionales 24.449 y 26.363 en cuanto no se opongan a la Ley provincial 13.927. Las reglas locales y la señalización instalada en cada vía también deben respetarse.',
  source: {
    title: 'Ley 13.927 — Código de Tránsito de la Provincia de Buenos Aires, texto actualizado',
    publisher: 'Provincia de Buenos Aires',
    jurisdiction: 'Provincia de Buenos Aires',
    reference: 'Artículo 1 — adhesión a las Leyes Nacionales 24.449 y 26.363, con el alcance allí previsto.',
    url: 'https://normas.gba.gob.ar/documentos/0YqDnfd0.html',
  },
};

export const trafficSignals: TrafficSignal[] = [
  {
    id: 'senal-p1-cruce-ferrovial', code: 'P.1', name: 'Cruce ferrovial', signalClass: 'advertencia',
    recognition: { shape: 'triangle', symbol: 'train', description: 'Triángulo blanco de borde rojo con una locomotora negra.' },
    meaning: 'Anuncia la proximidad de un cruce ferroviario a nivel.',
    legalEffect: 'No da prioridad al vehículo. Reducí la velocidad y atendé a la posible aproximación de trenes; si se aproxima un tren, detenete fuera de la zona de cruce.',
    source: annexL('Capítulo IV, punto 14, señal P.1 Cruce ferrovial; complementación con P.3 Cruz de San Andrés.'),
  },
  {
    id: 'senal-p4-curva-cerrada', code: 'P.4', name: 'Curva cerrada', signalClass: 'advertencia',
    recognition: { shape: 'triangle', symbol: 'curve-left', description: 'Triángulo blanco de borde rojo con una flecha negra cerrada que indica el sentido de la curva.' },
    meaning: 'Advierte la proximidad de una curva peligrosa hacia el lado indicado.',
    legalEffect: 'Es una advertencia: anticipá la curva y adecuá la velocidad. La señal por sí sola no establece una velocidad numérica ni una prioridad.',
    source: annexL('Capítulo IV, punto 14, señal P.4 Curva cerrada.'),
  },
  {
    id: 'senal-p5-cruce-peatones', code: 'P.5', name: 'Cruce de peatones', signalClass: 'advertencia',
    recognition: { shape: 'triangle', symbol: 'pedestrian', description: 'Triángulo blanco de borde rojo con una persona caminando sobre una senda.' },
    meaning: 'Advierte la proximidad de un cruce peatonal; el Anexo L reserva esta señal preventiva para zona rural.',
    legalEffect: 'La advertencia no reemplaza las reglas de prioridad peatonal ni la señalización del cruce. En zona urbana, observá las sendas, semáforos y reglas aplicables.',
    source: annexL('Capítulo IV, punto 14, señal P.5 Cruce de peatones, observación sobre uso rural.'),
  },
  {
    id: 'senal-p10-estrechamiento', code: 'P.10', name: 'Estrechamiento', signalClass: 'advertencia',
    recognition: { shape: 'diamond', symbol: 'narrowing', description: 'Rombo amarillo de borde negro con líneas de calzada que se acercan.' },
    meaning: 'La vía se estrecha más adelante; el dibujo indica si el estrechamiento es simétrico o de un lado.',
    legalEffect: 'No asigna por sí sola prioridad de paso. Reducí si hace falta, mantené tu carril y obedecé cualquier señal reglamentaria que determine el paso.',
    source: annexL('Capítulo IV, punto 15, señal P.10 Estrechamiento.'),
  },
  {
    id: 'senal-p11-resalto', code: 'P.11', name: 'Perfil irregular: resalto o lomada', signalClass: 'advertencia',
    recognition: { shape: 'diamond', symbol: 'bump', description: 'Rombo amarillo de borde negro con el perfil elevado de la calzada.' },
    meaning: 'Advierte irregularidades en la superficie; una de sus variantes indica una saliente o lomada.',
    legalEffect: 'Es preventiva, no fija un límite numérico. Moderá la marcha y cruzá con control según las condiciones del lugar.',
    source: annexL('Capítulo IV, punto 15, señal P.11 Perfil irregular, inciso 3 (Resalto o Lomada).'),
  },
  {
    id: 'senal-p21-rotonda', code: 'P.21', name: 'Rotonda', signalClass: 'advertencia',
    recognition: { shape: 'diamond', symbol: 'roundabout', description: 'Rombo amarillo de borde negro con flechas que forman un giro circular.' },
    meaning: 'Anuncia la proximidad de una rotonda.',
    legalEffect: 'La señal anticipa la configuración de la vía. Al circular por la rotonda, dejá la parte central a la izquierda y aplicá las reglas de prioridad correspondientes.',
    source: annexL('Capítulo IV, punto 15, señal P.21 Rotonda; Ley 24.449, artículo 43, inciso e).'),
  },
  {
    id: 'senal-r1-no-avanzar', code: 'R.1', name: 'No avanzar', signalClass: 'reglamentaria',
    recognition: { shape: 'circle', symbol: 'no-advance', description: 'Círculo blanco de borde rojo y barra diagonal roja sobre una flecha negra hacia adelante.' },
    meaning: 'Prohíbe avanzar con vehículos por la vía sobre la que está colocada.',
    legalEffect: 'Es una orden obligatoria en el tramo indicado. Cuando sea temporal, debe acompañarse de la vigencia horaria o diaria.',
    source: annexL('Capítulo III, punto 9, señal R.1 No avanzar.'),
  },
  {
    id: 'senal-r2-contramano', code: 'R.2', name: 'Contramano', signalClass: 'reglamentaria',
    recognition: { shape: 'circle', symbol: 'no-entry', description: 'Disco rojo con una barra rectangular blanca horizontal.' },
    meaning: 'Indica que la vía tiene sentido de circulación opuesto y que no se puede ingresar.',
    legalEffect: 'Prohíbe ingresar desde ese acceso. Respetá la señal aunque la calle parezca despejada.',
    source: annexL('Capítulo III, punto 9, señal R.2 Contramano.'),
  },
  {
    id: 'senal-r4-no-girar', code: 'R.4', name: 'No girar a la izquierda', signalClass: 'reglamentaria',
    recognition: { shape: 'circle', symbol: 'no-left-turn', description: 'Círculo blanco de borde rojo con una flecha doblada a la izquierda y banda de prohibición.' },
    meaning: 'Prohíbe girar hacia el lado indicado por la flecha.',
    legalEffect: 'No realices el giro en la intersección señalizada. Si rige solo en ciertos horarios, la señal debe indicar esa condición.',
    source: annexL('Capítulo III, punto 9, señal R.4 No girar.'),
  },
  {
    id: 'senal-r6-no-adelantar', code: 'R.6', name: 'No adelantar', signalClass: 'reglamentaria',
    recognition: { shape: 'circle', symbol: 'no-overtake', description: 'Círculo blanco de borde rojo con dos automotores negros vistos desde atrás.' },
    meaning: 'Prohíbe el sobrepaso en el tramo señalizado.',
    legalEffect: 'La prohibición es obligatoria hasta que termine el tramo o la señalización indique su fin.',
    source: annexL('Capítulo III, punto 9, señal R.6 No adelantar.'),
  },
  {
    id: 'senal-r15-velocidad-maxima', code: 'R.15', name: 'Límite de velocidad máxima', signalClass: 'reglamentaria',
    recognition: { shape: 'circle', symbol: 'speed-limit', description: 'Círculo blanco de borde rojo con una cifra central; el ejemplo gráfico muestra 40 km/h.' },
    meaning: 'Indica la velocidad máxima permitida en el tramo señalizado.',
    legalEffect: 'La cifra instalada en la vía es un máximo obligatorio, no una velocidad recomendada; también adecuá la marcha al entorno y las condiciones.',
    source: annexL('Capítulo III, punto 10, señal R.15 Límite de velocidad máxima.'),
  },
  {
    id: 'senal-r27-pare', code: 'R.27', name: 'Pare', signalClass: 'reglamentaria',
    recognition: { shape: 'octagon', symbol: 'stop', description: 'Octógono rojo con borde y palabra PARE en blanco.' },
    meaning: 'Ordena detener totalmente la marcha antes de la encrucijada.',
    legalEffect: 'La detención es obligatoria aunque no circule nadie por la vía transversal. Luego avanzá solo cuando sea seguro y no se afecte la prioridad de otros usuarios.',
    source: annexL('Capítulo III, punto 11, señal R.27 Pare.'),
  },
  {
    id: 'senal-r28-ceda-el-paso', code: 'R.28', name: 'Ceda el paso', signalClass: 'reglamentaria',
    recognition: { shape: 'triangle', symbol: 'yield', description: 'Triángulo blanco invertido, borde rojo e inscripción CEDA EL PASO.' },
    meaning: 'Hace perder la prioridad de paso que se tenía por regla general frente al tránsito de la vía transversal.',
    legalEffect: 'Debés ceder el paso. No es necesario detenerse si podés asegurar el paso prioritario del tránsito que cruza.',
    source: annexL('Capítulo III, punto 11, señal R.28 Ceda el Paso.'),
  },
];

if (new Set(trafficSignals.map((signal) => signal.id)).size !== trafficSignals.length) {
  throw new Error('Los ids de las señales deben ser únicos.');
}
