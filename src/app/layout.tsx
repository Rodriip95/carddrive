import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'A conducir | Aprendé a tu ritmo',
    template: '%s | A conducir',
  },
  description: 'Aprendé a conducir con módulos claros y prácticos, a tu propio ritmo.',
  applicationName: 'A conducir',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
