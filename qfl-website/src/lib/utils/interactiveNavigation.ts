import { withTournamentContext } from './entityRoutes';

type SearchParamsLike = {
  get: (key: string) => string | null;
  toString: () => string;
};

type SearchParamsSource = SearchParamsLike | string | null | undefined;

type RouterLike = {
  push: (href: string, options?: { scroll?: boolean }) => void;
};

const NESTED_INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'textarea',
  'select',
  'summary',
  '[role="button"]',
  '[contenteditable="true"]',
  '[data-primary-click-stop]'
].join(',');

function isModifiedEvent(event: {
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}): boolean {
  return Boolean(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
}

export function isNestedInteractiveTarget(
  target: EventTarget | null,
  currentTarget: EventTarget | null
): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  const interactiveAncestor = target.closest(NESTED_INTERACTIVE_SELECTOR);
  if (!interactiveAncestor) {
    return false;
  }

  if (!(currentTarget instanceof Element)) {
    return true;
  }

  return currentTarget.contains(interactiveAncestor);
}

export function shouldSkipPrimaryNavigation(event: {
  defaultPrevented: boolean;
  button?: number;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  target: EventTarget | null;
  currentTarget: EventTarget | null;
}): boolean {
  if (event.defaultPrevented) {
    return true;
  }

  if (typeof event.button === 'number' && event.button !== 0) {
    return true;
  }

  if (isModifiedEvent(event)) {
    return true;
  }

  return isNestedInteractiveTarget(event.target, event.currentTarget);
}

export function resolvePrimaryHref(
  href: string | null | undefined,
  searchParams?: SearchParamsSource
): string | null {
  if (!href) {
    return null;
  }

  const contextualHref = withTournamentContext(href, searchParams);
  return typeof contextualHref === 'string' ? contextualHref : href;
}

export function navigatePrimary(
  router: RouterLike,
  href: string | null | undefined,
  searchParams?: SearchParamsSource,
  options?: { scroll?: boolean }
): void {
  const nextHref = resolvePrimaryHref(href, searchParams);
  if (!nextHref) {
    return;
  }

  router.push(nextHref, options);
}
