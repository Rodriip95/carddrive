import type { Question, QuestionAnswer } from './learning';

export interface AssessmentSummary {
  correctCount: number;
  total: number;
  incorrectQuestions: Question[];
  topicsToReinforce: string[];
}

/** Resume solo las primeras respuestas del intento original. */
export function summarizeAssessment(questions: Question[], answers: QuestionAnswer[]): AssessmentSummary {
  const answerByQuestionId = new Map<string, QuestionAnswer>();
  for (const answer of answers) {
    if (!answerByQuestionId.has(answer.questionId)) answerByQuestionId.set(answer.questionId, answer);
  }

  const incorrectQuestions = questions.filter(
    (question) => answerByQuestionId.get(question.id)?.isCorrect === false,
  );

  return {
    correctCount: questions.filter((question) => answerByQuestionId.get(question.id)?.isCorrect === true).length,
    total: questions.length,
    incorrectQuestions,
    topicsToReinforce: [...new Set(incorrectQuestions.map((question) => question.topic))],
  };
}
