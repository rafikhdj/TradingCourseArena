import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArenaStackParamList } from './types';
import { ArenaHomeScreen } from '../screens/arena/ArenaHomeScreen';
import { MockBattleScreen } from '../screens/arena/MockBattleScreen';

const Stack = createNativeStackNavigator<ArenaStackParamList>();

export const ArenaNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0E27' },
      }}
    >
      <Stack.Screen name="ArenaHome" component={ArenaHomeScreen} />
      <Stack.Screen name="MockBattle" component={MockBattleScreen} />
    </Stack.Navigator>
  );
};

