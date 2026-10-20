'use client';

import { useState } from 'react';
import type { CorrectOptionIndex, Question, QuestionAnswer } from '../domain/learning';
import { evaluateAnswer } from '../domain/evaluate-answer';

export function QuestionCard({ question }: { question: Question }) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<CorrectOptionIndex | null>(null);
  const [answer, setAnswer] = useState<QuestionAnswer | null>(null);

  function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedOptionIndex === null || answer) return;
    setAnswer(evaluateAnswer(question, selectedOptionIndex));
  }

  return (
    <section className="question-card" aria-labelledby={`question-${question.id}`}>
      <p className="eyebrow">PONÉ A PRUEBA · {question.topic.toUpperCase()}</p>
      <form onSubmit={submitAnswer}>
        <fieldset disabled={answer !== null}>
          <legend id={`question-${question.id}`}>{question.prompt}</legend>
          <div className="question-options">
            {question.options.map((option, index) => (
              <label className="question-option" key={option.id}>
                <input
                  type="radio"
                  name={question.id}
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
        {!answer && (
          <button className="answer-button" type="submit" disabled={selectedOptionIndex === null}>
            Confirmar respuesta
          </button>
        )}
      </form>
      {answer && (
        <div className={`answer-feedback ${answer.isCorrect ? 'is-correct' : 'is-incorrect'}`} role="status" aria-live="polite">
          <strong>{answer.isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}</strong>
          <p>{question.explanation}</p>
          {!answer.isCorrect && (
            <p><strong>Respuesta correcta:</strong> {question.options[question.correctOptionIndex].text}</p>
          )}
          <div className="answer-source">
            <strong>Fuente: </strong>
            <a href={question.source.url} target="_blank" rel="noreferrer">
              {question.source.title}
            </a>
            <span>{question.source.publisher} · {question.source.jurisdiction}</span>
            <span>{question.source.reference}</span>
          </div>
        </div>
      )}
    </section>
  );
}
