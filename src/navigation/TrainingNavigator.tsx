import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrainingStackParamList } from './types';
import { TrainingScreen } from '../screens/training/TrainingScreen';
import { PracticeSetupScreen } from '../screens/practice/PracticeSetupScreen';
import { QuizScreen } from '../screens/practice/QuizScreen';
import { QuizResultScreen } from '../screens/practice/QuizResultScreen';

const Stack = createNativeStackNavigator<TrainingStackParamList>();

export const TrainingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0E27' },
      }}
    >
      <Stack.Screen name="Training" component={TrainingScreen} />
      <Stack.Screen name="PracticeSetup" component={PracticeSetupScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
    </Stack.Navigator>
  );
};

