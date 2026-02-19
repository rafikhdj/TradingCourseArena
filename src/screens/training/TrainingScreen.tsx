import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrainingStackParamList } from '../../navigation/types';
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
    if (topic === 'mental_math') {
      // Navigate to new Mental Math mode selection
      navigation.navigate('MentalMathMode');
    } else {
      navigation.navigate('PracticeSetup', { topic });
    }
  };

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

        {/* Market Making */}
        <View style={styles.marketMakingSection}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Market Making
          </Typography>
          <TouchableOpacity
            style={styles.marketMakingCard}
            onPress={() => navigation.navigate('MarketMakingSetup')}
            activeOpacity={0.7}
          >
            <View style={styles.marketMakingIcon}>
              <Typography variant="h2">🏦</Typography>
            </View>
            <View style={styles.marketMakingInfo}>
              <Typography variant="bodyBold" color={colors.text}>
                Make Me a Market!
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Practice market making on facts and guesstimates
              </Typography>
            </View>
            <Typography variant="bodyBold" color={colors.primary}>→</Typography>
          </TouchableOpacity>
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
  marketMakingSection: {
    marginBottom: 32,
  },
  marketMakingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    gap: 12,
  },
  marketMakingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketMakingInfo: {
    flex: 1,
    gap: 4,
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

