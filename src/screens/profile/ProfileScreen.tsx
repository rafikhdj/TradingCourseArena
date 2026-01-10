import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useUserStats } from '../../hooks/useQuestionAttempts';
import { useUserRank } from '../../hooks/useLeaderboard';
import { topicLabels } from '../../utils/topic';
import Toast from 'react-native-toast-message';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);
  const { data: stats, isLoading: statsLoading } = useUserStats(user?.id);
  const { data: rankData, isLoading: rankLoading } = useUserRank(user?.id);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h2" color={colors.primary} style={styles.title}>
            Profile
          </Typography>
        </View>

        {profileLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Card style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Typography variant="h3" style={styles.displayName}>
                {profile?.display_name || user?.email?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="body" color={colors.textSecondary}>
                {user?.email}
              </Typography>
            </View>

            {rankLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Typography variant="caption" color={colors.textTertiary}>
                    Rank
                  </Typography>
                  <Typography variant="h3" color={colors.primary}>
                    #{rankData?.rank || 'N/A'}
                  </Typography>
                </View>
                <View style={styles.statItem}>
                  <Typography variant="caption" color={colors.textTertiary}>
                    Points
                  </Typography>
                  <Typography variant="h3" color={colors.primary}>
                    {rankData?.points || 0}
                  </Typography>
                </View>
              </View>
            )}
          </Card>
        )}

        <View style={styles.performanceSection}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Performance by Topic
          </Typography>
          {statsLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.statsContainer}>
              {stats && Object.keys(stats).length > 0 ? (
                Object.entries(stats).map(([topic, data]: [string, any]) => {
                  const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                  return (
                    <Card key={topic} style={styles.topicStatCard}>
                      <Typography variant="bodyBold" color={colors.text}>
                        {topicLabels[topic as keyof typeof topicLabels]}
                      </Typography>
                      <Typography variant="body" color={colors.textSecondary}>
                        {data.correct}/{data.total} correct ({percentage}%)
                      </Typography>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <Typography variant="body" color={colors.textSecondary}>
                    No practice data yet. Start practicing to see your stats!
                  </Typography>
                </Card>
              )}
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            title="Mental Math Stats"
            onPress={() => navigation.navigate('MentalMathStats')}
            variant="secondary"
            size="large"
            fullWidth
            style={styles.button}
          />
          <Button
            title="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
            variant="secondary"
            size="large"
            fullWidth
            style={styles.button}
          />
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="danger"
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
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  profileCard: {
    marginBottom: 24,
    gap: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  displayName: {
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  performanceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsContainer: {
    gap: 12,
  },
  topicStatCard: {
    gap: 8,
  },
  actions: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});

