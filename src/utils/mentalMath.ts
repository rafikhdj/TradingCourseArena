import { Question, MentalMathOperation, MentalMathRange, MentalMathConfig, MentalMathType } from '../types';

export interface MentalMathQuestionMetadata {
  type: MentalMathType;
  operator: MentalMathOperation;
  has_gap: boolean;
}

// Helper to generate random integer in range
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to generate random decimal with 1-2 decimal places
const randomDecimal = (min: number, max: number): number => {
  const num = Math.random() * (max - min) + min;
  const decimals = Math.random() < 0.5 ? 1 : 2;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Helper to simplify fractions (find GCD)
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// Helper to simplify a fraction
const simplifyFraction = (num: number, den: number): { num: number; den: number } => {
  const divisor = gcd(Math.abs(num), Math.abs(den));
  return { num: num / divisor, den: den / divisor };
};

// Helper to generate a simple fraction
const randomFraction = (): { num: number; den: number } => {
  const den = randomInt(2, 16);
  const num = randomInt(1, den - 1);
  return simplifyFraction(num, den);
};

// Helper to format fraction as string
const formatFraction = (num: number, den: number): string => {
  return `${num}/${den}`;
};

// Generate a question type randomly
type QuestionFormat = 'standard' | 'gap' | 'decimal' | 'fraction' | 'percentage' | 'decimal_multiple' | 'fraction_operation' | 'fraction_division';

export const generateMentalMathQuestion = (
  operations: MentalMathOperation[],
  addSubRange: MentalMathRange,
  multDivRange: MentalMathRange,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Question => {
  // Randomly select an operation
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  // Select question format based on difficulty
  let formats: QuestionFormat[];
  if (difficulty === 'easy') {
    // Easy: only simple formats
    formats = ['standard', 'gap'];
  } else if (difficulty === 'medium') {
    // Medium: add decimals
    formats = ['standard', 'gap', 'decimal'];
  } else {
    // Hard: all formats including fractions and advanced
    formats = [
      'standard',      // 58 + 5 = ?
      'gap',           // 49 × ? = 343
      'decimal',       // 4.9 ÷ ? = 0.7, 10.7 × 13.2 = ?
      'fraction',      // 14/7 + 35/70 = ?, 1/4 ÷ ? = 1/2
      'percentage',    // 36 est … % de 80
      'decimal_multiple', // 0.6 × 70 × 5000 = ?
      'fraction_operation', // 15 ÷ 5/6 = ?, 5/6 × 12 = ?
    ];
  }
  
  const format = formats[Math.floor(Math.random() * formats.length)];
  
  let statement: string;
  let answer: number | string;
  let type: MentalMathType = 'integer';
  let has_gap = false;
  
  switch (format) {
    case 'standard': {
      // Standard format: a + b = ?, a - b = ?, a × b = ?, a ÷ b = ?
      if (operation === 'addition') {
        const a = randomInt(addSubRange.minA, addSubRange.maxA);
        const b = randomInt(addSubRange.minB, addSubRange.maxB);
        answer = a + b;
        statement = `${a} + ${b} = ?`;
        has_gap = (a >= 10 || b >= 10) && (a < 10 || b < 10);
      } else if (operation === 'subtraction') {
        let a = randomInt(addSubRange.minA, addSubRange.maxA);
        let b = randomInt(addSubRange.minB, addSubRange.maxB);
        if (a < b) [a, b] = [b, a];
        answer = a - b;
        statement = `${a} − ${b} = ?`;
        has_gap = (a >= 10 || b >= 10) && (a < 10 || b < 10);
      } else if (operation === 'multiplication') {
        const a = randomInt(multDivRange.minA, multDivRange.maxA);
        const b = randomInt(multDivRange.minB, multDivRange.maxB);
        answer = a * b;
        statement = `${a} × ${b} = ?`;
        has_gap = (a >= 10 || b >= 10) && (a < 10 || b < 10);
      } else { // division
        const a = randomInt(multDivRange.minA, multDivRange.maxA);
        const b = randomInt(multDivRange.minB, multDivRange.maxB);
        const product = a * b;
        answer = b;
        statement = `${product} ÷ ${a} = ?`;
        has_gap = product >= 100 && a < 10;
      }
      break;
    }
    
    case 'gap': {
      // Gap format: a × ? = c, a + ? = c, etc.
      if (operation === 'multiplication') {
        const a = randomInt(multDivRange.minA, multDivRange.maxA);
        const b = randomInt(multDivRange.minB, multDivRange.maxB);
        const product = a * b;
        answer = b;
        statement = `${a} × ? = ${product}`;
        has_gap = true;
      } else if (operation === 'division') {
        const a = randomInt(multDivRange.minA, multDivRange.maxA);
        const b = randomInt(multDivRange.minB, multDivRange.maxB);
        const product = a * b;
        answer = a;
        statement = `${product} ÷ ? = ${b}`;
        has_gap = true;
      } else if (operation === 'addition') {
        const a = randomInt(addSubRange.minA, addSubRange.maxA);
        const b = randomInt(addSubRange.minB, addSubRange.maxB);
        answer = b;
        statement = `${a} + ? = ${a + b}`;
        has_gap = true;
      } else { // subtraction
        let a = randomInt(addSubRange.minA, addSubRange.maxA);
        let b = randomInt(addSubRange.minB, addSubRange.maxB);
        if (a < b) [a, b] = [b, a];
        answer = b;
        statement = `${a} − ? = ${a - b}`;
        has_gap = true;
      }
      break;
    }
    
    case 'decimal': {
      // Decimal format: 4.9 ÷ ? = 0.7, 10.7 × 13.2 = ?
      type = 'decimal';
      if (operation === 'division') {
        const divisor = randomDecimal(0.1, 10);
        const quotient = randomDecimal(0.1, 10);
        const dividend = divisor * quotient;
        answer = divisor;
        statement = `${dividend.toFixed(1)} ÷ ? = ${quotient.toFixed(1)}`;
        has_gap = true;
      } else if (operation === 'multiplication') {
        const a = randomDecimal(1, 50);
        const b = randomDecimal(1, 50);
        answer = a * b;
        statement = `${a.toFixed(1)} × ${b.toFixed(1)} = ?`;
        has_gap = false;
      } else if (operation === 'addition') {
        const a = randomDecimal(0.01, 100);
        const b = randomDecimal(0.01, 100);
        answer = a + b;
        statement = `${a.toFixed(2)} + ${b.toFixed(2)} = ?`;
        has_gap = false;
      } else { // subtraction
        const a = randomDecimal(0.01, 100);
        const b = randomDecimal(0.01, a);
        answer = a - b;
        statement = `${a.toFixed(2)} − ${b.toFixed(2)} = ?`;
        has_gap = false;
      }
      break;
    }
    
    case 'fraction': {
      // Fraction format: 14/7 + 35/70 = ?, 1/4 ÷ ? = 1/2
      type = 'fraction';
      if (operation === 'addition') {
        const f1 = randomFraction();
        const f2 = randomFraction();
        const sum = (f1.num / f1.den) + (f2.num / f2.den);
        const sumSimplified = simplifyFraction(Math.round(sum * 100), 100);
        answer = formatFraction(sumSimplified.num, sumSimplified.den);
        statement = `${formatFraction(f1.num, f1.den)} + ${formatFraction(f2.num, f2.den)} = ?`;
        has_gap = false;
      } else if (operation === 'subtraction') {
        const f1 = randomFraction();
        let f2 = randomFraction();
        // Ensure f1 > f2
        while ((f1.num / f1.den) <= (f2.num / f2.den)) {
          f2 = randomFraction();
        }
        const diff = (f1.num / f1.den) - (f2.num / f2.den);
        const diffSimplified = simplifyFraction(Math.round(diff * 100), 100);
        answer = formatFraction(diffSimplified.num, diffSimplified.den);
        statement = `${formatFraction(f1.num, f1.den)} − ${formatFraction(f2.num, f2.den)} = ?`;
        has_gap = false;
      } else if (operation === 'multiplication') {
        const f1 = randomFraction();
        const f2 = randomFraction();
        const product = simplifyFraction(f1.num * f2.num, f1.den * f2.den);
        answer = formatFraction(product.num, product.den);
        statement = `${formatFraction(f1.num, f1.den)} × ${formatFraction(f2.num, f2.den)} = ?`;
        has_gap = false;
      } else { // division with gap: 1/4 ÷ ? = 1/2
        // Generate f1 and the quotient, then calculate the answer (divisor)
        const f1 = randomFraction();
        const quotient = randomFraction();
        // If f1 ÷ ? = quotient, then ? = f1 ÷ quotient = (f1.num * quotient.den) / (f1.den * quotient.num)
        const divisor = simplifyFraction(f1.num * quotient.den, f1.den * quotient.num);
        answer = formatFraction(divisor.num, divisor.den);
        statement = `${formatFraction(f1.num, f1.den)} ÷ ? = ${formatFraction(quotient.num, quotient.den)}`;
        has_gap = true;
      }
      break;
    }
    
    case 'percentage': {
      // Percentage format: 36 est … % de 80
      type = 'decimal';
      const part = randomInt(1, 100);
      const whole = randomInt(part, 200);
      answer = (part / whole) * 100;
      statement = `${part} est … % de ${whole}`;
      has_gap = true;
      break;
    }
    
    case 'decimal_multiple': {
      // Multiple decimal multiplication: 0.6 × 70 × 5000 = ?
      type = 'decimal';
      const a = randomDecimal(0.1, 2);
      const b = randomInt(10, 100);
      const c = randomInt(100, 10000);
      answer = a * b * c;
      statement = `${a.toFixed(1)} × ${b} × ${c} = ?`;
      has_gap = false;
      break;
    }
    
    case 'fraction_operation': {
      // Fraction operations: 15 ÷ 5/6 = ?, 5/6 × 12 = ?
      type = 'fraction';
      if (operation === 'division') {
        // a ÷ b/c = ?
        const a = randomInt(5, 100);
        const f = randomFraction();
        const result = (a * f.den) / f.num;
        // If result is integer, return as integer string, otherwise as fraction
        if (result % 1 === 0) {
          answer = result.toString();
        } else {
          const simplified = simplifyFraction(Math.round(result * 100), 100);
          answer = formatFraction(simplified.num, simplified.den);
        }
        statement = `${a} ÷ ${formatFraction(f.num, f.den)} = ?`;
        has_gap = false;
      } else if (operation === 'multiplication') {
        // a/b × c = ?
        const f = randomFraction();
        const c = randomInt(2, 50);
        const product = (f.num * c) / f.den;
        if (product % 1 === 0) {
          answer = product.toString();
        } else {
          const simplified = simplifyFraction(Math.round(product * 100), 100);
          answer = formatFraction(simplified.num, simplified.den);
        }
        statement = `${formatFraction(f.num, f.den)} × ${c} = ?`;
        has_gap = false;
      } else {
        // Fallback to standard for addition/subtraction
        const a = randomInt(addSubRange.minA, addSubRange.maxA);
        const b = randomInt(addSubRange.minB, addSubRange.maxB);
        answer = a + b;
        statement = `${a} + ${b} = ?`;
        has_gap = (a >= 10 || b >= 10) && (a < 10 || b < 10);
      }
      break;
    }
    
    default:
      // Fallback
      const a = randomInt(addSubRange.minA, addSubRange.maxA);
      const b = randomInt(addSubRange.minB, addSubRange.maxB);
      answer = a + b;
      statement = `${a} + ${b} = ?`;
      break;
  }
  
  // Convert answer to string (handle fractions separately)
  let answerString: string;
  if (typeof answer === 'string') {
    answerString = answer;
  } else {
    // For decimal answers, keep up to 2 decimal places if needed
    if (answer % 1 === 0) {
      answerString = answer.toString();
    } else {
      answerString = answer.toFixed(2);
    }
  }
  
  const question: Question = {
    id: `mental_math_${Date.now()}_${Math.random()}`,
    statement,
    topic: 'mental_math',
    difficulty: 1,
    type: 'numeric',
    answer: answerString,
    explanation: '',
    created_at: new Date().toISOString(),
    metadata: {
      type,
      operator: operation,
      has_gap,
    },
  };
  
  return question;
};
