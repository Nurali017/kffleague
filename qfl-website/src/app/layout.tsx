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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
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

// Inline script to prevent league color flash — applies CSS vars before hydration
// Colors stored as RGB channels for Tailwind opacity modifier support
const leagueColorScript = `
  (function() {
    try {
      var colors = {
        pl:  { p:'30 77 140',  pl:'42 95 163',  pd:'22 58 107', a:'229 183 59', as:'240 201 93' },
        '1l':{ p:'61 122 62',  pl:'78 155 79',  pd:'46 94 47',  a:'123 198 125',as:'163 217 164'},
        cup: { p:'74 26 43',   pl:'107 45 66',  pd:'53 18 31',  a:'139 58 85',  as:'181 102 126'},
        '2l':{ p:'168 106 43', pl:'196 132 61', pd:'127 79 32', a:'212 168 92', as:'229 200 138'},
        el:  { p:'107 79 160', pl:'133 102 184',pd:'80 59 120', a:'160 126 214',as:'196 168 232'}
      };
      var t = localStorage.getItem('qfl_selected_tournament');
      if (!t) {
        var m = document.cookie.match(/qfl_tournament=([^;]+)/);
        t = m ? m[1] : 'pl';
      }
      var c = colors[t] || colors['pl'];
      var s = document.documentElement.style;
      s.setProperty('--league-primary', c.p);
      s.setProperty('--league-primary-light', c.pl);
      s.setProperty('--league-primary-dark', c.pd);
      s.setProperty('--league-accent', c.a);
      s.setProperty('--league-accent-soft', c.as);
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
        <script dangerouslySetInnerHTML={{ __html: leagueColorScript }} />
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
