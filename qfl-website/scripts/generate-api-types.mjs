#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const OPENAPI_URL = process.env.OPENAPI_URL || 'http://localhost:8000/openapi.json';
const OUTPUT_PATH = resolve(process.cwd(), 'src/lib/api/generated/openapi.ts');

async function loadGenerator() {
  try {
    const mod = await import('openapi-typescript');
    return {
      generate: mod.default,
      astToString: mod.astToString,
    };
  } catch (error) {
    throw new Error(
      'openapi-typescript is not installed. Run `npm install` in qfl-website when npm registry is reachable.'
    );
  }
}

async function fetchSchema(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI schema: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function main() {
  const { generate, astToString } = await loadGenerator();
  const schema = await fetchSchema(OPENAPI_URL);
  const generated = await generate(schema, {
    alphabetize: true,
    exportType: true,
  });
  const output = typeof generated === 'string'
    ? generated
    : astToString(generated);

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  const header = [
    '/**',
    ' * AUTO-GENERATED FILE. DO NOT EDIT.',
    ` * Source: ${OPENAPI_URL}`,
    ' * Run: npm run gen:api-types',
    ' */',
    '',
  ].join('\n');
  await writeFile(OUTPUT_PATH, `${header}${output}`, 'utf8');
  console.log(`Generated API types: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('[gen:api-types] failed:', error.message);
  process.exitCode = 1;
});
