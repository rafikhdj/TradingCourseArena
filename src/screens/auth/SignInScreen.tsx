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
import Toast from 'react-native-toast-message';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setLoading(true);
    const { data, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      // Check if it's a network/config error (JSON parse error)
      if (error.message.includes('JSON Parse error') || error.message.includes('Unexpected character')) {
        Toast.show({
          type: 'error',
          text1: 'Connection Error',
          text2: 'Unable to connect to server. Please check your internet connection and try again.',
        });
      }
      // Check if it's an email confirmation error
      else if (error.message.includes('email') && error.message.includes('confirm')) {
        Toast.show({
          type: 'error',
          text1: 'Email Not Verified',
          text2: 'Please check your email and verify your account before signing in.',
        });
      } else if (error.message.includes('Invalid login credentials')) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Credentials',
          text2: 'Please check your email and password. If you just signed up, make sure your email is verified.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sign In Failed',
          text2: error.message,
        });
      }
    } else if (data?.user) {
      // Success - navigation will happen automatically via useAuth hook
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You are now signed in.',
      });
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
              Sign In
            </Typography>
            <Typography variant="body" color={colors.textSecondary}>
              Welcome back!
            </Typography>
          </View>

          <Card style={styles.card}>
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
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            <Button
              title="Sign In"
              onPress={handleSignIn}
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

