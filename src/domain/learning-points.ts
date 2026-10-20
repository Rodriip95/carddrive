import type { LearningProgress, ModuleProgress } from './learning';

export const POINTS_PER_CORRECT_QUESTION = 10;

function getCorrectQuestionIds(moduleProgress: ModuleProgress) {
  const correctIds = new Set(
    moduleProgress.answers.filter((answer) => answer.isCorrect).map((answer) => answer.questionId),
  );
  for (const attempt of moduleProgress.assessmentAttempts ?? []) {
    for (const answer of attempt.answers) {
      if (answer.isCorrect) correctIds.add(answer.questionId);
    }
  }
  return correctIds;
}

export function getTotalLearningPoints(progress: LearningProgress) {
  return progress.modules.reduce(
    (total, moduleProgress) => total + getCorrectQuestionIds(moduleProgress).size * POINTS_PER_CORRECT_QUESTION,
    0,
  );
}

export function getLessonResult(moduleProgress: ModuleProgress | undefined, questionIds: string[]) {
  const answeredIds = new Set(moduleProgress?.completedQuestionIds ?? []);
  const correctIds = moduleProgress ? getCorrectQuestionIds(moduleProgress) : new Set<string>();
  const completedCount = questionIds.filter((id) => answeredIds.has(id)).length;
  const correctCount = questionIds.filter((id) => correctIds.has(id)).length;

  return {
    completedCount,
    correctCount,
    total: questionIds.length,
    points: correctCount * POINTS_PER_CORRECT_QUESTION,
    isComplete: questionIds.length > 0 && completedCount === questionIds.length,
  };
}
