import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrainingStackParamList } from './types';
import { TrainingScreen } from '../screens/training/TrainingScreen';
import { PracticeSetupScreen } from '../screens/practice/PracticeSetupScreen';
import { QuizScreen } from '../screens/practice/QuizScreen';
import { QuizResultScreen } from '../screens/practice/QuizResultScreen';
import { MentalMathModeScreen } from '../screens/training/MentalMathModeScreen';
import { MentalMathTrainingScreen } from '../screens/training/MentalMathTrainingScreen';
import { MentalMathCoursScreen } from '../screens/training/MentalMathCoursScreen';
import { MentalMathQuizScreen } from '../screens/training/MentalMathQuizScreen';
import { MarketMakingSetupScreen } from '../screens/market-making/MarketMakingSetupScreen';
import { MarketMakingGameScreen } from '../screens/market-making/MarketMakingGameScreen';

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
      <Stack.Screen name="MentalMathMode" component={MentalMathModeScreen} />
      <Stack.Screen name="MentalMathTraining" component={MentalMathTrainingScreen} />
      <Stack.Screen name="MentalMathCours" component={MentalMathCoursScreen} />
      <Stack.Screen name="MentalMathQuiz" component={MentalMathQuizScreen} />
      <Stack.Screen name="MarketMakingSetup" component={MarketMakingSetupScreen} />
      <Stack.Screen name="MarketMakingGame" component={MarketMakingGameScreen} />
    </Stack.Navigator>
  );
};

