import type { LearningModule, LearningProgress, Question, QuestionAnswer } from './learning';

export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

export interface ModuleProgressSummary {
  moduleId: string;
  status: LessonStatus;
  completedQuestions: number;
  totalQuestions: number;
  completedScenarios: number;
  totalScenarios: number;
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
  const completedScenarios = module.scenarioIds.filter((id) => moduleProgress?.completedScenarioIds.includes(id)).length;
  const totalItems = module.questionIds.length + module.scenarioIds.length;
  const hasStarted = Boolean(moduleProgress && (
    answeredIds.size > 0
    || moduleProgress.completedScenarioIds.length > 0
    || (moduleProgress.completedChecklistItemIds?.length ?? 0) > 0
  ));
  const isComplete = totalItems > 0 && completedQuestions + completedScenarios === totalItems;
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
    completedScenarios,
    totalScenarios: module.scenarioIds.length,
    topicsToReinforce: [...topics].map(([topic, questionIds]) => ({ topic, questionIds })),
  };
}
