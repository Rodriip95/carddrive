import type { Metadata } from 'next';
import Link from 'next/link';
import PracticeExperience from '../../components/practice-experience';

export const metadata: Metadata = {
  title: 'Práctica de manejo',
  description: 'Practicá situaciones de conducción con una experiencia interactiva 3D o una alternativa ilustrada sin Canvas.',
};

export default function PracticePage() {
  return (
    <main className="practice-page">
      <div className="practice-heading">
        <Link className="back-link" href="/">← Volver a módulos</Link>
        <h1>Práctica de manejo</h1>
        <p>Elegí la experiencia 3D o el modo sin 3D para practicar decisiones reales de conducción.</p>
      </div>
      <PracticeExperience />
    </main>
  );
}
