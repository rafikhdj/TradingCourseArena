import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrainingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { TopicButton } from '../../components/TopicButton';
import { colors } from '../../theme/colors';
import { Topic } from '../../types';
import { useLeaderboard, useUserRank } from '../../hooks/useLeaderboard';
import { useAuth } from '../../hooks/useAuth';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'Training'>;

export const TrainingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(5);
  const { data: userRank, isLoading: rankLoading } = useUserRank(user?.id);

  const handleTopicPress = (topic: Topic) => {
    navigation.navigate('PracticeSetup', { topic });
  };

  const handlePracticePress = () => {
    navigation.navigate('PracticeSetup');
  };

  // Removed One-on-One button (Arena is no longer a tab)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1" color={colors.primary} style={styles.title}>
            TradingCourseArena
          </Typography>
        </View>

        <View style={styles.topicsSection}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Practice Topics
          </Typography>
          <View style={styles.topicsGrid}>
            <TopicButton topic="mental_math" onPress={() => handleTopicPress('mental_math')} />
            <TopicButton topic="probability" onPress={() => handleTopicPress('probability')} />
            <TopicButton topic="brainteaser" onPress={() => handleTopicPress('brainteaser')} />
            <TopicButton topic="derivatives" onPress={() => handleTopicPress('derivatives')} />
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Practice"
            onPress={handlePracticePress}
            variant="primary"
            size="large"
            fullWidth
            style={styles.actionButton}
          />
        </View>

        <View style={styles.leaderboardSection}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Leaderboard
          </Typography>
          <Card>
            {rankLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <View style={styles.userRank}>
                <Typography variant="bodyBold" color={colors.primary}>
                  Your Rank: #{userRank?.rank || 'N/A'}
                </Typography>
                <Typography variant="body" color={colors.textSecondary}>
                  Points: {userRank?.points || 0}
                </Typography>
              </View>
            )}

            <View style={styles.divider} />

            {leaderboardLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <View style={styles.leaderboardList}>
                {leaderboard?.map((entry, index) => (
                  <View key={entry.user_id} style={styles.leaderboardItem}>
                    <Typography variant="bodyBold" color={colors.text}>
                      #{entry.rank} {entry.display_name}
                    </Typography>
                    <Typography variant="body" color={colors.primary}>
                      {entry.points} pts
                    </Typography>
                  </View>
                ))}
              </View>
            )}
          </Card>
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
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  topicsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  topicsGrid: {
    gap: 16,
  },
  actionsSection: {
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  leaderboardSection: {
    marginBottom: 16,
  },
  userRank: {
    paddingBottom: 16,
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

