import { describe, expect, it } from 'vitest';

import {
  normalizeNewsHtmlContent,
  normalizeNewsMediaUrl,
} from './newsHtmlNormalizer';

describe('newsHtmlNormalizer', () => {
  it('normalizes links and image sources in news HTML', () => {
    const content = [
      '<p><a href="/news/123">Internal</a></p>',
      '<p><a href="https://example.com/a">External</a></p>',
      '<p><a href="javascript:alert(1)">Unsafe</a></p>',
      '<p><img src="/uploads/test.jpg" /></p>',
      '<p><img src="data:image/png;base64,AAAA" /></p>',
    ].join('');

    const normalized = normalizeNewsHtmlContent(content, {
      sourceUrl: 'https://kffleague.kz/ru/news/123',
    });

    expect(normalized).toContain('href="/news/123"');
    expect(normalized).toContain('href="https://example.com/a"');
    expect(normalized).toContain('target="_blank"');
    expect(normalized).toContain('rel="noopener noreferrer nofollow"');
    expect(normalized).not.toContain('javascript:alert(1)');
    expect(normalized).toContain('src="https://kffleague.kz/uploads/test.jpg"');
    expect(normalized).not.toContain('data:image/png;base64,AAAA');
  });

  it('rewrites teams/players paths into internal app routes', () => {
    const content = [
      '<p><a href="/teams/91">Team</a></p>',
      '<p><a href="https://kffleague.kz/players/12345?from=news">Player</a></p>',
    ].join('');

    const normalized = normalizeNewsHtmlContent(content, {
      sourceUrl: 'https://kffleague.kz/ru/news/456',
    });

    expect(normalized).toContain('href="/team/91"');
    expect(normalized).toContain('href="/player/12345?from=news"');
  });

  it('normalizes media URL with source fallback and internal host rewrite', () => {
    const normalized = normalizeNewsMediaUrl('http://localhost:9000/internal/image.jpg', {
      sourceUrl: 'https://kffleague.kz/ru/news/789',
    });

    expect(normalized).toBe('https://kffleague.kz/internal/image.jpg');
  });
});

