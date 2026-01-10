import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeNavigator } from './HomeNavigator';
import { TrainingNavigator } from './TrainingNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({ label, color }: { label: string; color: string }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.iconText, { color }]}>{label}</Text>
  </View>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon label="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="TrainingTab"
        component={TrainingNavigator}
        options={{
          tabBarLabel: 'Training',
          tabBarIcon: ({ color }) => <TabIcon label="📚" color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon label="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
});

