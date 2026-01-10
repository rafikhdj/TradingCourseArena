import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { colors } from '../../theme/colors';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h1" color={colors.primary} style={styles.title}>
            TradingCourseArena
          </Typography>
          <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Train for trading interviews
          </Typography>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('SignIn')}
            variant="primary"
            size="large"
            fullWidth
            style={styles.button}
          />
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            variant="outline"
            size="large"
            fullWidth
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    marginBottom: 8,
  },
});

