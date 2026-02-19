import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { Typography } from '../../components/Typography';
import { colors } from '../../theme/colors';
import { Question } from '../../types';
import { useInfiniteQuestions } from '../../hooks/useInfiniteQuestions';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const InfiniteQuizScreen = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    currentQuestion,
    loading,
    error,
    loadInitialBatch,
    nextQuestion,
  } = useInfiniteQuestions();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const questionStartTime = useRef(Date.now());
  const [isLocked, setIsLocked] = useState(false); // Use state instead of ref for disabled buttons
  const autoAdvanceTimeout = useRef<NodeJS.Timeout | null>(null);
  const mcqSelectTimeout = useRef<NodeJS.Timeout | null>(null); // Track MCQ selection timeout
  const textInputRef = useRef<TextInput>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const currentQuestionRef = useRef<Question | null>(null); // Keep ref in sync for ChatGPT button
  
  // Load initial batch on mount
  useEffect(() => {
    loadInitialBatch();
  }, [loadInitialBatch]);
  
  // Keep ref in sync with current question (for ChatGPT button closure)
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // Reset state and focus input when question changes
  useEffect(() => {
    if (currentQuestion) {
      // Clear ALL pending timeouts
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
        autoAdvanceTimeout.current = null;
      }
      if (mcqSelectTimeout.current) {
        clearTimeout(mcqSelectTimeout.current);
        mcqSelectTimeout.current = null;
      }
      
      // Reset all state
      setSelectedAnswer('');
      setFeedback(null);
      setShowAnswer(false);
      setIsLocked(false);
      questionStartTime.current = Date.now();
      
      // Focus input only for numeric questions
      if (currentQuestion.type === 'numeric' && textInputRef.current) {
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 100);
      }
    }
  }, [currentQuestion]);
  
  // Preload is handled automatically by useInfiniteQuestions hook
  
  const normalizeNumericInput = (input: string): string => {
    return input.trim().replace(',', '.');
  };
  
  // Parse a fraction string like "5/12" to a decimal number
  const parseFraction = (input: string): number | null => {
    const trimmed = input.trim();
    const fractionMatch = trimmed.match(/^(-?\d+)\/(-?\d+)$/);
    if (fractionMatch) {
      const numerator = parseFloat(fractionMatch[1]);
      const denominator = parseFloat(fractionMatch[2]);
      if (denominator === 0 || isNaN(numerator) || isNaN(denominator)) {
        return null;
      }
      return numerator / denominator;
    }
    return null;
  };
  
  // Normalize fraction string (e.g., "5/12" stays "5/12", but also accept "5 / 12")
  const normalizeFraction = (input: string): string => {
    return input.trim().replace(/\s+/g, ''); // Remove spaces
  };
  
  const parseNumericAnswer = (input: string | number): number | null => {
    if (typeof input === 'number') {
      return isNaN(input) ? null : input;
    }
    if (!input || input.trim() === '') {
      return null;
    }
    
    // Try parsing as fraction first
    const normalized = normalizeFraction(String(input));
    const fractionValue = parseFraction(normalized);
    if (fractionValue !== null) {
      return fractionValue;
    }
    
    // Fallback to decimal parsing
    const decimalNormalized = normalizeNumericInput(String(input));
    const parsed = parseFloat(decimalNormalized);
    return isNaN(parsed) ? null : parsed;
  };
  
  const checkAnswer = (userAnswer: string | number, question: Question): boolean => {
    const correctAnswer = question.answer;
    
    if (question.type === 'mcq') {
      return userAnswer === correctAnswer;
    } else if (question.type === 'numeric') {
      // First try exact string comparison (handles fractions like "5/12")
      const userStr = String(userAnswer).trim();
      const correctStr = String(correctAnswer).trim();
      
      // Normalize fractions (remove spaces)
      const normalizedUser = normalizeFraction(userStr);
      const normalizedCorrect = normalizeFraction(correctStr);
      
      if (normalizedUser === normalizedCorrect) {
        return true;
      }
      
      // Try numeric comparison (handles decimals and fraction values)
      const parsedUser = parseNumericAnswer(userAnswer);
      const parsedCorrect = parseNumericAnswer(correctAnswer);
      
      if (parsedUser !== null && parsedCorrect !== null) {
        return Math.abs(parsedUser - parsedCorrect) < 0.0001;
      }
      
      return false;
    } else {
      return String(userAnswer).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
    }
  };
  
  const saveAttempt = async (question: Question, userAnswer: string | number, isCorrect: boolean) => {
    if (!user) return;
    
    try {
      const timeSpent = Date.now() - questionStartTime.current;
      
      // Save attempt to database (background save, no blocking)
      const answerToStore = question.type === 'numeric' 
        ? (parseNumericAnswer(userAnswer) ?? userAnswer)
        : userAnswer;
      
      await supabase.from('question_attempts').insert({
        user_id: user.id,
        question_id: question.id,
        answer_given: typeof answerToStore === 'number' ? answerToStore.toString() : answerToStore,
        time_spent_ms: timeSpent,
        is_correct: isCorrect,
      });
      
      // Update leaderboard if correct (non-blocking)
      if (isCorrect && question.difficulty) {
        // Calculate points based on difficulty (simple: 1 point per correct answer)
        const points = question.difficulty;
        await supabase.rpc('increment_leaderboard_points', {
          user_id_param: user.id,
          points_to_add: points,
        });
        
        // Invalidate queries in background
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['userRank'] });
      }
    } catch (err) {
      // Silent fail - don't block UI
      console.error('Error saving attempt:', err);
    }
  };
  
  const handleAnswer = (answerOverride?: string | number) => {
    if (isLocked || !currentQuestion) {
      return;
    }
    
    const answerToCheck = answerOverride !== undefined ? answerOverride : selectedAnswer;
    
    if (answerToCheck === '' && currentQuestion.type !== 'free_text') {
      return;
    }
    
    // Clear any pending timeouts
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
    if (mcqSelectTimeout.current) {
      clearTimeout(mcqSelectTimeout.current);
      mcqSelectTimeout.current = null;
    }
    
    Keyboard.dismiss();
    
    const isCorrect = checkAnswer(answerToCheck, currentQuestion);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    // Save attempt in background (non-blocking)
    saveAttempt(currentQuestion, answerToCheck, isCorrect).catch((err) => {
      console.error('Error saving attempt:', err);
    });
    
    if (isCorrect) {
      // Lock buttons during auto-advance
      setIsLocked(true);
      // Auto-advance after brief feedback
      autoAdvanceTimeout.current = setTimeout(() => {
        setShowAnswer(false);
        setFeedback(null);
        setIsLocked(false);
        nextQuestion();
      }, 600);
    }
    // If incorrect: buttons stay unlocked (isLocked stays false)
    // User can retry, skip, or view answer
  };
  
  const handleSkip = () => {
    if (!currentQuestion) return;
    
    // Clear ALL pending timeouts
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
    if (mcqSelectTimeout.current) {
      clearTimeout(mcqSelectTimeout.current);
      mcqSelectTimeout.current = null;
    }
    
    // Save as incorrect if user hasn't answered (non-blocking)
    if (!showAnswer && selectedAnswer) {
      saveAttempt(currentQuestion, selectedAnswer, false).catch((err) => {
        console.error('Error saving attempt:', err);
      });
    }
    
    // Reset state immediately
    setFeedback(null);
    setShowAnswer(false);
    setIsLocked(false);
    
    // Move to next question
    nextQuestion();
  };
  
  const handleShowAnswer = () => {
    if (!currentQuestion) return;
    
    // Clear ALL pending timeouts
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
    if (mcqSelectTimeout.current) {
      clearTimeout(mcqSelectTimeout.current);
      mcqSelectTimeout.current = null;
    }
    
    setShowAnswer(true);
    // Save as incorrect when showing answer
    saveAttempt(currentQuestion, selectedAnswer || '', false).catch((err) => {
      console.error('Error saving attempt:', err);
    });
    // Reset state to allow user interaction
    setFeedback('incorrect');
    setIsLocked(false);
  };
  
  const handleMCQSelect = (choiceId: string) => {
    if (isLocked) return;
    
    // Clear previous MCQ timeout if user changed their mind
    if (mcqSelectTimeout.current) {
      clearTimeout(mcqSelectTimeout.current);
      mcqSelectTimeout.current = null;
    }
    
    // Clear previous feedback so the new selection doesn't show as red immediately
    setFeedback(null);
    setSelectedAnswer(choiceId);
    
    // Capture the current question to avoid race conditions
    const questionAtSubmit = currentQuestion;
    
    // Auto-submit MCQ after brief visual feedback
    mcqSelectTimeout.current = setTimeout(() => {
      mcqSelectTimeout.current = null;
      // Only submit if we're still on the same question
      if (currentQuestionRef.current?.id === questionAtSubmit?.id) {
        handleAnswer(choiceId);
      }
    }, 250);
  };
  
  const handleNumericInputChange = (text: string) => {
    // Allow only digits, decimal point, slash, minus, and spaces (for fractions like "7/2" or "5 / 12")
    // Remove any invalid characters
    const filteredText = text.replace(/[^0-9./\-\s]/g, '');
    
    setSelectedAnswer(filteredText);
    setFeedback(null);
    
    // Clear any existing auto-advance timeout
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
    
    // Auto-advance for correct answers
    if (filteredText && currentQuestion && currentQuestion.type === 'numeric' && !isLocked) {
      autoAdvanceTimeout.current = setTimeout(() => {
        if (!isLocked && currentQuestion) {
          const isCorrect = checkAnswer(filteredText, currentQuestion);
          
          if (isCorrect) {
            handleAnswer(filteredText);
          }
        }
        autoAdvanceTimeout.current = null;
      }, 500);
    }
  };
  
  const renderQuestionInput = () => {
    if (!currentQuestion) return null;
    
    if (currentQuestion.type === 'mcq' && currentQuestion.choices) {
      const choiceLabels = ['a', 'b', 'c', 'd', 'e', 'f'];
      return (
        <View style={styles.choicesContainer}>
          {currentQuestion.choices.map((choice: { id: string; label: string }, index: number) => (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceButton,
                selectedAnswer === choice.id && styles.choiceButtonSelected,
                feedback === 'correct' && selectedAnswer === choice.id && styles.choiceButtonCorrect,
                feedback === 'incorrect' && selectedAnswer === choice.id && styles.choiceButtonIncorrect,
              ]}
              onPress={() => handleMCQSelect(choice.id)}
              disabled={isLocked}
            >
              <View style={styles.choiceContent}>
                <Typography variant="bodyBold" color={selectedAnswer === choice.id ? colors.background : colors.primary} style={styles.choiceLabel}>
                  {choiceLabels[index] || String.fromCharCode(97 + index)}.
                </Typography>
                <Typography variant="body" color={selectedAnswer === choice.id ? colors.background : colors.text}>
                  {choice.label}
                </Typography>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (currentQuestion.type === 'numeric') {
      return (
        <View style={styles.numericInputContainer}>
          <TextInput
            ref={textInputRef}
            style={[
              styles.numericInput,
              feedback === 'correct' && styles.inputCorrect,
              feedback === 'incorrect' && styles.inputIncorrect,
            ]}
            placeholder="Enter answer (e.g. 7/2 or 3.5)"
            placeholderTextColor={colors.textTertiary}
            value={String(selectedAnswer)}
            onChangeText={handleNumericInputChange}
            keyboardType="default"
            autoFocus
            editable={!isLocked}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {feedback && (
            <View style={styles.feedbackContainer}>
              <Typography
                variant="bodyBold"
                color={feedback === 'correct' ? colors.correct : colors.incorrect}
              >
                {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
              </Typography>
            </View>
          )}
        </View>
      );
    } else {
      // Free text
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Enter answer"
          placeholderTextColor={colors.textTertiary}
          value={String(selectedAnswer)}
          onChangeText={setSelectedAnswer}
          multiline
          editable={!isLocked}
        />
      );
    }
  };
  
  if (loading && !currentQuestion) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography variant="body" color={colors.textSecondary} style={styles.loadingText}>
            Loading questions...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Typography variant="h3" color={colors.error}>
            Error
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {error.message}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.emptyContainer}>
          <Typography variant="body" color={colors.textSecondary}>
            No questions available
          </Typography>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionContainer}>
            <Card style={styles.questionCard}>
              <Typography variant="body" color={colors.textTertiary} style={styles.questionNumber}>
                Question
              </Typography>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                  const q = currentQuestionRef.current;
                  if (!q) return;
                  await Clipboard.setStringAsync(q.statement);
                  Alert.alert('Copied!', 'Question copied to clipboard.');
                }}
              >
                <Typography variant="h3" color={colors.text} style={styles.questionText}>
                  {currentQuestion.statement}
                </Typography>
              </TouchableOpacity>
            </Card>
            
            <View style={styles.answerSection}>
              {renderQuestionInput()}
              
              {showAnswer && currentQuestion && (
                <View style={styles.answerReveal}>
                  <Typography variant="captionBold" color={colors.textTertiary} style={styles.answerLabel}>
                    Réponse correcte :
                  </Typography>
                  <Typography variant="h3" color={colors.correct} style={styles.correctAnswer}>
                    {String(currentQuestion.answer)}
                  </Typography>
                      {currentQuestion.explanation && (
                    <Typography variant="body" color={colors.textSecondary} style={styles.explanation}>
                      {currentQuestion.explanation}
                    </Typography>
                  )}
                  <TouchableOpacity
                    style={styles.chatgptButton}
                    onPress={async () => {
                      const questionToAsk = currentQuestionRef.current;
                      if (!questionToAsk) return;
                      
                      // Copy question to clipboard
                      await Clipboard.setStringAsync(questionToAsk.statement);
                      
                      // Try to open ChatGPT app, fallback to App Store
                      try {
                        const appUrl = 'chatgpt://';
                        const canOpenApp = await Linking.canOpenURL(appUrl);
                        if (canOpenApp) {
                          await Linking.openURL(appUrl);
                        } else {
                          // App not installed → open App Store page
                          await Linking.openURL('https://apps.apple.com/app/chatgpt/id6448311069');
                        }
                      } catch (err) {
                        console.error('Error opening ChatGPT app:', err);
                      }
                    }}
                  >
                    <Typography variant="captionBold" color={colors.primary}>
                      💬 Ask ChatGPT (copies question)
                    </Typography>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={styles.actionButtons}>
              {!showAnswer && (
                <TouchableOpacity
                  style={styles.showAnswerButton}
                  onPress={handleShowAnswer}
                  disabled={isLocked}
                >
                  <Typography variant="bodyBold" color={colors.primary}>
                    Voir la réponse
                  </Typography>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleSkip}
                disabled={false}
                activeOpacity={0.7}
              >
                <Typography variant="bodyBold" color={colors.primary}>
                  Next →
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
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
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  questionContainer: {
    gap: 24,
  },
  questionCard: {
    padding: 24,
    gap: 16,
  },
  questionNumber: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    lineHeight: 28,
  },
  answerSection: {
    gap: 16,
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  choiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  choiceLabel: {
    minWidth: 24,
  },
  choiceButtonSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  choiceButtonCorrect: {
    backgroundColor: colors.correct + '20',
    borderColor: colors.correct,
  },
  choiceButtonIncorrect: {
    backgroundColor: colors.incorrect + '20',
    borderColor: colors.incorrect,
  },
  numericInputContainer: {
    gap: 12,
  },
  numericInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    fontWeight: '600',
  },
  inputCorrect: {
    borderColor: colors.correct,
    backgroundColor: colors.correct + '10',
  },
  inputIncorrect: {
    borderColor: colors.incorrect,
    backgroundColor: colors.incorrect + '10',
  },
  feedbackContainer: {
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    zIndex: 10,
  },
  showAnswerButton: {
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  nextButton: {
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  skipButton: {
    padding: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  answerReveal: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.correct + '40',
    gap: 8,
  },
  answerLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  correctAnswer: {
    marginTop: 4,
  },
  explanation: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  chatgptButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '40',
    alignItems: 'center',
  },
});

