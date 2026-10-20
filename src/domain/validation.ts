import type {
  CorrectOptionIndex,
  DrivingScenario,
  LearningModule,
  LearningProgress,
  Question,
} from './learning';

export interface ValidationResult<T> {
  valid: boolean;
  errors: string[];
  value?: T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function isCorrectOptionIndex(value: unknown): value is CorrectOptionIndex {
  return value === 0 || value === 1 || value === 2;
}

function result<T>(value: unknown, errors: string[]): ValidationResult<T> {
  return errors.length === 0
    ? { valid: true, errors, value: value as T }
    : { valid: false, errors };
}

export function validateLearningModule(value: unknown): ValidationResult<LearningModule> {
  const errors: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ['El módulo debe ser un objeto.'] };

  if (!isNonEmptyString(value.id)) errors.push('El módulo necesita un id.');
  if (!isNonEmptyString(value.title)) errors.push('El módulo necesita un título.');
  if (!isNonEmptyString(value.description)) errors.push('El módulo necesita una descripción.');
  if (!isStringArray(value.questionIds)) errors.push('questionIds debe ser una lista de ids.');
  if (!isStringArray(value.scenarioIds)) errors.push('scenarioIds debe ser una lista de ids.');

  return result<LearningModule>(value, errors);
}

export function validateQuestion(value: unknown): ValidationResult<Question> {
  const errors: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ['La pregunta debe ser un objeto.'] };

  if (!isNonEmptyString(value.id)) errors.push('La pregunta necesita un id.');
  if (!isNonEmptyString(value.moduleId)) errors.push('La pregunta necesita un moduleId.');
  if (!isNonEmptyString(value.prompt)) errors.push('La pregunta necesita un enunciado.');
  if (!Array.isArray(value.options) || value.options.length !== 3) {
    errors.push('La pregunta debe tener exactamente tres opciones.');
  } else {
    value.options.forEach((option, index) => {
      if (!isRecord(option) || !isNonEmptyString(option.id) || !isNonEmptyString(option.text)) {
        errors.push(`La opción ${index + 1} necesita id y texto.`);
      }
    });
    const ids = value.options.filter(isRecord).map((option) => option.id);
    if (new Set(ids).size !== ids.length) errors.push('Los ids de las opciones deben ser únicos.');
  }
  if (!isCorrectOptionIndex(value.correctOptionIndex)) {
    errors.push('correctOptionIndex debe señalar una de las tres opciones (0, 1 o 2).');
  }
  if (!isNonEmptyString(value.explanation)) errors.push('La pregunta necesita una explicación.');
  if (!isNonEmptyString(value.topic)) errors.push('La pregunta necesita un tema.');
  if (value.reviewStatus !== 'reviewed' && value.reviewStatus !== 'pending') {
    errors.push('La pregunta necesita un estado de revisión normativa válido.');
  }
  if (!isRecord(value.source)
    || !isNonEmptyString(value.source.title)
    || !isNonEmptyString(value.source.publisher)
    || !isNonEmptyString(value.source.jurisdiction)
    || !isNonEmptyString(value.source.reference)
    || !isNonEmptyString(value.source.url)) {
    errors.push('La pregunta necesita una fuente con título, organismo, jurisdicción, referencia y URL.');
  } else {
    try {
      const sourceUrl = new URL(value.source.url);
      if (sourceUrl.protocol !== 'https:') errors.push('La fuente debe usar una URL HTTPS.');
    } catch {
      errors.push('La URL de la fuente no es válida.');
    }
  }

  return result<Question>(value, errors);
}

