import type { Metadata } from 'next';
import Link from 'next/link';
import { FinalAssessment } from '../../components/FinalAssessment';
import { getQuestionsByModule } from '../../content/questions';

export const metadata: Metadata = {
  title: 'Evaluación de señales',
  description: 'Evaluá lo aprendido sobre señales de tránsito y repasá las preguntas que necesites reforzar.',
};

export default function AssessmentPage() {
  return (
    <main className="lesson-page">
      <Link className="back-link" href="/">← Volver a módulos</Link>
      <FinalAssessment questions={getQuestionsByModule('senales')} />
    </main>
  );
}
