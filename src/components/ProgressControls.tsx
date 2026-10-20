'use client';

import Link from 'next/link';
import { useLearningProgress } from './ProgressProvider';
import { getTotalLearningPoints } from '../domain/learning-points';
import { summarizeModuleProgress } from '../domain/summarize-progress';
import { modules } from '../content/modules';
import { questions } from '../content/questions';

export function ProgressControls() {
  const { progress, ready, status, resetProgress } = useLearningProgress();
  const answerCount = progress.modules.reduce((total, module) => total + module.answers.length, 0);
  const completedCount = progress.modules.reduce((total, module) => total + module.completedQuestionIds.length, 0);
  const attempts = progress.modules.flatMap((module) => module.assessmentAttempts ?? []);
  const latestAttempt = [...attempts].sort((left, right) => right.completedAt.localeCompare(left.completedAt))[0];
  const points = getTotalLearningPoints(progress);
  const moduleSummaries = modules.map((module) => ({
    module,
    summary: summarizeModuleProgress(module, questions, progress),
  }));

  function handleReset() {
    if (!ready || !window.confirm('¿Querés borrar todo el progreso guardado en este dispositivo?')) return;
    resetProgress();
  }

  return (
    <section className="progress-dashboard" aria-labelledby="progress-dashboard-title">
      <div className="progress-dashboard-heading">
        <div>
          <p className="eyebrow">TU APRENDIZAJE</p>
          <h2 id="progress-dashboard-title">Progreso por módulo</h2>
          <p className="progress-local-note">Este progreso se guarda en este navegador y dispositivo; no se sincroniza con una cuenta.</p>
        </div>
        <button className="secondary-button" type="button" onClick={handleReset} disabled={!ready || (progress.modules.length === 0 && status !== 'unsupported')}>
          Borrar progreso
        </button>
      </div>
      <div className="progress-overview">
        <strong>{ready ? `${points} puntos` : 'Cargando progreso…'}</strong>
        <span>{completedCount} preguntas respondidas · {answerCount} respuestas registradas</span>
        {ready && attempts.length > 0 && (
          <span>{attempts.length} {attempts.length === 1 ? 'evaluación guardada' : 'evaluaciones guardadas'} · último resultado: {latestAttempt?.correctAnswers} de {latestAttempt?.totalQuestions}</span>
        )}
      </div>
      <div className="module-progress-list">
        {moduleSummaries.map(({ module, summary }) => {
          const statusLabel = summary.status === 'completed'
            ? 'Completada'
            : summary.status === 'in-progress' ? 'En curso' : 'Sin empezar';
          return (
            <article className="module-progress-card" key={module.id}>
              <div className="module-progress-heading">
                <div>
                  <h3>{module.title}</h3>
                  <span className={`progress-status progress-status-${summary.status}`}>{statusLabel}</span>
                </div>
                <span>{summary.completedQuestions} de {summary.totalQuestions}</span>
              </div>
              <progress value={ready ? summary.completedQuestions : 0} max={summary.totalQuestions || 1} aria-label={`Progreso de ${module.title}`} />
              <Link className="module-link" href={`/lecciones/${module.id}`}>
                {summary.status === 'completed' ? 'Repasar lección →' : summary.status === 'in-progress' ? 'Continuar lección →' : 'Comenzar lección →'}
              </Link>
              {summary.topicsToReinforce.length > 0 && (
                <div className="reinforce-topics">
                  <strong>Temas para reforzar</strong>
                  <ul>
                    {summary.topicsToReinforce.map(({ topic, questionIds }) => (
                      <li key={topic}>
                        <span>{topic}</span>
                        {questionIds.map((questionId) => (
                          <Link key={questionId} href={`/lecciones/${module.id}#question-${questionId}`}>Revisar pregunta →</Link>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
        {status === 'invalid' && <p role="status">El progreso guardado estaba dañado y se reinició.</p>}
        {status === 'unsupported' && <p role="status">El progreso usa una versión más nueva y se conserva sin modificar.</p>}
        {(status === 'unavailable' || status === 'save-error') && <p role="status">El almacenamiento local no está disponible en este navegador.</p>}
        {status === 'migrated' && <p role="status">Se actualizó el formato del progreso guardado.</p>}
    </section>
  );
}
