import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="lesson-page">
      <section className="lesson-panel notice-card">
        <h1>No encontramos esa página</h1>
        <p>El enlace puede estar incompleto o el contenido ya no está disponible.</p>
        <Link className="primary-link" href="/">Volver al catálogo</Link>
      </section>
    </main>
  );
}
