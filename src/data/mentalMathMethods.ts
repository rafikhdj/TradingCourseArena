/**
 * Mental Math Methods for Course Mode
 * Each method has a dedicated generator for compatible questions
 */

export interface MentalMathMethod {
  id: string;
  title: string;
  description: string;
  example: string;
  formula: string;
}

export const MENTAL_MATH_METHODS: MentalMathMethod[] = [
  {
    id: 'M1',
    title: 'Identité Symétrique',
    description: 'Utilise la différence de carrés pour simplifier les multiplications où les deux nombres sont équidistants d\'un nombre rond.',
    example: '47 × 53 = (50-3)(50+3) = 50² - 3² = 2500 - 9 = 2491',
    formula: '(a-x)(a+x) = a² - x²',
  },
  {
    id: 'M2',
    title: 'Identité Asymétrique',
    description: 'Pour multiplier deux nombres proches de références différentes.',
    example: '48 × 32 = (50-2)(30+2) = 50×30 + 2×(50-30) - 4 = 1500 + 40 - 4 = 1536',
    formula: '(a-x)(b+x) = ab + x(a-b) - x²',
  },
  {
    id: 'M3',
    title: 'Identité Générale',
    description: 'Décomposition générale pour deux nombres quelconques proches de références.',
    example: '38 × 27 = (40-2)(30-3) = 40×30 - 40×3 - 2×30 + 6 = 1200 - 120 - 60 + 6 = 1026',
    formula: '(a-x)(b-y) = ab - ay - bx + xy',
  },
  {
    id: 'M4',
    title: 'Décomposition (×65, ×75, ×85)',
    description: 'Multiplier par 65 = 60+5, 75 = 80-5, 85 = 80+5, etc. Décomposer en opérations simples.',
    example: '12 × 65 = 12 × (60+5) = 720 + 60 = 780',
    formula: 'N × (A±B) = N×A ± N×B',
  },
  {
    id: 'M5',
    title: 'Division par Ajustement',
    description: 'Pour diviser, trouver un multiple proche puis ajuster avec 0.1 ou 0.01 du diviseur.',
    example: '478 ÷ 56 → 56×8=448, reste 30 → 30÷56 ≈ 0.54 → Résultat ≈ 8.54',
    formula: 'A ÷ B = n + (A - B×n) ÷ B',
  },
  {
    id: 'M6',
    title: 'Pourcentages (10% → 1%)',
    description: 'Calculer 10% (diviser par 10), puis 1% (diviser par 100), puis combiner.',
    example: '73 est X% de 177 → 10% de 177 = 17.7, 1% = 1.77 → 73 ≈ 41% (4×17.7 + 1.77)',
    formula: 'X% de Y = (X/100) × Y',
  },
];

export type MethodId = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';
