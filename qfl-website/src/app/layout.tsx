import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SponsorsSection } from '@/components/SponsorsSection';
import { BackToTop } from '@/components/BackToTop';
import { TournamentBar } from '@/components/tournament';
import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';
import { getTournamentFromCookie } from '@/lib/tournament/cookies.server';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Қазақстан Премьер-Лигасы',
  description: 'Официальный сайт Казахстанской Премьер-Лиги',
};

// Inline script to prevent theme flash - runs before React hydration
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getLanguageFromCookie();
  const initialTournamentId = getTournamentFromCookie();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${montserrat.className} min-h-screen bg-[#F5F5F5] dark:bg-dark-bg`}>
        <Providers initialLang={lang} initialTournamentId={initialTournamentId}>
          <TournamentBar />
          <Header />
          <main>{children}</main>
          <SponsorsSection />
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
