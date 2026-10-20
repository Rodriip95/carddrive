import Link from 'next/link';
import { modules } from '../content/modules';

export default function HomePage() {
  return (
    <main className="learning-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="A conducir, inicio">a conducir</Link>
        <nav aria-label="Navegación principal">
          <Link className="header-link" href="#modulos">Módulos</Link>
          <Link className="header-link" href="/evaluacion">Evaluación</Link>
          <Link className="header-link" href="/practica">Práctica 3D</Link>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">APRENDÉ A TU RITMO</p>
        <h1>Cada viaje empieza con aprender.</h1>
        <p className="hero-copy">Una guía clara y práctica para ganar confianza al volante, paso a paso.</p>
        <Link className="primary-link" href="#modulos">Explorar módulos ↓</Link>
      </section>

      <section className="module-section" id="modulos" aria-labelledby="modules-title">
        <div className="section-heading">
          <h2 id="modules-title">Tu camino de aprendizaje</h2>
          <p>{modules.length} módulos para empezar</p>
        </div>
        {modules.length === 0 ? (
          <p className="notice-card">Todavía no hay módulos disponibles. Volvé pronto para comenzar.</p>
        ) : (
          <div className="module-grid">
            {modules.map((module, index) => (
              <article className="module-card" key={module.id}>
                <span className={`module-icon module-icon-${index + 1}`} aria-hidden="true">{module.icon}</span>
                <p className="module-meta">{module.level} · {module.durationMinutes} min</p>
                <h3>{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <Link className="module-link" href={`/lecciones/${module.id}`}>Comenzar lección →</Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">Aprender con calma también es avanzar.</footer>
    </main>
  );
}
