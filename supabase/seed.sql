-- Seed data for TradingCourseArena
-- Run this after creating the schema

-- Mental Math Questions
INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation) VALUES
('What is 47 + 38?', 'mental_math', 1, 'numeric', NULL, '"85"'::jsonb, 'Add 47 and 38: 47 + 38 = 85'),
('What is 15 × 12?', 'mental_math', 2, 'numeric', NULL, '"180"'::jsonb, '15 × 12 = 15 × (10 + 2) = 150 + 30 = 180'),
('What is 144 ÷ 12?', 'mental_math', 1, 'numeric', NULL, '"12"'::jsonb, '144 ÷ 12 = 12'),
('What is 25% of 200?', 'mental_math', 2, 'numeric', NULL, '"50"'::jsonb, '25% of 200 = 0.25 × 200 = 50'),
('What is 7² + 8²?', 'mental_math', 3, 'numeric', NULL, '"113"'::jsonb, '7² = 49, 8² = 64, so 49 + 64 = 113'),
('What is 1/4 + 1/2?', 'mental_math', 2, 'numeric', NULL, '"0.75"'::jsonb, '1/4 + 1/2 = 1/4 + 2/4 = 3/4 = 0.75'),
('What is 17 × 5?', 'mental_math', 1, 'numeric', NULL, '"85"'::jsonb, '17 × 5 = 85'),
('What is 256 ÷ 16?', 'mental_math', 2, 'numeric', NULL, '"16"'::jsonb, '256 ÷ 16 = 16'),
('What is 3³?', 'mental_math', 1, 'numeric', NULL, '"27"'::jsonb, '3³ = 3 × 3 × 3 = 27'),
('What is 20% of 150?', 'mental_math', 2, 'numeric', NULL, '"30"'::jsonb, '20% of 150 = 0.20 × 150 = 30');

-- Probability Questions
INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation) VALUES
('What is the probability of flipping a coin and getting heads?', 'probability', 1, 'mcq', 
 '[{"id": "a", "label": "0.25"}, {"id": "b", "label": "0.5"}, {"id": "c", "label": "0.75"}, {"id": "d", "label": "1.0"}]'::jsonb, 
 '"b"'::jsonb, 'A fair coin has two equally likely outcomes, so P(heads) = 1/2 = 0.5'),
('What is the probability of rolling a 6 on a standard die?', 'probability', 1, 'mcq',
 '[{"id": "a", "label": "1/6"}, {"id": "b", "label": "1/3"}, {"id": "c", "label": "1/2"}, {"id": "d", "label": "1/4"}]'::jsonb,
 '"a"'::jsonb, 'A standard die has 6 faces, so P(6) = 1/6'),
('If you draw a card from a standard deck, what is the probability it is a heart?', 'probability', 2, 'mcq',
 '[{"id": "a", "label": "1/4"}, {"id": "b", "label": "1/13"}, {"id": "c", "label": "1/52"}, {"id": "d", "label": "1/2"}]'::jsonb,
 '"a"'::jsonb, 'There are 13 hearts in a 52-card deck, so P(heart) = 13/52 = 1/4'),
('What is the probability of rolling two dice and getting a sum of 7?', 'probability', 3, 'mcq',
 '[{"id": "a", "label": "1/6"}, {"id": "b", "label": "1/12"}, {"id": "c", "label": "1/36"}, {"id": "d", "label": "1/18"}]'::jsonb,
 '"a"'::jsonb, 'There are 6 ways to get sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Total outcomes = 36, so P = 6/36 = 1/6'),
('A bag contains 3 red and 2 blue balls. What is the probability of drawing a red ball?', 'probability', 2, 'mcq',
 '[{"id": "a", "label": "2/5"}, {"id": "b", "label": "3/5"}, {"id": "c", "label": "1/2"}, {"id": "d", "label": "3/4"}]'::jsonb,
 '"b"'::jsonb, 'There are 3 red balls out of 5 total, so P(red) = 3/5'),
('What is the probability of getting at least one head when flipping two coins?', 'probability', 3, 'mcq',
 '[{"id": "a", "label": "1/4"}, {"id": "b", "label": "1/2"}, {"id": "c", "label": "3/4"}, {"id": "d", "label": "1"}]'::jsonb,
 '"c"'::jsonb, 'P(at least one head) = 1 - P(no heads) = 1 - P(TT) = 1 - 1/4 = 3/4'),
('If events A and B are independent with P(A) = 0.3 and P(B) = 0.4, what is P(A and B)?', 'probability', 4, 'numeric',
 NULL, '0.12'::jsonb, 'For independent events, P(A and B) = P(A) × P(B) = 0.3 × 0.4 = 0.12'),
('What is the probability of drawing an ace from a standard deck?', 'probability', 1, 'mcq',
 '[{"id": "a", "label": "1/13"}, {"id": "b", "label": "1/4"}, {"id": "c", "label": "1/52"}, {"id": "d", "label": "4/52"}]'::jsonb,
 '"a"'::jsonb, 'There are 4 aces in 52 cards, so P(ace) = 4/52 = 1/13');

