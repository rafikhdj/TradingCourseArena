import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { TrainingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { useSubmitAttempts } from '../../hooks/useQuestionAttempts';
import { useAuth } from '../../hooks/useAuth';
import { Question, QuizAnswer } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { useQueryClient as useReactQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'QuizResult'>;
type QuizResultRouteProp = RouteProp<TrainingStackParamList, 'QuizResult'>;

export const QuizResultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<QuizResultRouteProp>();
  const { attempts, questions, config, timeSpent, isMentalMath = false } = route.params;
  const { user } = useAuth();
  const submitAttempts = useSubmitAttempts();
  const queryClient = useReactQueryClient();
  const hasSubmittedRef = useRef(false); // Prevent double submission

  // Count statistics
  // For Mental Math, since we replace previous attempts for the same question,
  // each question should only have one attempt in the array
  // But to be safe, we deduplicate to get unique questions
  const uniqueQuestionIds = Array.from(new Set(attempts.map(a => a.questionId)));
  const actualTotalQuestions = isMentalMath ? uniqueQuestionIds.length : attempts.length;
  
  // Count correct answers
  const actualCorrectCount = isMentalMath
    ? uniqueQuestionIds.filter(qId => {
        const questionAttempt = attempts.find(a => a.questionId === qId);
        const isCorrect = questionAttempt?.isCorrect === true;
        if (!isCorrect && questionAttempt) {
          console.log('Mental Math: Question marked incorrect:', {
            questionId: qId,
            userAnswer: questionAttempt.answer,
            isCorrect: questionAttempt.isCorrect,
          });
        }
        return isCorrect;
      }).length
    : attempts.filter((a: QuizAnswer) => a.isCorrect).length;
  
  const percentage = actualTotalQuestions > 0 ? Math.round((actualCorrectCount / actualTotalQuestions) * 100) : 0;
  const timeSpentSeconds = Math.round(timeSpent / 1000);
  
  // Debug log for Mental Math
  if (isMentalMath) {
    console.log('Mental Math stats:', {
      totalAttempts: attempts.length,
      uniqueQuestions: uniqueQuestionIds.length,
      actualTotalQuestions,
      actualCorrectCount,
      percentage,
      attempts: attempts.map(a => ({ questionId: a.questionId, isCorrect: a.isCorrect, answer: a.answer })),
    });
  }
  
  // Calculate best streak based on the order attempts were made
  // Since we replace attempts for the same question, each question appears once in the array
  let bestStreak = 0;
  let currentStreak = 0;
  
  attempts.forEach((attempt: QuizAnswer) => {
    if (attempt.isCorrect) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  useEffect(() => {
    // Prevent double submission
    if (hasSubmittedRef.current) {
      console.log('Already submitted, skipping...');
      return;
    }

    console.log('QuizResult useEffect triggered:', {
      hasUser: !!user,
      userId: user?.id,
      attemptsLength: attempts.length,
      isMentalMath,
      timeSpentSeconds,
      hasSubmitted: hasSubmittedRef.current,
    });

    // Wait for user to be loaded before submitting
    if (!user) {
      console.log('User not loaded yet, waiting...');
      return;
    }

    if (attempts.length === 0) {
      console.log('No attempts to submit');
      return;
    }

    hasSubmittedRef.current = true;

    // For Mental Math, just save stats (accuracy, duration)
    if (isMentalMath) {
      console.log('Calling submitMentalMathStats...');
      submitMentalMathStats(attempts, timeSpentSeconds).catch((err) => {
        console.error('Error in submitMentalMathStats:', err);
        hasSubmittedRef.current = false; // Reset on error so user can retry
      });
    } else {
      // Regular quiz - questions should already exist in database
      submitAttempts.mutate({
        attempts,
        userId: user.id,
        questions: questions.map((q: Question) => ({ id: q.id, difficulty: q.difficulty })),
      }, {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Progress saved!',
          });
        },
        onError: (error: any) => {
          console.error('Error submitting attempts:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to save progress: ' + (error.message || 'Unknown error'),
          });
        },
      });
    }
  }, [user, attempts.length, isMentalMath, timeSpentSeconds]); // Re-run when user is loaded

  const submitMentalMathStats = async (attempts: QuizAnswer[], durationSeconds: number) => {
    if (!user || attempts.length === 0) {
      console.warn('Missing data for Mental Math stats submission', { user: !!user, attempts: attempts.length });
      return;
    }

    try {
      // Calculate statistics - count unique questions since attempts are replaced
      const uniqueQuestionIds = Array.from(new Set(attempts.map(a => a.questionId)));
      const totalQuestions = uniqueQuestionIds.length;
      const correctCount = uniqueQuestionIds.filter(qId => {
        const attempt = attempts.find(a => a.questionId === qId);
        return attempt?.isCorrect === true;
      }).length;

      // Get duration from config (MentalMathConfig)
      const mentalMathConfig = config as any;
      const sessionDuration = mentalMathConfig?.durationSeconds || durationSeconds;

      console.log('=== Saving Mental Math session ===');
      console.log('Data:', {
        userId: user.id,
        durationSeconds: sessionDuration,
        correctCount,
        totalQuestions,
        config: mentalMathConfig,
        timeSpentSeconds,
      });

      // Save session to mental_math_sessions table
      const insertData = {
        user_id: user.id,
        duration_seconds: sessionDuration,
        correct_count: correctCount,
        total_questions: totalQuestions,
      };

      console.log('Insert data:', insertData);

      const { data: sessionData, error: sessionError } = await supabase
        .from('mental_math_sessions')
        .insert(insertData)
        .select();

      console.log('Insert result:', { sessionData, sessionError });

      if (sessionError) {
        console.error('❌ Error saving Mental Math session:', sessionError);
        console.error('Error details:', {
          code: sessionError.code,
          message: sessionError.message,
          details: sessionError.details,
          hint: sessionError.hint,
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save session: ' + sessionError.message,
        });
        hasSubmittedRef.current = false; // Reset to allow retry
        return;
      }

      if (!sessionData || sessionData.length === 0) {
        console.error('❌ No data returned from insert, but no error either');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Session not saved (no data returned)',
        });
        hasSubmittedRef.current = false; // Reset to allow retry
        return;
      }

      console.log('✅ Mental Math session saved successfully:', sessionData);
      
      // Verify the session was actually saved by querying it back
      const { data: verifyData, error: verifyError } = await supabase
        .from('mental_math_sessions')
        .select('*')
        .eq('id', sessionData[0].id)
        .single();
      
      if (verifyError) {
        console.error('❌ Verification failed - session not found after insert:', verifyError);
      } else {
        console.log('✅ Verification successful - session exists:', verifyData);
      }

      // Calculate points based on performance
      const accuracyRate = totalQuestions > 0 ? correctCount / totalQuestions : 0;
      const basePoints = correctCount;
      const accuracyMultiplier = accuracyRate;
      const speedMultiplier = Math.min(1.5, 1 + (60 / durationSeconds));
      const totalPoints = Math.round(basePoints * accuracyMultiplier * speedMultiplier);

      // Update leaderboard score
      const { error: leaderboardError } = await supabase.rpc('increment_leaderboard_points', {
        user_id_param: user.id,
        points_to_add: totalPoints,
      });

      if (leaderboardError) {
        console.error('Error updating leaderboard:', leaderboardError);
        // Don't block the success message if leaderboard update fails
        // The session is already saved
      }

      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['userRank'] });
      queryClient.invalidateQueries({ queryKey: ['mentalMathSessions'] });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Session saved! +${totalPoints} points`,
      });
    } catch (error: any) {
      console.error('Error submitting Mental Math stats:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save stats: ' + (error.message || 'Unknown error'),
      });
    }
  };

  const handleRetry = () => {
    navigation.navigate('PracticeSetup', { topic: config.topic });
  };

  const handleBackToHome = () => {
    navigation.navigate('Training');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            {isMentalMath ? 'Game Over!' : 'Quiz Complete!'}
          </Typography>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.scoreContainer}>
            <Typography variant="h1" color={colors.primary} style={styles.score}>
              {actualCorrectCount}/{actualTotalQuestions}
            </Typography>
            <Typography variant="h3" color={colors.textSecondary}>
              {percentage}% Correct
            </Typography>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Typography variant="caption" color={colors.textTertiary}>
                {isMentalMath ? 'Duration' : 'Time Spent'}
              </Typography>
              <Typography variant="bodyBold" color={colors.text}>
                {timeSpentSeconds}s
              </Typography>
            </View>
            {isMentalMath && (
              <>
                <View style={styles.statItem}>
                  <Typography variant="caption" color={colors.textTertiary}>
                    Questions
                  </Typography>
                  <Typography variant="bodyBold" color={colors.text}>
                    {actualTotalQuestions}
                  </Typography>
                </View>
                <View style={styles.statItem}>
                  <Typography variant="caption" color={colors.textTertiary}>
                    Best Streak
                  </Typography>
                  <Typography variant="bodyBold" color={colors.primary}>
                    {bestStreak}
                  </Typography>
                </View>
              </>
            )}
          </View>
        </Card>

        {questions.length > 0 && (
          <View style={styles.resultsSection}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Question Review
            </Typography>
            {questions.map((question: Question, index: number) => {
            const attempt = attempts[index];
            const isCorrect = attempt?.isCorrect || false;

            return (
              <Card key={question.id} style={styles.questionReviewCard}>
                <View style={styles.questionReviewHeader}>
                  <Typography variant="bodyBold" color={colors.text}>
                    Question {index + 1}
                  </Typography>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: isCorrect ? colors.correct : colors.incorrect },
                    ]}
                  >
                    <Typography variant="captionBold" color={colors.background}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Typography>
                  </View>
                </View>

                <Typography variant="body" color={colors.textSecondary} style={styles.questionText}>
                  {question.statement}
                </Typography>

                <View style={styles.answerSection}>
                  <View style={styles.answerRow}>
                    <Typography variant="captionBold" color={colors.textTertiary}>
                      Your Answer:
                    </Typography>
                    <Typography variant="body" color={colors.text}>
                      {String(attempt?.answer || 'N/A')}
                    </Typography>
                  </View>
                  <View style={styles.answerRow}>
                    <Typography variant="captionBold" color={colors.textTertiary}>
                      Correct Answer:
                    </Typography>
                    <Typography variant="body" color={colors.correct}>
                      {String(question.answer)}
                    </Typography>
                  </View>
                </View>

                {question.explanation && (
                  <View style={styles.explanation}>
                    <Typography variant="captionBold" color={colors.textTertiary}>
                      Explanation:
                    </Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                      {question.explanation}
                    </Typography>
                  </View>
                )}
              </Card>
            );
          })}
          </View>
        )}

        <View style={styles.actions}>
          {!isMentalMath && (
            <Button
              title="Retry Similar Quiz"
              onPress={handleRetry}
              variant="secondary"
              size="large"
              fullWidth
              style={styles.button}
            />
          )}
          <Button
            title={isMentalMath ? "Play Again" : "Back to Home"}
            onPress={isMentalMath ? handleRetry : handleBackToHome}
            variant={isMentalMath ? "secondary" : "primary"}
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
  summaryCard: {
    marginBottom: 32,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  score: {
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  resultsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  questionReviewCard: {
    marginBottom: 16,
    gap: 12,
  },
  questionReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionText: {
    marginTop: 8,
  },
  answerSection: {
    marginTop: 12,
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  explanation: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  actions: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});

