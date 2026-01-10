import { useState, useCallback, useRef } from 'react';
import { Question, Topic, MentalMathOperation } from '../types';
import { supabase } from '../services/supabaseClient';
import { generateMentalMathQuestion } from '../utils/mentalMath';

const BATCH_SIZE = 15;
const PRELOAD_THRESHOLD = 4; // Preload next batch when this many questions remain

// Uniform distribution: 25% each (mental_math, probability, brainteaser, derivatives)
const TOPIC_WEIGHTS: Array<{ topic: Topic; weight: number }> = [
  { topic: 'mental_math', weight: 0.25 },
  { topic: 'probability', weight: 0.25 },
  { topic: 'brainteaser', weight: 0.25 },
  { topic: 'derivatives', weight: 0.25 },
];

// Mental Math default config
const DEFAULT_MENTAL_MATH_CONFIG = {
  operations: ['addition', 'subtraction', 'multiplication', 'division'] as MentalMathOperation[],
  ranges: {
    addSub: { minA: 2, maxA: 100, minB: 2, maxB: 100 },
    multDiv: { minA: 2, maxA: 12, minB: 2, maxB: 100 },
  },
};

/**
 * Select a topic based on uniform distribution (25% each)
 */
const selectTopic = (): Topic => {
  const random = Math.random();
  let cumulative = 0;
  
  for (const { topic, weight } of TOPIC_WEIGHTS) {
    cumulative += weight;
    if (random <= cumulative) {
      return topic;
    }
  }
  
  // Fallback to mental math
  return 'mental_math';
};

/**
 * Generate a batch of questions with weighted distribution
 */
const generateBatch = async (batchSize: number): Promise<Question[]> => {
  const questions: Question[] = [];
  const topicCounts: Record<Topic, number> = { 
    mental_math: 0, 
    probability: 0, 
    brainteaser: 0,
    derivatives: 0
  };
  
  // Determine how many questions per topic based on uniform distribution
  for (let i = 0; i < batchSize; i++) {
    const topic = selectTopic();
    topicCounts[topic]++;
  }
  
  // Generate Mental Math questions
  for (let i = 0; i < topicCounts.mental_math; i++) {
    const question = generateMentalMathQuestion(
      DEFAULT_MENTAL_MATH_CONFIG.operations,
      DEFAULT_MENTAL_MATH_CONFIG.ranges.addSub,
      DEFAULT_MENTAL_MATH_CONFIG.ranges.multDiv
    );
    questions.push(question);
  }
  
  // Fetch Probability questions (only MCQ, difficulty 2-5: medium to hard)
  if (topicCounts.probability > 0) {
    const { data: probData } = await supabase
      .from('questions')
      .select('*')
      .eq('topic', 'probability')
      .eq('type', 'mcq')
      .gte('difficulty', 2)
      .lte('difficulty', 5)
      .limit(500); // Fetch more questions to improve randomization
    
    if (probData && probData.length > 0) {
      // Shuffle using Fisher-Yates
      const shuffled = [...probData];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      questions.push(...(shuffled.slice(0, topicCounts.probability) as Question[]));
    }
  }
  
  // Fetch Brainteaser questions (random difficulty)
  if (topicCounts.brainteaser > 0) {
    const { data: brainData } = await supabase
      .from('questions')
      .select('*')
      .eq('topic', 'brainteaser')
      .limit(500); // Fetch more questions to improve randomization
    
    if (brainData && brainData.length > 0) {
      // Shuffle using Fisher-Yates
      const shuffled = [...brainData];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      questions.push(...(shuffled.slice(0, topicCounts.brainteaser) as Question[]));
    }
  }
  
  // Fetch Derivatives questions (random difficulty)
  if (topicCounts.derivatives > 0) {
    const { data: derivData } = await supabase
      .from('questions')
      .select('*')
      .eq('topic', 'derivatives')
      .limit(500); // Fetch more questions to improve randomization
    
    if (derivData && derivData.length > 0) {
      // Shuffle using Fisher-Yates
      const shuffled = [...derivData];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      questions.push(...(shuffled.slice(0, topicCounts.derivatives) as Question[]));
    }
  }
  
  // Shuffle final batch to mix topics
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  
  return questions;
};

export const useInfiniteQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLoadingBatchRef = useRef(false);
  
  // Load initial batch
  const loadInitialBatch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const batch = await generateBatch(BATCH_SIZE);
      setQuestions(batch);
      setCurrentIndex(0);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading initial batch:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load next batch and append to questions
  const loadNextBatch = useCallback(async () => {
    if (isLoadingBatchRef.current) return;
    
    try {
      isLoadingBatchRef.current = true;
      const batch = await generateBatch(BATCH_SIZE);
      setQuestions(prev => [...prev, ...batch]);
    } catch (err) {
      console.error('Error loading next batch:', err);
      // Don't set error state, just log - user can continue with existing questions
    } finally {
      isLoadingBatchRef.current = false;
    }
  }, []);
  
  
  // Move to next question
  const nextQuestion = useCallback(() => {
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      // Check if we need to preload after updating index
      setTimeout(() => {
        const remaining = questions.length - newIndex;
        if (remaining <= PRELOAD_THRESHOLD && !isLoadingBatchRef.current) {
          loadNextBatch();
        }
      }, 0);
      return newIndex;
    });
  }, [questions.length, loadNextBatch]);
  
  // Get current question
  const currentQuestion = questions[currentIndex] || null;
  
  // Check if there are more questions (always true for infinite scroll, but useful for UI)
  const hasMore = true; // Always true for infinite scroll
  
  return {
    questions,
    currentQuestion,
    currentIndex,
    loading,
    error,
    hasMore,
    loadInitialBatch,
    nextQuestion,
    reset: () => {
      setQuestions([]);
      setCurrentIndex(0);
      loadInitialBatch();
    },
  };
};

