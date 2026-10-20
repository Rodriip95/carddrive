import type { Question, QuestionSource } from '../domain/learning';
import { validateQuestion } from '../domain/validation';

const annexLSource = (reference: string): QuestionSource => ({
  title: 'Decreto 779/1995, Anexo L — Sistema de Señalización Vial Uniforme',
  publisher: 'Estado Nacional Argentino',
  jurisdiction: 'Argentina, nacional',
  reference,
  url: 'https://www.argentina.gob.ar/normativa/recurso/30389/texactdto779-1995-anexoL/htm',
});

export const questions: Question[] = [
  {
    id: 'senales-ceda-el-paso', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: '¿Qué indica la señal triangular invertida, blanca y con borde rojo que dice «CEDA EL PASO»?',
    options: [
      { id: 'ceder-prioridad', text: 'Que debo ceder la prioridad al tránsito de la vía que cruza.' },
      { id: 'detener-siempre', text: 'Que debo detenerme totalmente en todos los casos.' },
      { id: 'prioridad-propia', text: 'Que tengo prioridad y puedo avanzar sin verificar el cruce.' },
    ],
    correctOptionIndex: 0,
    explanation: 'La señal Ceda el Paso indica que se pierde la prioridad que se tenía por regla general. No es necesario detenerse si se puede asegurar el paso prioritario del tránsito que cruza.',
    source: annexLSource('Capítulo III, punto 11, señal R.28 Ceda el Paso; actualizada por Decreto 196/2025.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-no-avanzar', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: '¿Qué prohíbe la señal R.1 «No avanzar»?',
    options: [
      { id: 'r1-prohibicion-paso', text: 'Avanzar con vehículos por la vía señalizada.' },
      { id: 'r1-solo-camiones', text: 'Circular únicamente a los camiones.' },
      { id: 'r1-estacionar', text: 'Estacionar junto al cordón.' },
    ],
    correctOptionIndex: 0,
    explanation: 'La señal R.1 prohíbe avanzar por la vía en la que está colocada; puede establecer una restricción temporal con el período indicado.',
    source: annexLSource('Capítulo III, punto 9, señal R.1 No avanzar.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-contramano', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: 'Ves una señal circular roja con una franja blanca horizontal. ¿Qué indica?',
    options: [
      { id: 'r2-estacionamiento', text: 'Que el estacionamiento está prohibido.' },
      { id: 'r2-no-ingresar', text: 'Que no se puede ingresar porque el sentido de la vía es opuesto.' },
      { id: 'r2-detencion', text: 'Que hay que detenerse y esperar a un agente.' },
    ],
    correctOptionIndex: 1,
    explanation: 'La señal R.2 indica que la vía tiene sentido de circulación opuesto; no se debe ingresar.',
    source: annexLSource('Capítulo III, punto 9, señal R.2 Contramano.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-no-girar', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: 'Una flecha doblada y tachada hacia la derecha indica que…',
    options: [
      { id: 'r4-giro-obligatorio', text: 'Debo girar obligatoriamente a la derecha.' },
      { id: 'r4-fin-prohibicion', text: 'Finaliza la prohibición de giro.' },
      { id: 'r4-no-giro', text: 'Está prohibido girar hacia la derecha.' },
    ],
    correctOptionIndex: 2,
    explanation: 'La señal R.4 prohíbe girar hacia el lado que indica la flecha. Si la restricción depende de un horario, debe estar aclarado.',
    source: annexLSource('Capítulo III, punto 9, señal R.4 No girar.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-no-retomar', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: '¿Qué maniobra prohíbe una señal de «No girar en U»?',
    options: [
      { id: 'r5-retomar', text: 'Retomar o girar para circular en sentido contrario sobre la misma vía.' },
      { id: 'r5-giro-esquina', text: 'Girar a la derecha en la próxima esquina.' },
      { id: 'r5-adelantar', text: 'Adelantar a otro vehículo.' },
    ],
    correctOptionIndex: 0,
    explanation: 'La señal R.5 prohíbe retomar, es decir, girar para cambiar al sentido contrario sobre esa misma vía.',
    source: annexLSource('Capítulo III, punto 9, señal R.5 No girar en U (No retomar).'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-no-adelantar', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: '¿Qué debes hacer en un tramo señalizado con «No adelantar»?',
    options: [
      { id: 'r6-adelantar-con-bocina', text: 'Adelantar si antes haces una señal con la bocina.' },
      { id: 'r6-no-sobrepasar', text: 'No sobrepasar a otro vehículo en ese tramo.' },
      { id: 'r6-circular-banquina', text: 'Circular por la banquina para pasar.' },
    ],
    correctOptionIndex: 1,
    explanation: 'La señal R.6 prohíbe el sobrepaso en el tramo indicado. La señalización debe observarse junto con las condiciones de la vía.',
    source: annexLSource('Capítulo III, punto 9, señal R.6 No adelantar.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-no-estacionar', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: 'Una señal de «No estacionar» sin la cruz adicional establece que…',
    options: [
      { id: 'r8-no-estacionar-pasajeros', text: 'No se debe estacionar; se admite detenerse para ascenso o descenso de pasajeros según la norma.' },
      { id: 'r8-no-detenerse-nunca', text: 'No se puede detener el vehículo bajo ninguna circunstancia.' },
      { id: 'r8-estacionamiento-libre', text: 'El estacionamiento está permitido durante todo el día.' },
    ],
    correctOptionIndex: 0,
    explanation: 'La señal R.8 prohíbe estacionar. El Anexo L admite detenerse para carga y descarga o para ascenso y descenso de pasajeros; revisá horarios y placas adicionales.',
    source: annexLSource('Capítulo III, punto 9, señal R.8 No estacionar, incisos b) y d).'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-no-estacionar-ni-detenerse', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: '¿Qué agrega la cruz sobre la señal de «No estacionar»?',
    options: [
      { id: 'r9-estacionar-breve', text: 'Permite estacionar por un tiempo breve.' },
      { id: 'r9-carga-descarga', text: 'Permite detenerse para carga y descarga.' },
      { id: 'r9-prohibicion-detenerse', text: 'Prohíbe estacionar y detenerse, salvo por razones propias de la circulación.' },
    ],
    correctOptionIndex: 2,
    explanation: 'La señal R.9 prohíbe estacionar y detenerse. La excepción indicada en la norma es la detención motivada por la circulación.',
    source: annexLSource('Capítulo III, punto 9, señal R.9 No estacionar ni detenerse.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-velocidad-maxima', moduleId: 'senales', topic: 'Señales reglamentarias',
    prompt: 'Una señal R.15 muestra el número «40». ¿Qué significa?',
    options: [
      { id: 'r15-minimo', text: 'La velocidad mínima del tramo es 40 km/h.' },
      { id: 'r15-maximo', text: 'La velocidad máxima permitida en el tramo señalizado es 40 km/h.' },
      { id: 'r15-distancia', text: 'Faltan 40 metros para la próxima intersección.' },
    ],
    correctOptionIndex: 1,
    explanation: 'La señal R.15 indica el máximo de velocidad al que se puede circular en el tramo señalizado. Siempre adecuá la velocidad a las condiciones del camino.',
    source: annexLSource('Capítulo III, punto 10, señal R.15 Límite de velocidad máxima.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-cruce-ferroviario', moduleId: 'senales', topic: 'Señales preventivas',
    prompt: '¿Qué anuncia la señal preventiva P.1 de cruce ferrovial?',
    options: [
      { id: 'p1-cruce-ferroviario', text: 'La proximidad de un cruce ferroviario; hay que reducir la velocidad y atender a posibles trenes.' },
      { id: 'p1-estacion', text: 'La ubicación de una estación de servicio.' },
      { id: 'p1-prioridad-auto', text: 'Que los automóviles tienen prioridad sobre el tren.' },
    ],
    correctOptionIndex: 0,
    explanation: 'La señal P.1 advierte la proximidad de un cruce ferrovial a nivel y ordena adoptar precaución, reducir la velocidad y atender a la posible aproximación de trenes.',
    source: annexLSource('Capítulo IV, punto 14, señal P.1 Cruce ferrovial.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-curva-cerrada', moduleId: 'senales', topic: 'Señales preventivas',
    prompt: 'Una señal triangular con una flecha curva muy cerrada advierte…',
    options: [
      { id: 'p4-rotonda', text: 'La entrada obligatoria a una rotonda.' },
      { id: 'p4-prohibicion-giro', text: 'La prohibición de girar en la próxima esquina.' },
      { id: 'p4-curva-peligrosa', text: 'La proximidad de una curva peligrosa hacia el lado señalado.' },
    ],
    correctOptionIndex: 2,
    explanation: 'La señal preventiva P.4 anuncia una curva peligrosa en la dirección de la flecha. Anticipá la maniobra y ajustá la velocidad.',
    source: annexLSource('Capítulo IV, punto 14, señal P.4 Curva cerrada.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-estrechamiento', moduleId: 'senales', topic: 'Señales preventivas',
    prompt: '¿Qué te comunica una señal preventiva de estrechamiento?',
    options: [
      { id: 'p10-doble-mano', text: 'Que la calle pasa a tener doble sentido.' },
      { id: 'p10-calzada-angosta', text: 'Que la vía se angosta más adelante, de forma simétrica o de un solo lado.' },
      { id: 'p10-fin-camino', text: 'Que el camino termina sin salida.' },
    ],
    correctOptionIndex: 1,
    explanation: 'La señal P.10 indica que la vía se estrecha más adelante; la figura permite anticipar si el estrechamiento es simétrico o de un solo lado.',
    source: annexLSource('Capítulo IV, punto 15, señal P.10 Estrechamiento.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-linea-separacion-sentidos', moduleId: 'senales', topic: 'Marcas viales',
    prompt: '¿Qué indica una línea amarilla continua que separa sentidos opuestos?',
    options: [
      { id: 'h1-no-cruzar', text: 'Separa corrientes opuestas y no se debe cruzar ni circular sobre ella.' },
      { id: 'h1-adelantamiento', text: 'Permite cruzarla para adelantar en cualquier sentido.' },
      { id: 'h1-estacionamiento', text: 'Marca un espacio de estacionamiento.' },
    ],
    correctOptionIndex: 0,
    explanation: 'La marca H.1 separa corrientes de sentidos opuestos; el Anexo L indica que no se puede cruzar ni circular sobre ella.',
    source: annexLSource('Capítulo VI, puntos 26 y 27, significado de líneas continuas y marca H.1.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-linea-detencion', moduleId: 'senales', topic: 'Marcas viales',
    prompt: '¿Qué indica la línea blanca transversal de detención (H.4)?',
    options: [
      { id: 'h4-cruce-libre', text: 'El límite desde el cual se permite estacionar.' },
      { id: 'h4-detener', text: 'Que hay que detener el vehículo antes de la línea cuando lo indique una autoridad, señal o situación prevista.' },
      { id: 'h4-adelantar', text: 'El inicio de un tramo donde se permite adelantar.' },
    ],
    correctOptionIndex: 1,
    explanation: 'La línea H.4 marca el punto antes del cual hay que detenerse ante indicación de autoridad, señalización luminosa o vertical, cruce peatonal o ferroviario, o si la bocacalle está ocupada.',
    source: annexLSource('Capítulo VI, punto 28, marca H.4 Línea de detención.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'senales-senda-peatonal', moduleId: 'senales', topic: 'Marcas viales',
    prompt: '¿Qué zona identifica una senda peatonal demarcada sobre la calzada?',
    options: [
      { id: 'h5-carga', text: 'Un espacio reservado para detenerse a descargar.' },
      { id: 'h5-bicicletas', text: 'Un carril exclusivo para bicicletas.' },
      { id: 'h5-cruce-peatones', text: 'La zona autorizada para que las personas crucen, con prioridad según la señalización aplicable.' },
    ],
    correctOptionIndex: 2,
    explanation: 'La marca H.5 delimita la zona autorizada de cruce peatonal. La prioridad prevista se aplica salvo que un semáforo o autoridad competente indique lo contrario.',
    source: annexLSource('Capítulo VI, punto 28, marca H.5 Senda peatonal.'),
    reviewStatus: 'reviewed',
  },
  {
    id: 'normas-senda-peatonal', moduleId: 'normas', topic: 'Prioridad peatonal',
    prompt: 'Al acercarte a una senda peatonal con una persona cruzando, ¿cómo debés actuar?',
    options: [
      { id: 'ceder-paso', text: 'Reducir la velocidad y cederle el paso.' },
      { id: 'tocar-bocina', text: 'Tocar bocina para que termine de cruzar más rápido.' },
      { id: 'rodear', text: 'Cambiar de carril para pasar por delante.' },
    ],
    correctOptionIndex: 0,
    explanation: 'La Ley Nacional de Tránsito reconoce prioridad al peatón que cruza lícitamente por la senda peatonal; el conductor debe detenerse si pone en peligro al peatón. Respetá además las reglas locales y la señalización del cruce.',
    source: {
      title: 'Ley 24.449 — Tránsito y Seguridad Vial',
      publisher: 'Estado Nacional Argentino',
      jurisdiction: 'Argentina, nacional; verificar adhesión y reglas locales',
      reference: 'Artículo 41, inciso e) — prioridad normativa de paso.',
      url: 'https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/actualizacion',
    },
    reviewStatus: 'reviewed',
  },
  {
    id: 'seguridad-distancia', moduleId: 'seguridad', topic: 'Distancia de seguridad',
    prompt: '¿Qué conviene hacer con la distancia respecto del vehículo de adelante?',
    options: [
      { id: 'distancia-segura', text: 'Mantener un espacio seguro y aumentarlo si baja la visibilidad o hay lluvia.' },
      { id: 'seguir-cerca', text: 'Seguirlo de cerca para evitar que otro vehículo se interponga.' },
      { id: 'distancia-fija', text: 'Mantener siempre la misma distancia, sin importar la velocidad.' },
    ],
    correctOptionIndex: 0,
    explanation: 'El Manual del Conductor recomienda mantener una distancia adecuada y analizar las condiciones del entorno. Dejá más espacio cuando las condiciones reduzcan la visibilidad o la adherencia; la distancia concreta depende de la situación.',
    source: {
      title: 'Manual del Conductor',
      publisher: 'Agencia Nacional de Seguridad Vial',
      jurisdiction: 'Argentina, nacional; material educativo',
      reference: 'Capítulo 4, sección 4.2.h, distancia de seguridad (p. 40 impreso).',
      url: 'https://www.argentina.gob.ar/sites/default/files/ansv_licencias_manual_del_conductor.pdf',
    },
    reviewStatus: 'reviewed',
  },
  {
    id: 'vehiculo-revision-previa', moduleId: 'vehiculo', topic: 'Revisión del vehículo',
    prompt: '¿Qué revisión básica ayuda a preparar el vehículo antes de salir?',
    options: [
      { id: 'luces-neumaticos', text: 'Comprobar luces y estado de los neumáticos.' },
      { id: 'radio', text: 'Ajustar el volumen de la radio.' },
      { id: 'color', text: 'Verificar el color de la carrocería.' },
    ],
    correctOptionIndex: 0,
    explanation: 'El Manual del Conductor recomienda verificar el funcionamiento de las luces y controlar el estado y la presión de los neumáticos. Seguí también las indicaciones del fabricante.',
    source: {
      title: 'Manual del Conductor',
      publisher: 'Agencia Nacional de Seguridad Vial',
      jurisdiction: 'Argentina, nacional; material educativo',
      reference: 'Capítulo 2, sección 2.1.d Neumáticos; capítulo 3, sección 3.1 Revisación general del vehículo.',
      url: 'https://www.argentina.gob.ar/sites/default/files/ansv_licencias_manual_del_conductor.pdf',
    },
    reviewStatus: 'reviewed',
  },
  {
    id: 'vehiculo-neumaticos', moduleId: 'vehiculo', topic: 'Neumáticos',
    prompt: 'Antes de circular, ¿qué comprobación básica corresponde hacer a los neumáticos?',
    options: [
      { id: 'neumaticos-manual', text: 'Revisar desgaste y daños visibles, y consultar en el manual la presión adecuada para el vehículo.' },
      { id: 'neumaticos-presion-lateral', text: 'Inflarlos siempre hasta el máximo impreso en el costado, sin importar el vehículo.' },
      { id: 'neumaticos-solo-delanteros', text: 'Revisar únicamente las ruedas delanteras porque son las que dirigen el auto.' },
    ],
    correctOptionIndex: 0,
    explanation: 'La presión recomendada depende del vehículo y de su carga; consultá el manual o la etiqueta indicada por el fabricante. Revisá también cortes, deformaciones y desgaste. Si encontrás daños o no sabés evaluar el estado, pedí asistencia a un profesional.',
    source: {
      title: 'Manual del Conductor',
      publisher: 'Agencia Nacional de Seguridad Vial',
      jurisdiction: 'Argentina, nacional; material educativo',
      reference: 'Capítulo 2, sección 2.1.d Neumáticos: presión, desgaste e inspección visual.',
      url: 'https://www.argentina.gob.ar/sites/default/files/ansv_licencias_manual_del_conductor.pdf',
    },
    reviewStatus: 'reviewed',
  },
  {
    id: 'vehiculo-luces', moduleId: 'vehiculo', topic: 'Luces',
    prompt: '¿Qué conjunto de luces conviene comprobar antes de iniciar un viaje?',
    options: [
      { id: 'luces-solo-bajas', text: 'Solo las luces bajas, porque las demás se activan automáticamente.' },
      { id: 'luces-conjunto', text: 'Luces delanteras y de posición, giros, freno y demás luces indicadas para el vehículo.' },
      { id: 'luces-tablero', text: 'Solo que no haya testigos encendidos en el tablero.' },
    ],
    correctOptionIndex: 1,
    explanation: 'Comprobá que las luces y los indicadores funcionen; podés pedir a otra persona que confirme las luces traseras mientras las accionás. Si alguna falla o no identificás un mando, consultá el manual y recurrí a un taller para su revisión.',
    source: {
      title: 'Manual del Conductor',
      publisher: 'Agencia Nacional de Seguridad Vial',
      jurisdiction: 'Argentina, nacional; material educativo',
      reference: 'Capítulo 3, revisación general del vehículo: funcionamiento de las luces.',
      url: 'https://www.argentina.gob.ar/sites/default/files/ansv_licencias_manual_del_conductor.pdf',
    },
    reviewStatus: 'reviewed',
  },
  {
    id: 'vehiculo-fluidos', moduleId: 'vehiculo', topic: 'Fluidos',
    prompt: 'El vehículo muestra un nivel de fluido fuera del rango indicado o una advertencia. ¿Qué hacés?',
    options: [
      { id: 'fluidos-cualquier-producto', text: 'Completar con cualquier fluido disponible y seguir circulando.' },
      { id: 'fluidos-ignorar', text: 'Ignorar la advertencia si el vehículo todavía arranca.' },
      { id: 'fluidos-manual-taller', text: 'Consultar el manual para identificar el fluido y el procedimiento; ante una pérdida o duda, pedir asistencia profesional.' },
    ],
    correctOptionIndex: 2,
    explanation: 'El tipo de fluido, el punto de control y el procedimiento dependen del vehículo. No mezcles ni agregues un producto por suposición. Seguí el manual; si hay una pérdida, una advertencia persistente o no podés identificar el depósito, consultá un taller.',
    source: {
      title: 'Vamos a la ruta: lo que tenés que saber para viajar con el auto',
      publisher: 'Agencia Nacional de Seguridad Vial',
      jurisdiction: 'Argentina, nacional; material educativo',
      reference: 'Revisión mínima previa al viaje: niveles de aceite, agua y líquido de frenos.',
      url: 'https://www.argentina.gob.ar/noticias/vamos-la-ruta-lo-que-tenes-que-saber-para-viajar-con-el-auto',
    },
    reviewStatus: 'reviewed',
  },
  {
    id: 'vehiculo-testigos-advertencia', moduleId: 'vehiculo', topic: 'Testigos del tablero',
    prompt: 'Se enciende un testigo que no reconocés y el vehículo parece funcionar normalmente. ¿Cómo interpretás la situación?',
    options: [
      { id: 'testigo-ignorar', text: 'Si el auto sigue andando, el testigo no requiere atención.' },
      { id: 'testigo-manual', text: 'Identificar el símbolo o mensaje en el manual de ese vehículo y seguir la acción indicada; si persiste o pide revisión, solicitarla.' },
      { id: 'testigo-detencion-repentina', text: 'Frenar de golpe en el carril donde apareció el testigo.' },
    ],
    correctOptionIndex: 1,
    explanation: 'Un testigo puede indicar desde una condición que requiere revisión hasta una falla que exige detenerse. El significado y la urgencia dependen del símbolo, el mensaje y el vehículo; consultá su manual y no supongas que se puede continuar solo porque el auto aún responde.',
    source: {
      title: 'Manual del propietario Toyota — Pasos necesarios en caso de emergencia',
      publisher: 'Toyota Argentina',
      jurisdiction: 'Argentina; manual específico del fabricante',
      reference: 'Sección 5-2, luces de aviso: distingue avisos que requieren revisión y advertencias para detener el vehículo; consultar el manual correspondiente al propio modelo.',
      url: 'https://media.toyota.com.ar/0c718245-a700-4546-95b2-b45c22bda4c6.pdf',
    },
    reviewStatus: 'reviewed',
  },
  {
    id: 'vehiculo-testigo-critico', moduleId: 'vehiculo', topic: 'Detención y asistencia',
    prompt: 'Durante la marcha aparece el aviso de baja presión de aceite o una advertencia crítica del sistema de frenos. ¿Qué hacés?',
    options: [
      { id: 'critico-taller-circulando', text: 'Continuar despacio hasta llegar al taller más cercano.' },
      { id: 'critico-parada-segura', text: 'Reducir el riesgo sin maniobras bruscas, detenerse en un lugar seguro siguiendo el manual y pedir asistencia; no continuar circulando.' },
      { id: 'critico-reinicio', text: 'Apagar y encender el tablero mientras el vehículo sigue en movimiento.' },
    ],
    correctOptionIndex: 1,
    explanation: 'Los avisos de baja presión de aceite y ciertas fallas de frenos pueden indicar un riesgo serio. Cuando el manual lo indique, detené el vehículo en un lugar seguro y contactá asistencia; no intentes llegar conduciendo al taller. La prioridad es no crear otro riesgo durante la detención.',
    source: {
      title: 'Manual del propietario Toyota — Pasos necesarios en caso de emergencia',
      publisher: 'Toyota Argentina',
      jurisdiction: 'Argentina; manual específico del fabricante',
      reference: 'Sección 5-2, luces de aviso de presión baja de aceite y sistema de frenos: detener inmediatamente en un lugar seguro y contactar asistencia; verificar siempre el manual del modelo propio.',
      url: 'https://media.toyota.com.ar/0c718245-a700-4546-95b2-b45c22bda4c6.pdf',
    },
    reviewStatus: 'reviewed',
  },
];

for (const question of questions) {
  const validation = validateQuestion(question);
  if (!validation.valid) throw new Error(`Pregunta inválida (${question.id}): ${validation.errors.join(' ')}`);
}

if (new Set(questions.map((question) => question.id)).size !== questions.length) {
  throw new Error('Los ids de las preguntas deben ser únicos.');
}

export const signalQuestions = questions.filter(
  (question) => question.moduleId === 'senales' && question.reviewStatus === 'reviewed',
);

if (signalQuestions.length !== 15) {
  throw new Error(`El banco inicial de señales debe tener 15 preguntas revisadas; tiene ${signalQuestions.length}.`);
}

export function getQuestionsByModule(moduleId: string) {
  return questions.filter((question) => question.moduleId === moduleId && question.reviewStatus === 'reviewed');
}
