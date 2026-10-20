'use client';

export default function PracticeError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="practice-page">
      <section className="lesson-panel notice-card" role="alert">
        <h1>No se pudo cargar la práctica</h1>
        <p>Revisá tu conexión e intentá cargar la escena nuevamente.</p>
        <button className="primary-link" type="button" onClick={reset}>Reintentar</button>
      </section>
    </main>
  );
}
