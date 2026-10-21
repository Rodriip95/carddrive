import type { Metadata } from 'next';
import Link from 'next/link';
import PracticeExperience from '../../components/practice-experience';
import { getModule } from '../../content/modules';

export const metadata: Metadata = {
  title: 'Práctica de manejo',
  description: 'Practicá situaciones de conducción con una experiencia interactiva 3D o una alternativa ilustrada sin Canvas.',
};

type PracticePageProps = { searchParams: Promise<{ modulo?: string | string[] }> };

export default async function PracticePage({ searchParams }: PracticePageProps) {
  // /practica?modulo=normas sigue la secuencia de situaciones de ese módulo.
  const { modulo } = await searchParams;
  const moduleId = typeof modulo === 'string' && getModule(modulo)?.mode === 'simulador' ? modulo : undefined;
  const learningModule = moduleId ? getModule(moduleId) : undefined;

  return (
    <main className="practice-page">
      <div className="practice-heading">
        <Link className="back-link" href={learningModule ? `/lecciones/${learningModule.id}` : '/'}>
          {learningModule ? '← Volver a la lección' : '← Volver a módulos'}
        </Link>
        <h1>{learningModule ? learningModule.title : 'Práctica de manejo'}</h1>
        <p>{learningModule
          ? 'Elegí qué hacer en cada situación y después ejecutalo con el auto.'
          : 'Elegí la experiencia 3D o el modo sin 3D para practicar decisiones reales de conducción.'}</p>
      </div>
      <PracticeExperience key={moduleId ?? 'libre'} moduleId={moduleId} />
    </main>
  );
}