-- Brainteaser Questions
INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation) VALUES
('You have 12 balls, one of which weighs differently. Using a balance scale, what is the minimum number of weighings needed to find the different ball?', 'brainteaser', 4, 'numeric',
 NULL, '"3"'::jsonb, 'Divide into groups of 4. First weighing: compare two groups. Second weighing narrows it down. Third weighing identifies the ball.'),
('A clock shows 3:15. What is the angle between the hour and minute hands?', 'brainteaser', 3, 'numeric',
 NULL, '"7.5"'::jsonb, 'Hour hand at 3:15 is at 90° + (15/60)×30° = 97.5°. Minute hand at 90°. Difference = 7.5°.'),
('If you have 5 apples and take away 3, how many do you have?', 'brainteaser', 1, 'numeric',
 NULL, '"3"'::jsonb, 'You took away 3, so you have 3 apples.'),
('How many times can you subtract 5 from 25?', 'brainteaser', 2, 'numeric',
 NULL, '"1"'::jsonb, 'You can only subtract 5 from 25 once. After that, you are subtracting from 20, not 25.'),
('A train leaves Station A at 60 mph. Another train leaves Station B at 80 mph, 200 miles away, heading toward Station A. When do they meet?', 'brainteaser', 4, 'numeric',
 NULL, '"1.43"'::jsonb, 'Relative speed = 60 + 80 = 140 mph. Time = 200/140 = 1.43 hours.'),
('What is the next number in the sequence: 2, 6, 12, 20, 30?', 'brainteaser', 3, 'numeric',
 NULL, '"42"'::jsonb, 'The differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42.'),
('How many squares are on a chessboard?', 'brainteaser', 4, 'numeric',
 NULL, '"204"'::jsonb, '1×1: 64, 2×2: 49, 3×3: 36, ... up to 8×8: 1. Sum = 204.'),
('If a bat and ball cost $1.10 together, and the bat costs $1.00 more than the ball, how much does the ball cost?', 'brainteaser', 3, 'numeric',
 NULL, '"0.05"'::jsonb, 'Let ball = x, bat = x + 1. So x + (x + 1) = 1.10, thus 2x = 0.10, x = 0.05.');

-- Market Making Questions
INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation) VALUES
('If the bid is $100 and the ask is $101, what is the spread?', 'market_making', 1, 'numeric',
 NULL, '"1"'::jsonb, 'Spread = Ask - Bid = $101 - $100 = $1'),
('A market maker quotes bid $50.00 and ask $50.05. If they buy at bid and sell at ask, what is their profit per round trip?', 'market_making', 2, 'numeric',
 NULL, '"0.05"'::jsonb, 'Profit = Ask - Bid = $50.05 - $50.00 = $0.05'),
('What happens to a market maker''s inventory if they buy more than they sell?', 'market_making', 2, 'mcq',
 '[{"id": "a", "label": "Inventory increases"}, {"id": "b", "label": "Inventory decreases"}, {"id": "c", "label": "Inventory stays the same"}, {"id": "d", "label": "Cannot determine"}]'::jsonb,
 '"a"'::jsonb, 'Buying increases inventory, selling decreases it. If buys > sells, inventory increases.'),
('If the mid price is $100 and the spread is $0.10, what are the bid and ask?', 'market_making', 3, 'free_text',
 NULL, '"99.95,100.05"'::jsonb, 'Mid = (Bid + Ask)/2. If spread = 0.10, then Ask - Bid = 0.10. Solving: Bid = 99.95, Ask = 100.05'),
('A market maker has a long inventory of 10 shares. They want to reduce inventory. Should they widen or narrow their spread?', 'market_making', 3, 'mcq',
 '[{"id": "a", "label": "Widen spread"}, {"id": "b", "label": "Narrow spread"}, {"id": "c", "label": "No change"}, {"id": "d", "label": "Cannot determine"}]'::jsonb,
 '"a"'::jsonb, 'To reduce long inventory, widen the bid-ask spread to discourage buying and encourage selling.'),
('What is the primary risk for a market maker?', 'market_making', 2, 'mcq',
 '[{"id": "a", "label": "Inventory risk"}, {"id": "b", "label": "Credit risk"}, {"id": "c", "label": "Liquidity risk"}, {"id": "d", "label": "All of the above"}]'::jsonb,
 '"d"'::jsonb, 'Market makers face inventory risk (price moves against position), credit risk, and liquidity risk.'),
('If a market maker quotes bid $99.98 and ask $100.02, what is the mid price?', 'market_making', 2, 'numeric',
 NULL, '"100"'::jsonb, 'Mid = (Bid + Ask)/2 = ($99.98 + $100.02)/2 = $100.00'),
('A market maker wants to attract more flow. Should they widen or narrow their spread?', 'market_making', 2, 'mcq',
 '[{"id": "a", "label": "Widen spread"}, {"id": "b", "label": "Narrow spread"}, {"id": "c", "label": "No change"}, {"id": "d", "label": "Cannot determine"}]'::jsonb,
 '"b"'::jsonb, 'Narrowing the spread makes quotes more competitive, attracting more trading flow.');