export function validateDrivingScenario(value: unknown): ValidationResult<DrivingScenario> {
  const errors: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ['El escenario debe ser un objeto.'] };

  if (!isNonEmptyString(value.id)) errors.push('El escenario necesita un id.');
  if (!isNonEmptyString(value.moduleId)) errors.push('El escenario necesita un moduleId.');
  if (!isNonEmptyString(value.title)) errors.push('El escenario necesita un título.');
  if (!isNonEmptyString(value.explanation)) errors.push('El escenario necesita una explicación.');

  const states = Array.isArray(value.states) ? value.states : [];
  if (states.length === 0) errors.push('El escenario debe incluir al menos un estado.');
  states.forEach((state, index) => {
    if (!isRecord(state) || !isNonEmptyString(state.id) || !isNonEmptyString(state.title)
      || !isNonEmptyString(state.description) || typeof state.isTerminal !== 'boolean') {
      errors.push(`El estado ${index + 1} no tiene id, título, descripción e isTerminal válidos.`);
    }
  });

  const stateIds = states.filter(isRecord).map((state) => state.id);
  if (new Set(stateIds).size !== stateIds.length) errors.push('Los ids de estado deben ser únicos.');
  if (!isNonEmptyString(value.initialStateId) || !stateIds.includes(value.initialStateId)) {
    errors.push('initialStateId debe referirse a un estado existente.');
  }

  const decisions = Array.isArray(value.decisions) ? value.decisions : [];
  decisions.forEach((decision, index) => {
    if (!isRecord(decision) || !isNonEmptyString(decision.id)
      || !isNonEmptyString(decision.label) || !isNonEmptyString(decision.explanation)) {
      errors.push(`La decisión ${index + 1} no tiene id, texto y explicación válidos.`);
      return;
    }
    if (!stateIds.includes(decision.fromStateId) || !stateIds.includes(decision.toStateId)) {
      errors.push(`La decisión ${decision.id} debe apuntar a estados existentes.`);
    }
  });
  const decisionIds = decisions.filter(isRecord).map((decision) => decision.id);
  if (new Set(decisionIds).size !== decisionIds.length) errors.push('Los ids de decisión deben ser únicos.');

  const events = Array.isArray(value.events) ? value.events : [];
  events.forEach((event, index) => {
    if (!isRecord(event) || !isNonEmptyString(event.id) || !isNonEmptyString(event.description)) {
      errors.push(`El evento ${index + 1} no tiene id y descripción válidos.`);
      return;
    }
    if (!stateIds.includes(event.stateId)) errors.push(`El evento ${event.id} debe apuntar a un estado existente.`);
  });
  const eventIds = events.filter(isRecord).map((event) => event.id);
  if (new Set(eventIds).size !== eventIds.length) errors.push('Los ids de evento deben ser únicos.');

  return result<DrivingScenario>(value, errors);
}

export function validateLearningProgress(value: unknown): ValidationResult<LearningProgress> {
  const errors: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ['El progreso debe ser un objeto.'] };
  if (!Array.isArray(value.modules)) return { valid: false, errors: ['modules debe ser una lista.'] };

  value.modules.forEach((module, index) => {
    if (!isRecord(module) || !isNonEmptyString(module.moduleId)
      || !isStringArray(module.completedQuestionIds) || !Array.isArray(module.answers)
      || !isStringArray(module.completedScenarioIds) || !isNonEmptyString(module.updatedAt)) {
      errors.push(`El progreso del módulo ${index + 1} tiene campos inválidos.`);
      return;
    }
    module.answers.forEach((answer, answerIndex) => {
      if (!isRecord(answer) || !isNonEmptyString(answer.questionId)
        || !isCorrectOptionIndex(answer.selectedOptionIndex) || typeof answer.isCorrect !== 'boolean'
        || !isNonEmptyString(answer.answeredAt)) {
        errors.push(`La respuesta ${answerIndex + 1} del módulo ${module.moduleId} tiene campos inválidos.`);
      }
    });
    if (module.completedChecklistItemIds !== undefined && !isStringArray(module.completedChecklistItemIds)) {
      errors.push(`El checklist del módulo ${module.moduleId} tiene ids inválidos.`);
    }
    if (module.assessmentAttempts !== undefined && !Array.isArray(module.assessmentAttempts)) {
      errors.push(`Los intentos de evaluación del módulo ${module.moduleId} deben ser una lista.`);
    } else if (Array.isArray(module.assessmentAttempts)) {
      module.assessmentAttempts.forEach((attempt, attemptIndex) => {
        if (!isRecord(attempt) || !isNonEmptyString(attempt.id) || !isNonEmptyString(attempt.completedAt)
          || typeof attempt.totalQuestions !== 'number' || !Number.isInteger(attempt.totalQuestions) || attempt.totalQuestions < 0
          || typeof attempt.correctAnswers !== 'number' || !Number.isInteger(attempt.correctAnswers)
          || attempt.correctAnswers < 0 || attempt.correctAnswers > attempt.totalQuestions || !Array.isArray(attempt.answers)) {
          errors.push(`El intento ${attemptIndex + 1} del módulo ${module.moduleId} tiene campos inválidos.`);
          return;
        }
        attempt.answers.forEach((answer, answerIndex) => {
          if (!isRecord(answer) || !isNonEmptyString(answer.questionId)
            || !isCorrectOptionIndex(answer.selectedOptionIndex) || typeof answer.isCorrect !== 'boolean'
            || !isNonEmptyString(answer.answeredAt)) {
            errors.push(`La respuesta ${answerIndex + 1} del intento ${attempt.id} tiene campos inválidos.`);
          }
        });
      });
    }
  });

  return result<LearningProgress>(value, errors);
}

