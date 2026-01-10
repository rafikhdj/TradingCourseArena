import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';
// Supabase temporarily disabled
import Toast from 'react-native-toast-message';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in email and password',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 6 characters',
      });
      return;
    }

    setLoading(true);
    const { data, error } = await signUp(email, password, displayName);
    setLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: error.message,
      });
      return;
    }

    if (data?.user) {
      // Check if email confirmation is required
      if (data.session) {
        // User is automatically logged in (confirmation disabled)
        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: 'Welcome! You are now signed in.',
        });
        // Navigation will happen automatically via useAuth hook
      } else if (data.user.email_confirmed_at) {
        // User is confirmed but no session (shouldn't happen, but handle it)
        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: 'Please sign in with your credentials.',
        });
        setTimeout(() => {
          navigation.navigate('SignIn');
        }, 1500);
      } else {
        // Email confirmation required
        Toast.show({
          type: 'info',
          text1: 'Account Created',
          text2: 'Please check your email to verify your account before signing in.',
        });
        // Navigate to sign in after a delay
        setTimeout(() => {
          navigation.navigate('SignIn');
        }, 2000);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Typography variant="h2" style={styles.title}>
              Sign Up
            </Typography>
            <Typography variant="body" color={colors.textSecondary}>
              Create your account
            </Typography>
          </View>

          <Card style={styles.card}>
            <View style={styles.inputContainer}>
              <Typography variant="captionBold" color={colors.textSecondary} style={styles.label}>
                Display Name (Optional)
              </Typography>
              <TextInput
                style={styles.input}
                placeholder="Enter your display name"
                placeholderTextColor={colors.textTertiary}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Typography variant="captionBold" color={colors.textSecondary} style={styles.label}>
                Email
              </Typography>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Typography variant="captionBold" color={colors.textSecondary} style={styles.label}>
                Password
              </Typography>
              <TextInput
                style={styles.input}
                placeholder="Enter your password (min 6 characters)"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              style={styles.button}
            />

            <Button
              title="Back"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="medium"
              fullWidth
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  card: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    marginTop: 8,
  },
});

