import type { Metadata } from 'next';
import Link from 'next/link';
import PracticeExperience from '../../components/practice-experience';

export const metadata: Metadata = {
  title: 'Práctica de manejo',
  description: 'Explorá una práctica de conducción interactiva en 3D.',
};

export default function PracticePage() {
  return (
    <main className="practice-page">
      <div className="practice-heading">
        <Link className="back-link" href="/">← Volver a módulos</Link>
        <h1>Práctica de manejo</h1>
        <p>Usá los controles para acelerar y cambiar de carril.</p>
      </div>
      <PracticeExperience />
    </main>
  );
}
