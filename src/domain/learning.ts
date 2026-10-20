/** Modelos del contenido educativo, independientes de la interfaz y de Three.js. */

export type ContentId = string;

export interface LearningModule {
  id: ContentId;
  title: string;
  description: string;
  questionIds: ContentId[];
  scenarioIds: ContentId[];
}

export interface AnswerOption {
  id: ContentId;
  text: string;
}

export interface QuestionSource {
  title: string;
  publisher: string;
  jurisdiction: string;
  reference: string;
  url: string;
}

export type QuestionReviewStatus = 'reviewed' | 'pending';

export type CorrectOptionIndex = 0 | 1 | 2;

export interface Question {
  id: ContentId;
  moduleId: ContentId;
  prompt: string;
  options: [AnswerOption, AnswerOption, AnswerOption];
  correctOptionIndex: CorrectOptionIndex;
  explanation: string;
  topic: string;
  source: QuestionSource;
  reviewStatus: QuestionReviewStatus;
}

export interface ScenarioState {
  id: ContentId;
  title: string;
  description: string;
  isTerminal: boolean;
}

export interface ScenarioDecision {
  id: ContentId;
  fromStateId: ContentId;
  label: string;
  toStateId: ContentId;
  explanation: string;
}

export interface ScenarioEvent {
  id: ContentId;
  stateId: ContentId;
  description: string;
}

export interface DrivingScenario {
  id: ContentId;
  moduleId: ContentId;
  title: string;
  initialStateId: ContentId;
  states: ScenarioState[];
  decisions: ScenarioDecision[];
  events: ScenarioEvent[];
  explanation: string;
}

export type QuestionAnswer = {
  questionId: ContentId;
  selectedOptionIndex: CorrectOptionIndex;
  isCorrect: boolean;
  answeredAt: string;
};

export interface ModuleProgress {
  moduleId: ContentId;
  completedQuestionIds: ContentId[];
  answers: QuestionAnswer[];
  completedScenarioIds: ContentId[];
  updatedAt: string;
}

export interface LearningProgress {
  modules: ModuleProgress[];
}

