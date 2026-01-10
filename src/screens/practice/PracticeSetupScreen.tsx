import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { TrainingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { Topic, Difficulty, MentalMathOperation, MentalMathConfig } from '../../types';
import { topicLabels } from '../../utils/topic';
import { useQuestions } from '../../hooks/useQuestions';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'PracticeSetup'>;
type PracticeSetupRouteProp = RouteProp<TrainingStackParamList, 'PracticeSetup'>;

export const PracticeSetupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PracticeSetupRouteProp>();
  const initialTopic = route.params?.topic;

  const [topic, setTopic] = useState<Topic | undefined>(initialTopic);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy'); // Changed to 'easy' to match questions with difficulty=1
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);

  // Mental Math specific state
  const [operations, setOperations] = useState<MentalMathOperation[]>(['addition', 'subtraction', 'multiplication', 'division']);
  const [durationSeconds, setDurationSeconds] = useState(120);
  const [addSubRange, setAddSubRange] = useState({ minA: 2, maxA: 100, minB: 2, maxB: 100 });
  const [multDivRange, setMultDivRange] = useState({ minA: 2, maxA: 12, minB: 2, maxB: 100 });

  const { refetch, isFetching } = useQuestions({
    topic,
    difficulty,
    limit: numberOfQuestions,
    enabled: false,
  });

  // Set topic from route params on mount
  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  const toggleOperation = (op: MentalMathOperation) => {
    setOperations((prev) =>
      prev.includes(op) ? prev.filter((o) => o !== op) : [...prev, op]
    );
  };

  const handleStart = async () => {
    if (!topic) {
      Alert.alert('Error', 'Please select a topic');
      return;
    }

    // Mental Math uses different config
    if (topic === 'mental_math') {
      if (operations.length === 0) {
        Alert.alert('Error', 'Please select at least one operation');
        return;
      }

      const mentalMathConfig: MentalMathConfig = {
        topic: 'mental_math',
        mode: 'timed_infinite',
        operations,
        ranges: {
          addSub: addSubRange,
          multDiv: multDivRange,
        },
        durationSeconds,
      };

      navigation.navigate('Quiz', {
        questions: [], // Will be generated dynamically
        config: mentalMathConfig,
        isMentalMath: true,
      });
      return;
    }

    // Regular quiz flow
    try {
      const { data: questions, error } = await refetch();

      if (error) {
        console.error('Error fetching questions:', error);
        Alert.alert(
          'Error',
          `Failed to load questions: ${error.message || 'Unknown error'}`
        );
        return;
      }

      if (!questions || questions.length === 0) {
        Alert.alert(
          'No Questions Found',
          `No questions found for ${topicLabels[topic]} with ${difficulty} difficulty. Please try a different difficulty or topic.`
        );
        return;
      }

      navigation.navigate('Quiz', {
        questions,
        config: {
          topic,
          difficulty,
          numberOfQuestions,
        },
        isMentalMath: false,
      });
    } catch (err) {
      console.error('Exception fetching questions:', err);
      Alert.alert(
        'Error',
        `An error occurred while loading questions: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  };

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const questionCounts = [5, 10, 20];
  const durationOptions = [60, 120, 180];
  const operationLabels: Record<MentalMathOperation, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
  };

  const isMentalMath = topic === 'mental_math';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            Practice Setup
          </Typography>
        </View>

        <Card style={styles.card}>
          {/* Topic display - not editable if passed from Home */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Topic
            </Typography>
            {initialTopic ? (
              <View style={styles.topicLabel}>
                <Typography variant="bodyBold" color={colors.primary}>
                  {topicLabels[initialTopic]}
                </Typography>
              </View>
            ) : (
              <View style={styles.optionsGrid}>
                {(['mental_math', 'probability', 'brainteaser', 'derivatives'] as Topic[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.option,
                      topic === t && styles.optionSelected,
                      { borderColor: topic === t ? colors.primary : colors.border },
                    ]}
                    onPress={() => setTopic(t)}
                  >
                    <Typography
                      variant="bodyBold"
                      color={topic === t ? colors.primary : colors.text}
                    >
                      {topicLabels[t]}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {isMentalMath ? (
            <>
              {/* Mental Math Operations */}
              <View style={styles.section}>
                <Typography variant="h3" style={styles.sectionTitle}>
                  Operations
                </Typography>
                <View style={styles.optionsGrid}>
                  {(['addition', 'subtraction', 'multiplication', 'division'] as MentalMathOperation[]).map((op) => (
                    <TouchableOpacity
                      key={op}
                      style={[
                        styles.option,
                        operations.includes(op) && styles.optionSelected,
                        { borderColor: operations.includes(op) ? colors.primary : colors.border },
                      ]}
                      onPress={() => toggleOperation(op)}
                    >
                      <Typography
                        variant="bodyBold"
                        color={operations.includes(op) ? colors.primary : colors.text}
                      >
                        {operationLabels[op]}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Ranges - simplified shared display */}
              <View style={styles.section}>
                <Typography variant="h3" style={styles.sectionTitle}>
                  Ranges
                </Typography>
                <View style={styles.rangeInfo}>
                  <Typography variant="body" color={colors.textSecondary}>
                    Addition/Subtraction: {addSubRange.minA}-{addSubRange.maxA} × {addSubRange.minB}-{addSubRange.maxB}
                  </Typography>
                  <Typography variant="body" color={colors.textSecondary}>
                    Multiplication/Division: {multDivRange.minA}-{multDivRange.maxA} × {multDivRange.minB}-{multDivRange.maxB}
                  </Typography>
                </View>
              </View>

              {/* Duration */}
              <View style={styles.section}>
                <Typography variant="h3" style={styles.sectionTitle}>
                  Duration
                </Typography>
                <View style={styles.optionsRow}>
                  {durationOptions.map((dur) => (
                    <TouchableOpacity
                      key={dur}
                      style={[
                        styles.option,
                        styles.optionSmall,
                        durationSeconds === dur && styles.optionSelected,
                        { borderColor: durationSeconds === dur ? colors.primary : colors.border },
                      ]}
                      onPress={() => setDurationSeconds(dur)}
                    >
                      <Typography
                        variant="bodyBold"
                        color={durationSeconds === dur ? colors.primary : colors.text}
                      >
                        {dur}s
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Difficulty */}
              <View style={styles.section}>
                <Typography variant="h3" style={styles.sectionTitle}>
                  Difficulty
                </Typography>
                <View style={styles.optionsRow}>
                  {difficulties.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.option,
                        styles.optionSmall,
                        difficulty === d && styles.optionSelected,
                        { borderColor: difficulty === d ? colors.primary : colors.border },
                      ]}
                      onPress={() => setDifficulty(d)}
                    >
                      <Typography
                        variant="bodyBold"
                        color={difficulty === d ? colors.primary : colors.text}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Number of Questions */}
              <View style={styles.section}>
                <Typography variant="h3" style={styles.sectionTitle}>
                  Number of Questions
                </Typography>
                <View style={styles.optionsRow}>
                  {questionCounts.map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[
                        styles.option,
                        styles.optionSmall,
                        numberOfQuestions === count && styles.optionSelected,
                        { borderColor: numberOfQuestions === count ? colors.primary : colors.border },
                      ]}
                      onPress={() => setNumberOfQuestions(count)}
                    >
                      <Typography
                        variant="bodyBold"
                        color={numberOfQuestions === count ? colors.primary : colors.text}
                      >
                        {count}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          <Button
            title={isMentalMath ? 'Start Game' : 'Start Practice'}
            onPress={handleStart}
            variant="primary"
            size="large"
            fullWidth
            disabled={!topic || (isMentalMath && operations.length === 0)}
            loading={isFetching && !isMentalMath}
            style={styles.startButton}
          />
        </Card>

        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
          fullWidth
        />
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
  },
  header: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  topicLabel: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSmall: {
    flex: 1,
    minWidth: 0,
  },
  optionSelected: {
    backgroundColor: colors.surface,
  },
  rangeInfo: {
    gap: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
  },
  startButton: {
    marginTop: 8,
  },
});
