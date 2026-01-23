import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

interface ProvidersProps {
  children: ReactNode;
}

function AllProviders({ children }: ProvidersProps) {
  return (
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </SWRConfig>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
