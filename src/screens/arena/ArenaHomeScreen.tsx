import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArenaStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';

type NavigationProp = NativeStackNavigationProp<ArenaStackParamList, 'ArenaHome'>;

export const ArenaHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h2" color={colors.primary} style={styles.title}>
            One-on-One Arena
          </Typography>
        </View>

        <Card style={styles.infoCard}>
          <Typography variant="body" color={colors.textSecondary} style={styles.infoText}>
            In future versions, you'll be able to challenge other users to real-time market making battles.
            For now, you can try a simulated battle against a bot.
          </Typography>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Quick Battle vs Bot"
            onPress={() => navigation.navigate('MockBattle')}
            variant="primary"
            size="large"
            fullWidth
            style={styles.button}
          />
          <Button
            title="Coming soon: Ranked Battles vs Users"
            onPress={() => {}}
            variant="outline"
            size="large"
            fullWidth
            disabled={true}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 32,
  },
  infoText: {
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  button: {
    marginBottom: 8,
  },
});

