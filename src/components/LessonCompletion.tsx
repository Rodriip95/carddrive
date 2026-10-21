'use client';

import type { LearningModule } from '../domain/learning';
import { getLessonResult, getScenarioLessonResult, POINTS_PER_COMPLETED_SCENARIO, POINTS_PER_CORRECT_QUESTION } from '../domain/learning-points';
import { useLearningProgress } from './ProgressProvider';

export function LessonCompletion({ module }: { module: LearningModule }) {
  const { progress, ready } = useLearningProgress();
  const moduleProgress = progress.modules.find((item) => item.moduleId === module.id);
  const isScenarioModule = module.questionIds.length === 0 && module.scenarioIds.length > 0;
  const questionResult = getLessonResult(moduleProgress, module.questionIds);
  const scenarioResult = getScenarioLessonResult(moduleProgress, module.scenarioIds);
  const result = isScenarioModule ? scenarioResult : questionResult;
  const unit = isScenarioModule ? 'situaciones completadas' : 'preguntas respondidas';

  return (
    <section className="lesson-completion" aria-labelledby="lesson-completion-title" aria-live="polite">
      <p className="eyebrow">PROGRESO DE LECCIÓN</p>
      <h2 id="lesson-completion-title">{result.isComplete ? 'Lección completada' : 'Tu avance'}</h2>
      <p>{ready ? `${result.completedCount} de ${result.total} ${unit}` : 'Cargando progreso…'}</p>
      <progress value={ready ? result.completedCount : 0} max={result.total || 1} aria-label="Progreso de la lección" />
      {result.isComplete && (
        <div className="lesson-result">
          {isScenarioModule
            ? <strong>{scenarioResult.completedCount} de {scenarioResult.total} situaciones completadas · {scenarioResult.points} puntos</strong>
            : <strong>{questionResult.correctCount} de {questionResult.total} preguntas correctas · {questionResult.points} puntos</strong>}
          <p>{isScenarioModule
            ? `Se otorgan ${POINTS_PER_COMPLETED_SCENARIO} puntos por cada situación completada al elegir bien y ejecutar la maniobra. Repetirla no suma puntos adicionales; no hay premios por rapidez ni por maniobras arriesgadas.`
            : `Se otorgan ${POINTS_PER_CORRECT_QUESTION} puntos por cada pregunta respondida correctamente al menos una vez. Repetirla no suma puntos adicionales; no hay premios por rapidez ni por maniobras arriesgadas.`}</p>
        </div>
      )}
    </section>
  );
}
