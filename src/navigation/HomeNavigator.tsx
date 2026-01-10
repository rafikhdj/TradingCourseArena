import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { InfiniteQuizScreen } from '../screens/home/InfiniteQuizScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0E27' },
      }}
    >
      <Stack.Screen name="Home" component={InfiniteQuizScreen} />
    </Stack.Navigator>
  );
};

