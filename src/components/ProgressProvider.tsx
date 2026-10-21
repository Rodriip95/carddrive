'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AssessmentAttempt, LearningProgress, ModuleProgress, QuestionAnswer } from '../domain/learning';
import { LocalStorageProgressRepository, type ProgressLoadStatus } from '../services/progress-repository';

interface ProgressContextValue {
  progress: LearningProgress;
  ready: boolean;
  status: ProgressLoadStatus | 'save-error';
  recordAnswer: (moduleId: string, answer: QuestionAnswer) => void;
  recordScenarioCompletion: (moduleId: string, scenarioId: string) => void;
  saveChecklistProgress: (moduleId: string, completedIds: string[]) => void;
  recordAssessmentAttempt: (moduleId: string, attempt: AssessmentAttempt) => void;
  resetProgress: () => boolean;
}

const emptyProgress: LearningProgress = { modules: [] };
const ProgressContext = createContext<ProgressContextValue | null>(null);
const repository = new LocalStorageProgressRepository();

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<ProgressLoadStatus | 'save-error'>('empty');
  const progressRef = useRef(progress);

  useEffect(() => {
    const loaded = repository.load();
    progressRef.current = loaded.progress;
    setProgress(loaded.progress);
    setStatus(loaded.status);
    setReady(true);
  }, []);

  function recordAnswer(moduleId: string, answer: QuestionAnswer) {
    if (!ready) return;
    updateModule(moduleId, (currentModule) => ({
      ...currentModule,
      completedQuestionIds: [...new Set([...currentModule.completedQuestionIds, answer.questionId])],
      answers: [...currentModule.answers, answer],
      updatedAt: answer.answeredAt,
    }));
  }

  function recordScenarioCompletion(moduleId: string, scenarioId: string) {
    if (!ready) return;
    // Si ya estaba completada no guardamos nada: evita re-renderizar en bucle desde un efecto.
    const saved = progressRef.current.modules.find((module) => module.moduleId === moduleId);
    if (saved?.completedScenarioIds.includes(scenarioId)) return;
    updateModule(moduleId, (currentModule) => ({
      ...currentModule,
      completedScenarioIds: [...new Set([...currentModule.completedScenarioIds, scenarioId])],
      updatedAt: new Date().toISOString(),
    }));
  }

  function saveChecklistProgress(moduleId: string, completedIds: string[]) {
    if (!ready) return;
    updateModule(moduleId, (currentModule) => ({
      ...currentModule,
      completedChecklistItemIds: completedIds,
      updatedAt: new Date().toISOString(),
    }));
  }

  function recordAssessmentAttempt(moduleId: string, attempt: AssessmentAttempt) {
    if (!ready) return;
    updateModule(moduleId, (currentModule) => ({
      ...currentModule,
      completedQuestionIds: [...new Set([
        ...currentModule.completedQuestionIds,
        ...attempt.answers.map((answer) => answer.questionId),
      ])],
      answers: [...currentModule.answers, ...attempt.answers],
      assessmentAttempts: [...(currentModule.assessmentAttempts ?? []), attempt],
      updatedAt: attempt.completedAt,
    }));
  }

  function updateModule(moduleId: string, update: (module: ModuleProgress) => ModuleProgress) {
    const previous = progressRef.current;
    const currentModule = previous.modules.find((module) => module.moduleId === moduleId) ?? {
      moduleId,
      completedQuestionIds: [],
      answers: [],
      completedScenarioIds: [],
      updatedAt: new Date().toISOString(),
    };
    const nextModule = update(currentModule);
    const nextProgress: LearningProgress = {
      modules: [...previous.modules.filter((module) => module.moduleId !== moduleId), nextModule],
    };

    progressRef.current = nextProgress;
    setProgress(nextProgress);
    if (status !== 'unsupported') setStatus(repository.save(nextProgress) ? 'loaded' : 'save-error');
  }

  function resetProgress() {
    const reset = repository.reset();
    progressRef.current = emptyProgress;
    setProgress(emptyProgress);
    setStatus(reset ? 'empty' : 'unavailable');
    return reset;
  }

  return (
    <ProgressContext.Provider value={{ progress, ready, status, recordAnswer, recordScenarioCompletion, saveChecklistProgress, recordAssessmentAttempt, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useLearningProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useLearningProgress debe usarse dentro de ProgressProvider.');
  return context;
}
