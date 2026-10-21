import type { LearningModule } from '../domain/learning';

export interface CatalogModule extends LearningModule {
  icon: string;
  durationMinutes: number;
  level: string;
  lesson: string[];
  // 'simulador': el módulo se aprende conduciendo en /practica; 'preguntas': lección con preguntas.
  mode: 'preguntas' | 'simulador';
}

export const modules: CatalogModule[] = [
  {
    id: 'senales', title: 'Señales de tránsito',
    description: 'Aprendé a reconocer señales y anticipar qué te piden en el camino.',
    icon: '◉', durationMinutes: 8, level: 'Inicial', mode: 'preguntas',
    lesson: ['Reconocé señales reglamentarias, preventivas e informativas.', 'Relacioná cada forma y color con la indicación que transmite.', 'Practicá cómo responder ante una señal que aparece en tu recorrido.'],
    questionIds: [
      'senales-ceda-el-paso', 'senales-no-avanzar', 'senales-contramano', 'senales-no-girar',
      'senales-no-retomar', 'senales-no-adelantar', 'senales-no-estacionar',
      'senales-no-estacionar-ni-detenerse', 'senales-velocidad-maxima',
      'senales-cruce-ferroviario', 'senales-curva-cerrada', 'senales-estrechamiento',
      'senales-linea-separacion-sentidos', 'senales-linea-detencion', 'senales-senda-peatonal',
    ], scenarioIds: [],
  },
  {
    id: 'normas', title: 'Reglas de circulación',
    description: 'Conocé prioridades, cruces y normas básicas para compartir la vía.',
    icon: '↗', durationMinutes: 10, level: 'Inicial', mode: 'simulador',
    lesson: ['Identificá quién tiene prioridad en situaciones frecuentes.', 'Aprendé cómo acercarte a cruces, rotondas y sendas peatonales.', 'Elegí una conducta previsible y respetuosa en cada maniobra.'],
    // Este módulo se practica en el simulador; la pregunta 'normas-senda-peatonal' queda en el banco.
    questionIds: [],
    scenarioIds: ['cruce-peatonal', 'semaforo-rojo-cruce-peatonal', 'prioridad-derecha-marcas-viales'],
  },
  {
    id: 'seguridad', title: 'Conducción segura',
    description: 'Tomá decisiones que reduzcan riesgos antes y durante cada viaje.',
    icon: '◇', durationMinutes: 12, level: 'Inicial', mode: 'preguntas',
    lesson: ['Mantené una distancia segura y adaptá la velocidad.', 'Detectá riesgos por clima, visibilidad y entorno.', 'Prepará el viaje y usá correctamente los elementos de seguridad.'],
    questionIds: ['seguridad-distancia'], scenarioIds: [],
  },
  {
    id: 'vehiculo', title: 'Conocer el vehículo',
    description: 'Familiarizate con los controles y las verificaciones básicas del auto.',
    icon: '▰', durationMinutes: 9, level: 'Inicial', mode: 'preguntas',
    lesson: ['Ubicá los controles principales y entendé para qué sirven.', 'Revisá luces, neumáticos y elementos antes de salir.', 'Adoptá una posición de manejo cómoda y con buena visibilidad.'],
    questionIds: [
      'vehiculo-revision-previa', 'vehiculo-neumaticos', 'vehiculo-luces', 'vehiculo-fluidos',
      'vehiculo-testigos-advertencia', 'vehiculo-testigo-critico',
    ], scenarioIds: [],
  },
];

export function getModule(id: string) {
  return modules.find((module) => module.id === id);
}
