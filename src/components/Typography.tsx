import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'captionBold' | 'small';
  color?: string;
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = colors.text,
  children,
  style,
  numberOfLines,
}) => {
  return (
    <Text
      style={[typography[variant], { color }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

