import type { NavigatorScreenParams } from '@react-navigation/native';
import { Topic, Difficulty, MarketMakingScenario, SpreadType } from '../types';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type HomeStackParamList = {
  Home: undefined; // Infinite quiz screen
};

export type TrainingStackParamList = {
  Training: undefined;
  PracticeSetup: { topic?: Topic } | undefined;
  Quiz: { 
    questions: any[]; 
    config: any; 
    isMentalMath?: boolean;
  };
  QuizResult: { attempts: any[]; questions: any[]; config: any; timeSpent: number; isMentalMath?: boolean };
  // Mental Math new screens
  MentalMathMode: undefined;
  MentalMathTraining: undefined;
  MentalMathCours: undefined;
  MentalMathQuiz: {
    mode: 'easy' | 'hard' | 'cours';
    durationSeconds: number;
    operations?: string[];
    methodIds?: string[];
  };
  // Market Making screens
  MarketMakingSetup: undefined;
  MarketMakingGame: {
    scenario: MarketMakingScenario;
    spreadType: SpreadType;
  };
};

export type ArenaStackParamList = {
  ArenaHome: undefined;
  MockBattle: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  MentalMathStats: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  TrainingTab: NavigatorScreenParams<TrainingStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

