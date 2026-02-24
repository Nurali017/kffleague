import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/i18n/types';

const COOKIE_NAME = 'NEXT_LOCALE';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const lang of SUPPORTED_LANGUAGES) {
    if (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)) {
      const newPath = pathname.slice(`/${lang}`.length) || '/';
      const url = request.nextUrl.clone();
      url.pathname = newPath;
      const response = NextResponse.redirect(url);
      response.cookies.set(COOKIE_NAME, lang, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
      return response;
    }
  }
}

export const config = {
  matcher: ['/(kz|ru)/:path*', '/(kz|ru)'],
};
