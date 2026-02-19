import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { TrainingStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { Question, QuizAnswer, MentalMathConfig } from '../../types';
import { generateMentalMathQuestion } from '../../utils/mentalMath';
import { useAuth } from '../../hooks/useAuth';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'Quiz'>;
type QuizRouteProp = RouteProp<TrainingStackParamList, 'Quiz'>;

export const QuizScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<QuizRouteProp>();
  const { user } = useAuth();
  const { questions: initialQuestions, config, isMentalMath = false } = route.params;
  
  const mentalMathConfig = isMentalMath ? (config as MentalMathConfig) : null;

  // State
  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const [startTime] = useState(Date.now());
  const questionStartTime = useRef(Date.now());
  const isSubmitting = useRef(false);
  const autoAdvanceTimeout = useRef<NodeJS.Timeout | null>(null);
  const textInputRef = useRef<TextInput>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const answersRef = useRef<QuizAnswer[]>([]); // Keep latest answers in ref for timer callback
  const questionsRef = useRef<Question[]>([]); // Keep latest questions in ref for timer callback
  const currentQuestionRef = useRef<Question | null>(null); // Keep current question in ref
  
  // Mental Math timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(
    mentalMathConfig ? mentalMathConfig.durationSeconds : 0
  );
  const [gameEnded, setGameEnded] = useState(false);

  // Initialize first question
  useEffect(() => {
    if (isMentalMath && mentalMathConfig) {
      // Generate first Mental Math question
      const firstQuestion = generateMentalMathQuestion(
        mentalMathConfig.operations,
        mentalMathConfig.ranges.addSub,
        mentalMathConfig.ranges.multDiv
      );
      setCurrentQuestion(firstQuestion);
      questionStartTime.current = Date.now();
      answersRef.current = []; // Initialize ref
      
      // Start timer
      const startTimeMs = Date.now();
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeMs) / 1000);
        const remaining = Math.max(0, mentalMathConfig.durationSeconds - elapsed);
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          endMentalMathGame();
        }
      }, 100);
    } else {
      // Regular quiz mode
      if (initialQuestions && initialQuestions.length > 0) {
        setCurrentQuestion(initialQuestions[0]);
        questionStartTime.current = Date.now();
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Focus input when question changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'numeric' && textInputRef.current) {
      // Small delay to ensure input is mounted
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

  const endMentalMathGame = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setGameEnded(true);
    Keyboard.dismiss();
    
    const totalTime = Date.now() - startTime;
    // Use refs to get latest values (closure issue fix)
    const latestAnswers = answersRef.current;
    const latestQuestions = questionsRef.current;
    const latestCurrentQuestion = currentQuestionRef.current;
    
    // Ensure we have all questions that were answered
    const allQuestions = [...latestQuestions];
    // Add current question if not already in the list
    if (latestCurrentQuestion && !allQuestions.find(q => q.id === latestCurrentQuestion.id)) {
      allQuestions.push(latestCurrentQuestion);
    }
    
    // Debug: log attempts before navigation
    console.log('Ending Mental Math game:', {
      totalAttempts: latestAnswers.length,
      attempts: latestAnswers.map(a => ({ questionId: a.questionId, isCorrect: a.isCorrect, answer: a.answer })),
      uniqueQuestions: Array.from(new Set(latestAnswers.map(a => a.questionId))).length,
      correctCount: latestAnswers.filter(a => a.isCorrect).length,
    });
    
    navigation.replace('QuizResult', {
      attempts: latestAnswers,
      questions: allQuestions,
      config,
      timeSpent: totalTime,
      isMentalMath: true,
    });
  };

  const handleBackPress = () => {
    Alert.alert(
      'Quit practice?',
      'You will lose your current progress.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Quit',
          style: 'destructive',
          onPress: () => {
            // Stop timer if running
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            // Clear timeouts
            if (autoAdvanceTimeout.current) {
              clearTimeout(autoAdvanceTimeout.current);
              autoAdvanceTimeout.current = null;
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
    
    if (question.type === 'mcq') {
      return userAnswer === correctAnswer;
    } else if (question.type === 'numeric') {
      const parsedUser = parseNumericAnswer(userAnswer);
      const parsedCorrect = parseNumericAnswer(correctAnswer);
      
      if (parsedUser === null || parsedCorrect === null) {
        if (isMentalMath) {
          console.log('Parse error:', { userAnswer, correctAnswer, parsedUser, parsedCorrect });
        }
        return false;
      }
      
      const isCorrect = Math.abs(parsedUser - parsedCorrect) < 0.0001;
      if (isMentalMath) {
        console.log('Answer comparison:', { 
          parsedUser, 
          parsedCorrect, 
          diff: Math.abs(parsedUser - parsedCorrect),
          isCorrect 
        });
      }
      return isCorrect;
    } else {
      return String(userAnswer).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
    }
  };

  const handleAnswer = (answerOverride?: string | number) => {
    if (isSubmitting.current || !currentQuestion || gameEnded) {
      return;
    }

    const answerToCheck = answerOverride !== undefined ? answerOverride : selectedAnswer;

    // Allow empty answers - they will be marked as incorrect
    // Removed the early return to allow Next button to work

    // Clear any pending auto-advance timeout
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }

    isSubmitting.current = true;

    const timeSpent = Date.now() - questionStartTime.current;
    const isCorrect = checkAnswer(answerToCheck, currentQuestion);

    // Debug log for Mental Math
    if (isMentalMath) {
      console.log('Mental Math answer check:', {
        userAnswer: answerToCheck,
        correctAnswer: currentQuestion.answer,
        isCorrect,
        questionId: currentQuestion.id,
      });
    }

    // Store the parsed answer for numeric questions
    let answerToStore: string | number = answerToCheck;
    if (currentQuestion.type === 'numeric') {
      const parsed = parseNumericAnswer(answerToCheck);
      answerToStore = parsed !== null ? parsed : answerToCheck;
    }

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: answerToStore,
      timeSpentMs: timeSpent,
      isCorrect,
    };

    // Note: For Mental Math, we no longer save individual attempts
    // We only save a session summary at the end of the game in QuizResultScreen

    let newAnswers: QuizAnswer[];
    if (isMentalMath) {
      // For Mental Math, replace previous attempt for the same question if it exists
      // This handles the case where user gives wrong answer then retries
      const existingAttemptIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
      if (existingAttemptIndex >= 0) {
        // Replace the previous attempt
        newAnswers = [...answers];
        newAnswers[existingAttemptIndex] = answer;
        console.log('Replaced attempt for question:', currentQuestion.id, 'isCorrect:', isCorrect);
      } else {
        // New attempt
        newAnswers = [...answers, answer];
        console.log('Added new attempt for question:', currentQuestion.id, 'isCorrect:', isCorrect);
      }
    } else {
      newAnswers = [...answers, answer];
    }

    if (isMentalMath && mentalMathConfig) {
      // Mental Math mode: always generate next question immediately if correct
      setAnswers(newAnswers);
      
      // Make sure current question is in the questions array
      setQuestions((prev) => {
        if (currentQuestion && !prev.find(q => q.id === currentQuestion.id)) {
          return [...prev, currentQuestion];
        }
        return prev;
      });
      
      if (isCorrect && !gameEnded && timeRemaining > 0) {
        // Generate next question immediately
        const nextQuestion = generateMentalMathQuestion(
          mentalMathConfig.operations,
          mentalMathConfig.ranges.addSub,
          mentalMathConfig.ranges.multDiv
        );
        
        setQuestions((prev) => [...prev, nextQuestion]);
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer('');
        questionStartTime.current = Date.now();
        isSubmitting.current = false;
        
        // Focus input for next question
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 50);
      } else {
        // Wrong answer or time ended - allow retry or wait for timer
        setSelectedAnswer('');
        isSubmitting.current = false;
        if (!gameEnded && timeRemaining > 0) {
          // Focus input to try again
          setTimeout(() => {
            textInputRef.current?.focus();
          }, 50);
        }
      }
    } else {
      // Regular quiz mode
      const newIndex = currentIndex + 1;
      setAnswers(newAnswers);

      setTimeout(() => {
        if (newIndex >= initialQuestions.length) {
          // Navigate to results
          const totalTime = Date.now() - startTime;
          navigation.replace('QuizResult', {
            attempts: newAnswers,
            questions: initialQuestions,
            config,
            timeSpent: totalTime,
            isMentalMath: false,
          });
        } else {
          setCurrentIndex(newIndex);
          setCurrentQuestion(initialQuestions[newIndex]);
          setSelectedAnswer('');
          questionStartTime.current = Date.now();
          isSubmitting.current = false;
          
          // Focus input for next question
          setTimeout(() => {
            textInputRef.current?.focus();
          }, 50);
        }
      }, 100);
    }
  };

  const handleMCQSelect = (choiceId: string) => {
    setSelectedAnswer(choiceId);
  };

  const handleNumericInputChange = (text: string) => {
    setSelectedAnswer(text);

    // Clear any existing auto-advance timeout
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }

    // Auto-advance for correct answers
    if (text && currentQuestion && currentQuestion.type === 'numeric' && !isSubmitting.current && !gameEnded) {
      const delay = isMentalMath ? 300 : 500; // Faster for Mental Math
      
      autoAdvanceTimeout.current = setTimeout(() => {
        if (!isSubmitting.current && currentQuestion && !gameEnded) {
          const isCorrect = checkAnswer(text, currentQuestion);
          
          if (isCorrect) {
            handleAnswer(text);
          }
        }
        autoAdvanceTimeout.current = null;
      }, delay);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    if (currentQuestion.type === 'mcq' && currentQuestion.choices) {
      return (
        <View style={styles.choicesContainer}>
          {currentQuestion.choices.map((choice: { id: string; label: string }) => (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceButton,
                selectedAnswer === choice.id && styles.choiceButtonSelected,
              ]}
              onPress={() => handleMCQSelect(choice.id)}
            >
              <Typography
                variant="body"
                color={selectedAnswer === choice.id ? colors.background : colors.text}
              >
                {choice.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Enter your answer"
          placeholderTextColor={colors.textTertiary}
          value={typeof selectedAnswer === 'string' ? selectedAnswer : selectedAnswer.toString()}
          onChangeText={(text) => {
            if (currentQuestion.type === 'numeric') {
              handleNumericInputChange(text);
            } else {
              setSelectedAnswer(text);
            }
          }}
          keyboardType={currentQuestion.type === 'numeric' ? 'decimal-pad' : 'default'}
          autoFocus
          returnKeyType="next"
          editable={!gameEnded}
          onSubmitEditing={() => {
            if ((selectedAnswer !== '' || currentQuestion.type === 'free_text') && !gameEnded) {
              handleAnswer();
            }
          }}
        />
      );
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

  const isLastQuestion = !isMentalMath && currentIndex === initialQuestions.length - 1;
  const totalQuestions = isMentalMath ? answers.length : initialQuestions.length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Typography variant="bodyBold" color={colors.primary}>
            ← Back
          </Typography>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          {isMentalMath ? (
            <>
              <Typography variant="caption" color={colors.textSecondary}>
                Questions: {answers.length}
              </Typography>
              <Typography variant="h3" color={timeRemaining <= 10 ? colors.incorrect : colors.primary}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Typography>
            </>
          ) : (
            <Typography variant="caption" color={colors.textSecondary}>
              Question {currentIndex + 1} of {initialQuestions.length}
            </Typography>
          )}
        </View>
        
        {!isMentalMath && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / initialQuestions.length) * 100}%` },
              ]}
            />
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.questionCard}>
            <Typography variant="h3" style={styles.questionText}>
              {currentQuestion.statement}
            </Typography>
          </Card>

          <View style={styles.answerSection}>
            {renderQuestionInput()}
          </View>

          {!isMentalMath && (
            <View style={styles.actionButtons}>
              <Button
                title={isLastQuestion ? 'Finish' : 'Next'}
                onPress={() => {
                  // Allow Next even without answer (will mark as incorrect)
                  if (selectedAnswer === '' && currentQuestion.type !== 'free_text') {
                    // Mark as incorrect and move to next
                    handleAnswer('');
                  } else {
                    handleAnswer();
                  }
                }}
                variant="primary"
                size="large"
                fullWidth
                disabled={isSubmitting.current}
                loading={isSubmitting.current}
                style={styles.submitButton}
              />
              
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => {
                  // Skip current question (mark as incorrect and move to next)
                  if (!isSubmitting.current && currentQuestion) {
                    handleAnswer('');
                  }
                }}
                disabled={isSubmitting.current}
              >
                <Typography variant="bodyBold" color={colors.textSecondary}>
                  Skip →
                </Typography>
              </TouchableOpacity>
            </View>
          )}
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
  progressBar: {
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  questionCard: {
    marginBottom: 24,
    minHeight: 120,
    justifyContent: 'center',
  },
  questionText: {
    lineHeight: 32,
    textAlign: 'center',
  },
  answerSection: {
    marginBottom: 24,
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  choiceButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
  },
  submitButton: {
    marginTop: 'auto',
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  skipButton: {
    padding: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
  },
});
