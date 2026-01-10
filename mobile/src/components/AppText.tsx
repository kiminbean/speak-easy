import React, { memo, useMemo } from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants';
import { useSettingsStore } from '../stores';
import { getWritingDirection } from '../utils/rtl';

type TypographyVariant = keyof typeof TYPOGRAPHY;

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: TextStyle['fontWeight'];
  center?: boolean;
  children: React.ReactNode;
}

const LARGE_TEXT_SCALE = 1.25;

export const AppText = memo(function AppText({
  variant = 'body',
  color,
  weight,
  center,
  style,
  children,
  ...props
}: AppTextProps) {
  const { settings } = useSettingsStore();
  const writingDirection = getWritingDirection(settings.language);

  const computedStyle = useMemo(() => {
    const baseTypography = TYPOGRAPHY[variant];
    const baseFontSize = baseTypography.fontSize;
    
    const fontSize = settings.largeText 
      ? Math.round(baseFontSize * LARGE_TEXT_SCALE) 
      : baseFontSize;
    
    const lineHeight = settings.largeText
      ? Math.round(baseTypography.lineHeight * LARGE_TEXT_SCALE)
      : baseTypography.lineHeight;
    
    const fontWeight: TextStyle['fontWeight'] = weight 
      ?? (settings.highContrast ? '700' : baseTypography.fontWeight);
    
    const textColor = color ?? COLORS.text;

    return {
      fontSize,
      lineHeight,
      fontWeight,
      color: textColor,
      writingDirection,
      textAlign: center ? 'center' as const : undefined,
    };
  }, [variant, color, weight, center, settings.largeText, settings.highContrast, writingDirection]);

  return (
    <Text
      style={[styles.base, computedStyle, style]}
      accessibilityRole="text"
      {...props}
    >
      {children}
    </Text>
  );
});

const styles = StyleSheet.create({
  base: {
    color: COLORS.text,
  },
});

export default AppText;
