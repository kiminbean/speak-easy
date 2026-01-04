import {
  isRTLLanguage,
  getTextAlign,
  getFlexDirection,
  getWritingDirection,
  getRTLUtils,
} from '../utils/rtl';

describe('RTL Utilities', () => {
  describe('isRTLLanguage', () => {
    it('returns true for Arabic', () => {
      expect(isRTLLanguage('ar')).toBe(true);
    });

    it('returns true for Urdu', () => {
      expect(isRTLLanguage('ur')).toBe(true);
    });

    it('returns false for English', () => {
      expect(isRTLLanguage('en')).toBe(false);
    });

    it('returns false for Korean', () => {
      expect(isRTLLanguage('ko')).toBe(false);
    });

    it('returns false for other LTR languages', () => {
      expect(isRTLLanguage('ja')).toBe(false);
      expect(isRTLLanguage('es')).toBe(false);
      expect(isRTLLanguage('fr')).toBe(false);
    });
  });

  describe('getTextAlign', () => {
    it('returns right for RTL languages', () => {
      expect(getTextAlign('ar')).toBe('right');
      expect(getTextAlign('ur')).toBe('right');
    });

    it('returns left for LTR languages', () => {
      expect(getTextAlign('en')).toBe('left');
      expect(getTextAlign('ko')).toBe('left');
    });
  });

  describe('getFlexDirection', () => {
    it('returns row-reverse for RTL languages', () => {
      expect(getFlexDirection('ar')).toBe('row-reverse');
      expect(getFlexDirection('ur')).toBe('row-reverse');
    });

    it('returns row for LTR languages', () => {
      expect(getFlexDirection('en')).toBe('row');
      expect(getFlexDirection('ko')).toBe('row');
    });
  });

  describe('getWritingDirection', () => {
    it('returns rtl for RTL languages', () => {
      expect(getWritingDirection('ar')).toBe('rtl');
      expect(getWritingDirection('ur')).toBe('rtl');
    });

    it('returns ltr for LTR languages', () => {
      expect(getWritingDirection('en')).toBe('ltr');
      expect(getWritingDirection('ko')).toBe('ltr');
    });
  });

  describe('getRTLUtils', () => {
    it('returns correct values for RTL language', () => {
      const utils = getRTLUtils('ar');
      expect(utils.isRTL).toBe(true);
      expect(utils.textAlign).toBe('right');
      expect(utils.writingDirection).toBe('rtl');
      expect(utils.flexDirection).toBe('row-reverse');
      expect(utils.alignSelf).toBe('flex-end');
      expect(utils.transform).toEqual([{ scaleX: -1 }]);
    });

    it('returns correct values for LTR language', () => {
      const utils = getRTLUtils('en');
      expect(utils.isRTL).toBe(false);
      expect(utils.textAlign).toBe('left');
      expect(utils.writingDirection).toBe('ltr');
      expect(utils.flexDirection).toBe('row');
      expect(utils.alignSelf).toBe('flex-start');
      expect(utils.transform).toBeUndefined();
    });
  });
});
