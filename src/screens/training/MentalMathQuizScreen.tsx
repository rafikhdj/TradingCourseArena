import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { TrainingStackParamList } from '../../navigation/types';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { Question, QuizAnswer } from '../../types';
import { 
  generateTrainingQuestion, 
  generateCoursQuestion,
  MentalMathMode,
} from '../../utils/mentalMathGenerators';
import { MethodId } from '../../data/mentalMathMethods';
import { useAuth } from '../../hooks/useAuth';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'MentalMathQuiz'>;
type QuizRouteProp = RouteProp<TrainingStackParamList, 'MentalMathQuiz'>;

export const MentalMathQuizScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<QuizRouteProp>();
  const { user } = useAuth();
  
  const { mode, durationSeconds, operations, methodIds } = route.params;
  const isCours = mode === 'cours';

  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [startTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [gameEnded, setGameEnded] = useState(false);
  
  // Refs
  const questionStartTime = useRef(Date.now());
  const isSubmitting = useRef(false);
  const autoAdvanceTimeout = useRef<NodeJS.Timeout | null>(null);
  const textInputRef = useRef<TextInput>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const answersRef = useRef<QuizAnswer[]>([]);
  const questionsRef = useRef<Question[]>([]);
  const currentQuestionRef = useRef<Question | null>(null);

  // Generate a new question based on mode
  const generateQuestion = (): Question => {
    if (isCours && methodIds) {
      return generateCoursQuestion({ methodIds: methodIds as MethodId[], durationSeconds });
    } else {
      return generateTrainingQuestion({ 
        mode: mode as MentalMathMode, 
        durationSeconds, 
        operations 
      });
    }
  };

  // Initialize first question and timer
  useEffect(() => {
    const firstQuestion = generateQuestion();
    setCurrentQuestion(firstQuestion);
    questionStartTime.current = Date.now();
    answersRef.current = [];
    
    // Start timer
    const startTimeMs = Date.now();
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeMs) / 1000);
      const remaining = Math.max(0, durationSeconds - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        endGame();
      }
    }, 100);
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
    };
  }, []);

  // Focus input when question changes
  useEffect(() => {
    if (currentQuestion && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [currentQuestion]);

  // Keep refs in sync with state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  const endGame = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setGameEnded(true);
    Keyboard.dismiss();
    
    const totalTime = Date.now() - startTime;
    const latestAnswers = answersRef.current;
    const latestQuestions = questionsRef.current;
    const latestCurrentQuestion = currentQuestionRef.current;
    
    // Ensure we have all questions that were answered
    const allQuestions = [...latestQuestions];
    if (latestCurrentQuestion && !allQuestions.find(q => q.id === latestCurrentQuestion.id)) {
      allQuestions.push(latestCurrentQuestion);
    }
    
    navigation.replace('QuizResult', {
      attempts: latestAnswers,
      questions: allQuestions,
      config: { mode, durationSeconds, operations, methodIds },
      timeSpent: totalTime,
      isMentalMath: true,
    });
  };

  const handleBackPress = () => {
    Alert.alert(
      'Quitter ?',
      'Vous allez perdre votre progression.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            if (autoAdvanceTimeout.current) {
              clearTimeout(autoAdvanceTimeout.current);
            }
            Keyboard.dismiss();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const normalizeNumericInput = (input: string): string => {
    return input.trim().replace(',', '.');
  };

  const parseNumericAnswer = (input: string | number): number | null => {
    if (typeof input === 'number') {
      return isNaN(input) ? null : input;
    }
    if (!input || input.trim() === '') {
      return null;
    }
    const normalized = normalizeNumericInput(input);
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? null : parsed;
  };

  const checkAnswer = (userAnswer: string | number, question: Question): boolean => {
    const correctAnswer = question.answer;
    const parsedUser = parseNumericAnswer(userAnswer);
    const parsedCorrect = parseNumericAnswer(correctAnswer);
    
    if (parsedUser === null || parsedCorrect === null) {
      return false;
    }
    
    // Allow small tolerance for decimal answers
    const tolerance = parsedCorrect === 0 ? 0.01 : Math.abs(parsedCorrect) * 0.01;
    return Math.abs(parsedUser - parsedCorrect) <= tolerance;
  };

  const handleAnswer = (answerOverride?: string) => {
    if (isSubmitting.current || !currentQuestion || gameEnded) {
      return;
    }

    const answerToCheck = answerOverride !== undefined ? answerOverride : selectedAnswer;

    if (answerToCheck === '') {
      return;
    }

    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }

    isSubmitting.current = true;

    const timeSpent = Date.now() - questionStartTime.current;
    const isCorrect = checkAnswer(answerToCheck, currentQuestion);

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: answerToCheck,
      timeSpentMs: timeSpent,
      isCorrect,
    };

    // Update answers (replace if already exists for this question)
    let newAnswers: QuizAnswer[];
    const existingIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    if (existingIndex >= 0) {
      newAnswers = [...answers];
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers = [...answers, answer];
    }
    setAnswers(newAnswers);

    // Add current question to questions list
    setQuestions((prev) => {
      if (currentQuestion && !prev.find(q => q.id === currentQuestion.id)) {
        return [...prev, currentQuestion];
      }
      return prev;
    });

    if (isCorrect && !gameEnded && timeRemaining > 0) {
      // Generate next question
      const nextQuestion = generateQuestion();
      setQuestions((prev) => [...prev, nextQuestion]);
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer('');
      questionStartTime.current = Date.now();
      isSubmitting.current = false;
      
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 50);
    } else {
      // Wrong answer - allow retry
      setSelectedAnswer('');
      isSubmitting.current = false;
      if (!gameEnded && timeRemaining > 0) {
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 50);
      }
    }
  };

  const handleInputChange = (text: string) => {
    setSelectedAnswer(text);

    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }

    // Auto-advance for correct answers
    if (text && currentQuestion && !isSubmitting.current && !gameEnded) {
      autoAdvanceTimeout.current = setTimeout(() => {
        if (!isSubmitting.current && currentQuestion && !gameEnded) {
          const isCorrect = checkAnswer(text, currentQuestion);
          if (isCorrect) {
            handleAnswer(text);
          }
        }
        autoAdvanceTimeout.current = null;
      }, 300);
    }
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Typography variant="h3">Loading...</Typography>
        </View>
      </SafeAreaView>
    );
  }

  const getModeLabel = () => {
    if (isCours) return 'Cours';
    return mode === 'easy' ? 'Easy' : 'Hard';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Typography variant="bodyBold" color={colors.primary}>
            ← Back
          </Typography>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Typography variant="caption" color={colors.textSecondary}>
            {getModeLabel()} • Questions: {answers.filter(a => a.isCorrect).length}
          </Typography>
          <Typography variant="h2" color={timeRemaining <= 10 ? colors.incorrect : colors.primary}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </Typography>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          <Card style={styles.questionCard}>
            <Typography variant="h3" style={styles.questionText}>
              {currentQuestion.statement}
            </Typography>
          </Card>

          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            placeholder="Enter your answer"
            placeholderTextColor={colors.textTertiary}
            value={selectedAnswer}
            onChangeText={handleInputChange}
            keyboardType="decimal-pad"
            autoFocus
            returnKeyType="done"
            editable={!gameEnded}
            onSubmitEditing={() => {
              if (selectedAnswer !== '' && !gameEnded) {
                handleAnswer();
              }
            }}
          />

          {/* Skip/Next button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              // Skip to next question (mark current as incorrect)
              if (!isSubmitting.current && currentQuestion && !gameEnded && timeRemaining > 0) {
                const timeSpent = Date.now() - questionStartTime.current;
                const answer: QuizAnswer = {
                  questionId: currentQuestion.id,
                  answer: selectedAnswer || '',
                  timeSpentMs: timeSpent,
                  isCorrect: false,
                };
                
                const newAnswers = [...answers, answer];
                setAnswers(newAnswers);
                
                setQuestions((prev) => {
                  if (currentQuestion && !prev.find(q => q.id === currentQuestion.id)) {
                    return [...prev, currentQuestion];
                  }
                  return prev;
                });
                
                const nextQuestion = generateQuestion();
                setQuestions((prev) => [...prev, nextQuestion]);
                setCurrentQuestion(nextQuestion);
                setSelectedAnswer('');
                questionStartTime.current = Date.now();
                
                setTimeout(() => {
                  textInputRef.current?.focus();
                }, 50);
              }
            }}
          >
            <Typography variant="bodyBold" color={colors.primary}>
              Next →
            </Typography>
          </TouchableOpacity>
        </View>
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  backButton: {
    marginBottom: 8,
  },
  headerInfo: {
    alignItems: 'center',
    gap: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 24,
  },
  questionCard: {
    padding: 32,
    justifyContent: 'center',
    minHeight: 150,
  },
  questionText: {
    lineHeight: 36,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    borderWidth: 2,
    borderColor: colors.border,
    textAlign: 'center',
  },
  nextButton: {
    alignSelf: 'center',
    padding: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
});
