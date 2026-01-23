import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SponsorsSection } from '@/components/SponsorsSection';
import { BackToTop } from '@/components/BackToTop';
import { TournamentBar } from '@/components/tournament';
import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getLanguageFromCookie();

  return (
    <html lang={lang}>
      <body className={`${montserrat.className} min-h-screen bg-[#F5F5F5]`}>
        <Providers>
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
