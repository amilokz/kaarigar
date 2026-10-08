import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Kaarigar — Roz ki mazdoori, ab chowk par intezaar nahi',
  description:
    'Demo: a local skilled-worker marketplace. Find verified electricians, plumbers, painters, masons, carpenters and AC technicians by area — book in minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ur">
      <body className="min-h-screen bg-stone-100 text-stone-900 antialiased">
        <LanguageProvider>
          <TopBar />
          <main className="mx-auto w-full max-w-6xl px-4 pb-4 pt-6">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
