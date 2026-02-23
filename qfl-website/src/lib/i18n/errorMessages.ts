import i18n from 'i18next';

export const getErrorMessage = (key: string): string => {
  return i18n.isInitialized ? i18n.t(key, { ns: 'errors' }) : key;
};
