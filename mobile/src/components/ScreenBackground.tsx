import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { COLORS, GLASS } from '../constants';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const ScreenBackground = memo(function ScreenBackground({
  children,
  style,
  contentStyle,
}: ScreenBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      <View pointerEvents="none" style={[styles.orb, styles.orbTop]} />
      <View pointerEvents="none" style={[styles.orb, styles.orbSide]} />
      <View pointerEvents="none" style={[styles.orb, styles.orbBottom]} />
      <View pointerEvents="none" style={styles.mesh} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  mesh: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: GLASS.overlay,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbTop: {
    width: 280,
    height: 280,
    top: -80,
    right: -30,
    backgroundColor: GLASS.orbA,
  },
  orbSide: {
    width: 220,
    height: 220,
    top: '32%',
    left: -100,
    backgroundColor: GLASS.orbB,
  },
  orbBottom: {
    width: 320,
    height: 320,
    bottom: -140,
    right: -80,
    backgroundColor: GLASS.orbC,
  },
});

export default ScreenBackground;
