'use client';

import { useState } from 'react';
import type { CorrectOptionIndex, Question, QuestionAnswer } from '../domain/learning';
import { summarizeAssessment } from '../domain/summarize-assessment';
import { evaluateAnswer } from '../domain/evaluate-answer';
import { useLearningProgress } from './ProgressProvider';

type AssessmentPhase = 'exam' | 'results' | 'review' | 'review-complete';

export function FinalAssessment({ questions }: { questions: Question[] }) {
  const { ready, recordAnswer, recordAssessmentAttempt } = useLearningProgress();
  const [phase, setPhase] = useState<AssessmentPhase>('exam');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<CorrectOptionIndex | null>(null);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [reviewQuestions, setReviewQuestions] = useState<Question[]>([]);
  const [reviewAnswers, setReviewAnswers] = useState<QuestionAnswer[]>([]);
  const [reviewAnswer, setReviewAnswer] = useState<QuestionAnswer | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const summary = summarizeAssessment(questions, answers);
  const currentQuestions = phase === 'review' ? reviewQuestions : questions;
  const currentQuestion = currentQuestions[questionIndex];

  function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentQuestion || selectedOptionIndex === null) return;

    if (phase === 'review') {
      if (reviewAnswer) return;
      const answer = evaluateAnswer(currentQuestion, selectedOptionIndex);
      setReviewAnswers((previous) => [...previous, answer]);
      setReviewAnswer(answer);
      recordAnswer(currentQuestion.moduleId, answer);
      return;
    }

    if (phase !== 'exam') return;
    const answer = evaluateAnswer(currentQuestion, selectedOptionIndex);
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setSelectedOptionIndex(null);
    const currentAttemptId = attemptId ?? `evaluacion-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (!attemptId) setAttemptId(currentAttemptId);

    if (questionIndex + 1 === questions.length) {
      recordAssessmentAttempt(currentQuestion.moduleId, {
        id: currentAttemptId,
        completedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        correctAnswers: nextAnswers.filter((submittedAnswer) => submittedAnswer.isCorrect).length,
        answers: nextAnswers,
      });
      setPhase('results');
    } else {
      setQuestionIndex((previous) => previous + 1);
    }
  }

  function startReview() {
    setReviewQuestions(summary.incorrectQuestions);
    setReviewAnswers([]);
    setReviewAnswer(null);
    setQuestionIndex(0);
    setSelectedOptionIndex(null);
    setPhase('review');
  }

  function continueReview() {
    if (questionIndex + 1 === reviewQuestions.length) {
      setPhase('review-complete');
      return;
    }
    setQuestionIndex((previous) => previous + 1);
    setSelectedOptionIndex(null);
    setReviewAnswer(null);
  }

  function restartAssessment() {
    setAnswers([]);
    setReviewAnswers([]);
    setReviewQuestions([]);
    setReviewAnswer(null);
    setQuestionIndex(0);
    setSelectedOptionIndex(null);
    setAttemptId(null);
    setPhase('exam');
  }

  if (phase === 'results' || phase === 'review-complete') {
    return (
      <section className="assessment-panel" aria-live="polite">
        <p className="eyebrow">EVALUACIÓN FINAL · SEÑALES</p>
        {phase === 'results' ? (
          <>
            <h1>Resultado de tu evaluación</h1>
            <p className="assessment-score"><strong>{summary.correctCount}</strong> aciertos de {summary.total}</p>
            {summary.topicsToReinforce.length > 0 ? (
              <div className="reinforcement-topics">
                <h2>Temas para reforzar</h2>
                <ul>{summary.topicsToReinforce.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              </div>
            ) : (
              <p className="assessment-success">¡Muy bien! No quedaron temas para repasar.</p>
            )}
            {summary.incorrectQuestions.length > 0 && (
              <button className="answer-button" type="button" onClick={startReview}>
                Repasar {summary.incorrectQuestions.length} {summary.incorrectQuestions.length === 1 ? 'error' : 'errores'}
              </button>
            )}
            <button className="secondary-button" type="button" onClick={restartAssessment}>Volver a empezar</button>
          </>
        ) : (
          <>
            <h1>Terminaste el repaso</h1>
            <p>El resultado del intento original sigue siendo <strong>{summary.correctCount} de {summary.total}</strong>. Completaste {reviewAnswers.length} respuestas de repaso; no suman puntos a esa evaluación.</p>
            <button className="answer-button" type="button" onClick={() => setPhase('results')}>Volver al resultado</button>
          </>
        )}
      </section>
    );
  }

  if (!currentQuestion) return null;

  const answerIsCorrect = reviewAnswer?.isCorrect;

  return (
    <section className="assessment-panel" aria-labelledby="assessment-title">
      <p className="eyebrow">EVALUACIÓN FINAL · SEÑALES</p>
      <h1 id="assessment-title">{phase === 'review' ? 'Repaso de errores' : '¿Qué aprendiste sobre señales?'}</h1>
      <p className="assessment-progress" aria-live="polite">
        Pregunta {questionIndex + 1} de {currentQuestions.length}
        {phase === 'review' && <span> · El puntaje original no cambia</span>}
      </p>
      <form onSubmit={submitAnswer}>
        <fieldset disabled={reviewAnswer !== null}>
          <legend>{currentQuestion.prompt}</legend>
          <div className="question-options">
            {currentQuestion.options.map((option, index) => (
              <label className="question-option" key={option.id}>
                <input
                  type="radio"
                  name={`assessment-${currentQuestion.id}`}
                  value={index}
                  checked={selectedOptionIndex === index}
                  onChange={() => setSelectedOptionIndex(index as CorrectOptionIndex)}
                  required
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {phase === 'exam' && (
          <button className="answer-button" type="submit" disabled={selectedOptionIndex === null || !ready}>
            {questionIndex + 1 === questions.length ? 'Ver resultado' : 'Siguiente pregunta'}
          </button>
        )}
        {phase === 'review' && !reviewAnswer && (
          <button className="answer-button" type="submit" disabled={selectedOptionIndex === null || !ready}>Confirmar respuesta</button>
        )}
      </form>
      {phase === 'review' && reviewAnswer && (
        <div className={`answer-feedback ${answerIsCorrect ? 'is-correct' : 'is-incorrect'}`} role="status" aria-live="polite">
          <strong>{answerIsCorrect ? '¡Respuesta correcta!' : 'Todavía falta repasar esta regla'}</strong>
          <p>{currentQuestion.explanation}</p>
          {!answerIsCorrect && <p><strong>Respuesta correcta:</strong> {currentQuestion.options[currentQuestion.correctOptionIndex].text}</p>}
          <div className="answer-source">
            <strong>Fuente: </strong>
            <a href={currentQuestion.source.url} target="_blank" rel="noreferrer">{currentQuestion.source.title}</a>
            <span>{currentQuestion.source.publisher} · {currentQuestion.source.jurisdiction}</span>
            <span>{currentQuestion.source.reference}</span>
          </div>
          <button className="answer-button" type="button" onClick={continueReview}>
            {questionIndex + 1 === reviewQuestions.length ? 'Terminar repaso' : 'Continuar repaso'}
          </button>
        </div>
      )}
    </section>
  );
}
