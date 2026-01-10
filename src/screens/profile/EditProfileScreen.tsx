import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile, useUpdateUserProfile } from '../../hooks/useUserProfile';
import Toast from 'react-native-toast-message';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

export const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);
  const updateProfile = useUpdateUserProfile();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');

  const handleSave = async () => {
    if (!user || !displayName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Display name cannot be empty',
      });
      return;
    }

    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        displayName: displayName.trim(),
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated',
      });
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update profile',
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
              Edit Profile
            </Typography>
          </View>

          <Card style={styles.card}>
            <View style={styles.inputContainer}>
              <Typography variant="captionBold" color={colors.textSecondary} style={styles.label}>
                Display Name
              </Typography>
              <TextInput
                style={styles.input}
                placeholder="Enter display name"
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
                style={[styles.input, styles.inputDisabled]}
                value={user?.email || ''}
                editable={false}
              />
              <Typography variant="caption" color={colors.textTertiary}>
                Email cannot be changed
              </Typography>
            </View>

            <Button
              title="Save Changes"
              onPress={handleSave}
              variant="primary"
              size="large"
              fullWidth
              loading={updateProfile.isPending}
              style={styles.saveButton}
            />
          </Card>

          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="medium"
            fullWidth
          />
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
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
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
  inputDisabled: {
    opacity: 0.5,
  },
  saveButton: {
    marginTop: 8,
  },
});

