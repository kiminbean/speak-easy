import { I18nManager, StyleSheet } from 'react-native';
import { SupportedLanguage } from '../types';

const RTL_LANGUAGES: SupportedLanguage[] = ['ar', 'ur'];

export function isRTLLanguage(language: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(language);
}

export function isRTL(): boolean {
  return I18nManager.isRTL;
}

export function configureRTLRequiresRestart(language: SupportedLanguage): boolean {
  const shouldBeRTL = isRTLLanguage(language);
  const isCurrentlyRTL = I18nManager.isRTL;

  if (shouldBeRTL !== isCurrentlyRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    return true;
  }

  return false;
}

export function getTextAlign(language: SupportedLanguage): 'left' | 'right' | 'auto' {
  return isRTLLanguage(language) ? 'right' : 'left';
}

export function getFlexDirection(language: SupportedLanguage): 'row' | 'row-reverse' {
  return isRTLLanguage(language) ? 'row-reverse' : 'row';
}

export function getWritingDirection(language: SupportedLanguage): 'rtl' | 'ltr' {
  return isRTLLanguage(language) ? 'rtl' : 'ltr';
}

export function getStartMargin(value: number, language: SupportedLanguage) {
  return isRTLLanguage(language)
    ? { marginRight: value }
    : { marginLeft: value };
}

export function getEndMargin(value: number, language: SupportedLanguage) {
  return isRTLLanguage(language)
    ? { marginLeft: value }
    : { marginRight: value };
}

export function getStartPadding(value: number, language: SupportedLanguage) {
  return isRTLLanguage(language)
    ? { paddingRight: value }
    : { paddingLeft: value };
}

export function getEndPadding(value: number, language: SupportedLanguage) {
  return isRTLLanguage(language)
    ? { paddingLeft: value }
    : { paddingRight: value };
}

export function createRTLStyles(language: SupportedLanguage) {
  const rtl = isRTLLanguage(language);

  return StyleSheet.create({
    row: {
      flexDirection: rtl ? 'row-reverse' : 'row',
    },
    textStart: {
      textAlign: rtl ? 'right' : 'left',
    },
    textEnd: {
      textAlign: rtl ? 'left' : 'right',
    },
    itemsStart: {
      alignItems: rtl ? 'flex-end' : 'flex-start',
    },
    itemsEnd: {
      alignItems: rtl ? 'flex-start' : 'flex-end',
    },
    selfStart: {
      alignSelf: rtl ? 'flex-end' : 'flex-start',
    },
    selfEnd: {
      alignSelf: rtl ? 'flex-start' : 'flex-end',
    },
    absoluteStart: {
      [rtl ? 'right' : 'left']: 0,
    },
    absoluteEnd: {
      [rtl ? 'left' : 'right']: 0,
    },
  });
}

export function getRTLUtils(language: SupportedLanguage) {
  const rtl = isRTLLanguage(language);

  return {
    isRTL: rtl,
    textAlign: rtl ? 'right' : 'left' as 'left' | 'right',
    writingDirection: rtl ? 'rtl' : 'ltr' as 'rtl' | 'ltr',
    flexDirection: rtl ? 'row-reverse' : 'row' as 'row' | 'row-reverse',
    alignSelf: rtl ? 'flex-end' : 'flex-start' as 'flex-start' | 'flex-end',
    transform: rtl ? [{ scaleX: -1 }] : undefined,
  };
}
