import type { LearningModule, LearningProgress, Question, QuestionAnswer } from './learning';

export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

export interface ModuleProgressSummary {
  moduleId: string;
  status: LessonStatus;
  completedQuestions: number;
  totalQuestions: number;
  topicsToReinforce: Array<{ topic: string; questionIds: string[] }>;
}

export function summarizeModuleProgress(
  module: LearningModule,
  questions: Question[],
  progress: LearningProgress,
): ModuleProgressSummary {
  const moduleProgress = progress.modules.find((item) => item.moduleId === module.id);
  const answeredIds = new Set([
    ...(moduleProgress?.completedQuestionIds ?? []),
    ...(moduleProgress?.answers.map((answer) => answer.questionId) ?? []),
  ]);
  const completedQuestions = module.questionIds.filter((questionId) => answeredIds.has(questionId)).length;
  const hasStarted = Boolean(moduleProgress && (
    answeredIds.size > 0
    || moduleProgress.completedScenarioIds.length > 0
    || (moduleProgress.completedChecklistItemIds?.length ?? 0) > 0
  ));
  const isComplete = module.questionIds.length > 0 && completedQuestions === module.questionIds.length;
  const status: LessonStatus = isComplete ? 'completed' : hasStarted ? 'in-progress' : 'not-started';
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const latestAnswerByQuestionId = new Map<string, QuestionAnswer>();

  for (const answer of moduleProgress?.answers ?? []) {
    latestAnswerByQuestionId.set(answer.questionId, answer);
  }

  const topics = new Map<string, string[]>();
  for (const [questionId, answer] of latestAnswerByQuestionId) {
    if (answer.isCorrect) continue;
    const question = questionById.get(questionId);
    if (!question) continue;
    const topicQuestionIds = topics.get(question.topic) ?? [];
    topicQuestionIds.push(questionId);
    topics.set(question.topic, topicQuestionIds);
  }

  return {
    moduleId: module.id,
    status,
    completedQuestions,
    totalQuestions: module.questionIds.length,
    topicsToReinforce: [...topics].map(([topic, questionIds]) => ({ topic, questionIds })),
  };
}
