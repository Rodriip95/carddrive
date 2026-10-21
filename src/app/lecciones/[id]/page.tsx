import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModule, modules } from '../../../content/modules';
import { getQuestionsByModule } from '../../../content/questions';
import { QuestionCard } from '../../../components/QuestionCard';
import { SignalCatalog } from '../../../components/SignalCatalog';
import { trafficSignals } from '../../../content/signals';
import { PreDriveChecklist } from '../../../components/PreDriveChecklist';
import { LessonCompletion } from '../../../components/LessonCompletion';

type LessonPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return modules.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { id } = await params;
  const module = getModule(id);
  if (!module) return { title: 'Lección no encontrada' };
  return { title: module.title, description: module.description };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const module = getModule(id);
  if (!module) notFound();
  const questions = getQuestionsByModule(module.id);

  return (
    <main className="lesson-page">
      <Link className="back-link" href="/">← Volver a módulos</Link>
      <article className="lesson-panel">
        <p className="eyebrow">MÓDULO · {module.durationMinutes} MIN</p>
        <h1>{module.title}</h1>
        <p className="hero-copy">{module.description}</p>
        <h2>En esta lección vas a</h2>
        <ol className="lesson-list">
          {module.lesson.map((item) => <li key={item}>{item}</li>)}
        </ol>
        {module.id === 'senales' && <SignalCatalog signals={trafficSignals} />}
        {module.id === 'vehiculo' && <PreDriveChecklist />}
        {module.mode === 'simulador' ? (
          <>
            <p className="lesson-note">Este módulo se aprende conduciendo: en cada situación elegís qué hacer y después tenés que ejecutarlo con el auto.</p>
            <Link className="primary-link" href={`/practica?modulo=${module.id}`}>Entrar al simulador →</Link>
            <LessonCompletion module={module} />
          </>
        ) : (
          <>
            {questions.length > 0 ? questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            )) : <p className="lesson-note">El contenido interactivo de esta lección estará disponible próximamente.</p>}
            {questions.length > 0 && <LessonCompletion module={module} />}
          </>
        )}
      </article>
    </main>
  );
}
