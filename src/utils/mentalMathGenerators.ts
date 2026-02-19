/**
 * Mental Math Question Generators
 * Dedicated generators for each mode and method
 */

import { Question } from '../types';
import { MethodId } from '../data/mentalMathMethods';

// Helper functions
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomDecimal = (min: number, max: number, decimals: number = 1): number => {
  const value = min + Math.random() * (max - min);
  return parseFloat(value.toFixed(decimals));
};

const createQuestion = (statement: string, answer: number | string): Question => ({
  id: `mental_math_${Date.now()}_${Math.random()}`,
  statement,
  answer: typeof answer === 'number' ? answer : answer,
  type: 'numeric',
  topic: 'mental_math',
  difficulty: 3,
});

// ===========================================
// EASY MODE GENERATORS
// ===========================================

/**
 * Easy Multiplication: 2-digit × 2-digit (10..99)
 */
export const generateEasyMultiplication = (): Question => {
  const a = randomInt(10, 99);
  const b = randomInt(10, 99);
  const answer = a * b;
  return createQuestion(`${a} × ${b} = ?`, answer);
};

/**
 * Easy Addition: 3-digit + 3-digit (100..999)
 */
export const generateEasyAddition = (): Question => {
  const a = randomInt(100, 999);
  const b = randomInt(100, 999);
  const answer = a + b;
  return createQuestion(`${a} + ${b} = ?`, answer);
};

/**
 * Easy Subtraction: 3-digit - 3-digit (100..999), result >= 0
 */
export const generateEasySubtraction = (): Question => {
  let a = randomInt(100, 999);
  let b = randomInt(100, 999);
  // Ensure a >= b for positive result
  if (a < b) [a, b] = [b, a];
  const answer = a - b;
  return createQuestion(`${a} - ${b} = ?`, answer);
};

/**
 * Easy Division: 3-digit / 2-digit with integer or 1 decimal result
 */
export const generateEasyDivision = (): Question => {
  const divisor = randomInt(10, 99);
  // Generate a quotient that's either integer or has 1 decimal
  const useDecimal = Math.random() < 0.3; // 30% chance of decimal result
  let quotient: number;
  let dividend: number;
  
  if (useDecimal) {
    // Result with 1 decimal (e.g., 7.5, 8.2)
    quotient = randomInt(2, 15) + randomInt(1, 9) / 10;
    dividend = Math.round(divisor * quotient);
    // Recalculate to ensure clean decimal
    quotient = parseFloat((dividend / divisor).toFixed(1));
  } else {
    // Integer result
    quotient = randomInt(2, 15);
    dividend = divisor * quotient;
  }
  
  return createQuestion(`${dividend} ÷ ${divisor} = ?`, quotient);
};

/**
 * Generate Easy mode question based on selected operations
 */
export const generateEasyQuestion = (operations: string[]): Question => {
  const availableGenerators: { [key: string]: () => Question } = {
    'multiplication': generateEasyMultiplication,
    'addition': generateEasyAddition,
    'subtraction': generateEasySubtraction,
    'division': generateEasyDivision,
  };
  
  const selectedOps = operations.filter(op => availableGenerators[op]);
  if (selectedOps.length === 0) {
    return generateEasyMultiplication(); // Default
  }
  
  const randomOp = selectedOps[Math.floor(Math.random() * selectedOps.length)];
  return availableGenerators[randomOp]();
};

// ===========================================
// HARD MODE GENERATORS
// ===========================================

/**
 * Hard Decimal Multiplication: e.g., 39.2 × 9.2
 */
export const generateHardDecimalMultiplication = (): Question => {
  const a = randomDecimal(10, 50, 1);
  const b = randomDecimal(5, 15, 1);
  const answer = parseFloat((a * b).toFixed(2));
  return createQuestion(`${a} × ${b} = ?`, answer);
};

/**
 * Hard Decimal Division: e.g., 43 ÷ 5.6
 */
export const generateHardDecimalDivision = (): Question => {
  const divisor = randomDecimal(3, 12, 1);
  const quotient = randomDecimal(4, 15, 1);
  const dividend = parseFloat((divisor * quotient).toFixed(1));
  const answer = parseFloat((dividend / divisor).toFixed(2));
  return createQuestion(`${dividend} ÷ ${divisor} = ?`, answer);
};

/**
 * Hard Percentage: "X est ...% de Y"
 */
export const generateHardPercentage = (): Question => {
  const total = randomInt(120, 250);
  const percentage = randomInt(15, 85);
  const part = parseFloat(((percentage / 100) * total).toFixed(1));
  
  // Question: "part est X% de total"
  return createQuestion(`${part} est … % de ${total}`, percentage);
};

/**
 * Generate Hard mode question (mix of all hard categories)
 */
export const generateHardQuestion = (): Question => {
  const generators = [
    generateHardDecimalMultiplication,
    generateHardDecimalDivision,
    generateHardPercentage,
  ];
  
  const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
  return randomGenerator();
};

