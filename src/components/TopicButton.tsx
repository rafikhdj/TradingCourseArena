import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { colors } from '../theme/colors';
import { Topic } from '../types';
import { topicLabels, topicColors } from '../utils/topic';

interface TopicButtonProps {
  topic: Topic;
  onPress: () => void;
  style?: ViewStyle;
}

export const TopicButton: React.FC<TopicButtonProps> = ({ topic, onPress, style }) => {
  const topicColor = topicColors[topic];
  
  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: topicColor }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Typography variant="h3" color={topicColor}>
        {topicLabels[topic]}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
});

