export type Topic = 'mental_math' | 'probability' | 'brainteaser' | 'derivatives';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionType = 'mcq' | 'numeric' | 'free_text';

export interface Question {
  id: string;
  statement: string;
  topic: Topic;
  difficulty: number; // 1-5
  type: QuestionType;
  choices?: Array<{ id: string; label: string }>;
  answer: string | number | Array<string>;
  explanation: string;
  created_at: string;
  metadata?: {
    type: MentalMathType;
    operator: MentalMathOperation;
    has_gap: boolean;
  };
}

export interface QuestionAttempt {
  id: string;
  user_id: string;
  question_id: string;
  is_correct: boolean;
  answer_given: string | number;
  time_spent_ms: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email?: string;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  points: number;
  rank?: number;
}

export interface PracticeSessionConfig {
  topic: Topic;
  difficulty: Difficulty;
  numberOfQuestions: number;
}

export type MentalMathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface MentalMathRange {
  minA: number;
  maxA: number;
  minB: number;
  maxB: number;
}

export interface MentalMathConfig {
  topic: 'mental_math';
  mode: 'timed_infinite';
  operations: MentalMathOperation[];
  ranges: {
    addSub: MentalMathRange;
    multDiv: MentalMathRange;
  };
  durationSeconds: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number;
  timeSpentMs: number;
  isCorrect: boolean;
}

export type MentalMathType = 'integer' | 'fraction' | 'decimal';

export interface MentalMathAttempt {
  user_id: string;
  type: MentalMathType;
  operator: MentalMathOperation;
  has_gap: boolean;
  time_ms: number;
  is_correct: boolean;
}

export interface MentalMathStatRow {
  type: MentalMathType;
  operator: MentalMathOperation;
  has_gap: boolean;
  user_avg_time: number;            // in seconds
  user_avg_correct_pct: number;     // 0-100
  platform_avg_time: number;        // in seconds
  platform_avg_correct_pct: number; // 0-100
  user_percent_rank: number;        // 0-100
}

export interface MentalMathSession {
  id: string;
  duration_seconds: number;
  correct_count: number;
  total_questions: number;
  created_at: string;
}

// ========================================
// Market Making Types
// ========================================

export interface MarketMakingScenario {
  id: string;
  title: string;
  question: string;
  real_value: number;
  unit: string;
  category: 'fact' | 'guesstimate';
  predefined_spread: number;
}

export type SpreadType = 'predefined' | '5' | '10' | '20';

export interface MarketMakingTrade {
  round: number;
  userBid: number;
  userAsk: number;
  action: 'mine' | 'yours';
  tradePrice: number;
  userSide: 'buy' | 'sell';
}

export type MarketMakingPhase =
  | 'AWAITING_MARKET'
  | 'BLUFF'
  | 'TECHNICAL_POSITION'
  | 'TECHNICAL_PNL'
  | 'GAME_OVER';

export interface GameMessage {
  id: string;
  type: 'system' | 'trader' | 'user_market' | 'result' | 'info';
  text: string;
  highlight?: 'correct' | 'incorrect' | 'warning';
}