// ===========================================
// METHOD-SPECIFIC GENERATORS (COURS)
// ===========================================

/**
 * M1: Identité Symétrique (a-x)(a+x) = a² - x²
 * Generate questions where the two numbers are equidistant from a round number
 */
export const generateM1Question = (): Question => {
  // Choose a (round number) and x (small offset)
  const a = randomInt(3, 9) * 10; // 30, 40, 50, 60, 70, 80, 90
  const x = randomInt(1, 9);
  
  const n1 = a - x;
  const n2 = a + x;
  const answer = a * a - x * x; // a² - x²
  
  return createQuestion(`${n1} × ${n2} = ?`, answer);
};

/**
 * M2: Identité Asymétrique (a-x)(b+x) = ab + x(a-b) - x²
 */
export const generateM2Question = (): Question => {
  const a = randomInt(3, 8) * 10; // 30, 40, 50, 60, 70, 80
  const b = randomInt(2, 5) * 10; // 20, 30, 40, 50
  const x = randomInt(1, 9);
  
  // Ensure a > b for the formula to make sense
  const bigA = Math.max(a, b);
  const smallB = Math.min(a, b);
  
  const n1 = bigA - x;
  const n2 = smallB + x;
  const answer = bigA * smallB + x * (bigA - smallB) - x * x;
  
  return createQuestion(`${n1} × ${n2} = ?`, answer);
};

/**
 * M3: Identité Générale (a-x)(b-y) = ab - ay - bx + xy
 */
export const generateM3Question = (): Question => {
  const a = randomInt(3, 6) * 10; // 30, 40, 50, 60
  const b = randomInt(2, 4) * 10; // 20, 30, 40
  const x = randomInt(1, 5);
  const y = randomInt(1, 5);
  
  const n1 = a - x;
  const n2 = b - y;
  const answer = a * b - a * y - b * x + x * y;
  
  return createQuestion(`${n1} × ${n2} = ?`, answer);
};

/**
 * M4: Décomposition (×65, ×75, ×85, ×95)
 */
export const generateM4Question = (): Question => {
  const multipliers = [65, 75, 85, 95, 55, 45];
  const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
  const n = randomInt(11, 25);
  const answer = n * multiplier;
  
  return createQuestion(`${n} × ${multiplier} = ?`, answer);
};

/**
 * M5: Division par Ajustement
 * Generate divisions where A ÷ B gives a result close to an integer
 */
export const generateM5Question = (): Question => {
  const divisor = randomInt(20, 80);
  const baseQuotient = randomInt(6, 12);
  const baseProduct = divisor * baseQuotient;
  
  // Add a small offset to force adjustment
  const offset = randomInt(8, 28);
  const addOffset = Math.random() < 0.5;
  const dividend = addOffset ? baseProduct + offset : baseProduct - offset;
  
  const answer = parseFloat((dividend / divisor).toFixed(2));
  
  return createQuestion(`${dividend} ÷ ${divisor} = ?`, answer);
};

/**
 * M6: Pourcentages (10% → 1% → ajustement)
 */
export const generateM6Question = (): Question => {
  const total = randomInt(120, 250);
  const percentage = randomInt(15, 85);
  const part = parseFloat(((percentage / 100) * total).toFixed(1));
  
  return createQuestion(`${part} est … % de ${total}`, percentage);
};

/**
 * Generate question for specific method(s)
 */
export const generateMethodQuestion = (methodIds: MethodId[]): Question => {
  const generators: { [key in MethodId]: () => Question } = {
    'M1': generateM1Question,
    'M2': generateM2Question,
    'M3': generateM3Question,
    'M4': generateM4Question,
    'M5': generateM5Question,
    'M6': generateM6Question,
  };
  
  if (methodIds.length === 0) {
    return generateM1Question(); // Default
  }
  
  const randomMethodId = methodIds[Math.floor(Math.random() * methodIds.length)];
  return generators[randomMethodId]();
};

// ===========================================
// UNIFIED GENERATOR
// ===========================================

export type MentalMathMode = 'easy' | 'hard';

export interface MentalMathTrainingConfig {
  mode: MentalMathMode;
  durationSeconds: number;
  operations?: string[]; // For easy mode
}

export interface MentalMathCoursConfig {
  methodIds: MethodId[];
  durationSeconds: number;
}

/**
 * Generate question based on training config
 */
export const generateTrainingQuestion = (config: MentalMathTrainingConfig): Question => {
  if (config.mode === 'easy') {
    return generateEasyQuestion(config.operations || ['multiplication', 'addition', 'subtraction', 'division']);
  } else {
    return generateHardQuestion();
  }
};

/**
 * Generate question based on course config (methods)
 */
export const generateCoursQuestion = (config: MentalMathCoursConfig): Question => {
  return generateMethodQuestion(config.methodIds);
};
