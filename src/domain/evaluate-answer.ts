import type { CorrectOptionIndex, Question, QuestionAnswer } from './learning';

/** Evalúa una respuesta sin depender de React ni de la interfaz. */
export function evaluateAnswer(
  question: Question,
  selectedOptionIndex: CorrectOptionIndex,
  answeredAt = new Date().toISOString(),
): QuestionAnswer {
  return {
    questionId: question.id,
    selectedOptionIndex,
    isCorrect: selectedOptionIndex === question.correctOptionIndex,
    answeredAt,
  };
}
