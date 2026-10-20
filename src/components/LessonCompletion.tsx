'use client';

import type { LearningModule } from '../domain/learning';
import { getLessonResult, POINTS_PER_CORRECT_QUESTION } from '../domain/learning-points';
import { useLearningProgress } from './ProgressProvider';

export function LessonCompletion({ module }: { module: LearningModule }) {
  const { progress, ready } = useLearningProgress();
  const moduleProgress = progress.modules.find((item) => item.moduleId === module.id);
  const result = getLessonResult(moduleProgress, module.questionIds);

  return (
    <section className="lesson-completion" aria-labelledby="lesson-completion-title" aria-live="polite">
      <p className="eyebrow">PROGRESO DE LECCIÓN</p>
      <h2 id="lesson-completion-title">{result.isComplete ? 'Lección completada' : 'Tu avance'}</h2>
      <p>{ready ? `${result.completedCount} de ${result.total} preguntas respondidas` : 'Cargando progreso…'}</p>
      <progress value={ready ? result.completedCount : 0} max={result.total || 1} aria-label="Progreso de la lección" />
      {result.isComplete && (
        <div className="lesson-result">
          <strong>{result.correctCount} de {result.total} preguntas correctas · {result.points} puntos</strong>
          <p>Se otorgan {POINTS_PER_CORRECT_QUESTION} puntos por cada pregunta respondida correctamente al menos una vez. Repetirla no suma puntos adicionales; no hay premios por rapidez ni por maniobras arriesgadas.</p>
        </div>
      )}
    </section>
  );
}
