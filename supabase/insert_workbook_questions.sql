-- ================================================
-- All Options Trading Academy - Workbook Questions
-- Topic: derivatives
-- ================================================

-- ========================================
-- Chapter 1: Option Characteristics (Put-Call Parity)
-- Theme: option_characteristics
-- ========================================

INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation, theme) VALUES

-- Q1: Numeric
('Suppose there are no interest or dividend considerations. If the underlying stock is trading at 98.60 and the Oct 95 call is trading at 7.10, the Oct 95 put should be trading at:',
 'derivatives', 2, 'numeric', NULL,
 '"3.5"'::jsonb,
 'P = C - S + K = 7.10 - 98.60 + 95 = 3.50',
 'option_characteristics'),

-- Q2: MCQ
('Given an annual interest rate of 9% and 6 months remaining to August expiration, if the August 70 put is trading at 15.50 and the underlying stock is trading at 60.50, then according to put-call parity, the Aug 70 call should be trading at approximately what price?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"10.10"},{"id":"b","label":"9.15"},{"id":"c","label":"8.60"},{"id":"d","label":"9.45"},{"id":"e","label":"9.75"}]'::jsonb,
 '"b"'::jsonb,
 'C = P + S - K(1-rt) = 15.5 + 60.5 - 70(1-0.045) = 76 - 66.85 = 9.15',
 'option_characteristics'),

-- Q3: Numeric
('Assuming an interest rate of zero, if the underlying stock is trading at 51.85 and a dividend of 0.65 is expected prior to November expiration, the difference between the price of the Nov 50 call and the Nov 50 put should be:',
 'derivatives', 2, 'numeric', NULL,
 '"1.2"'::jsonb,
 'C - P = S - K - D = 51.85 - 50 - 0.65 = 1.20',
 'option_characteristics'),

-- Q4: Numeric
('Suppose there are no interest or dividend considerations. If the underlying stock is trading at 101.50 and the Dec 100 put is trading at 0.75, the Dec 100 call should be trading at:',
 'derivatives', 2, 'numeric', NULL,
 '"2.25"'::jsonb,
 'C = P + S - K = 0.75 + 101.50 - 100 = 2.25',
 'option_characteristics'),

-- Q5: MCQ
('Given an annual interest rate of 5% and 6 months remaining to March expiration, if the Mar 75 call is trading at 8.00 and the Mar 75 put is trading at 3.50, then according to put-call parity, the underlying stock should be trading at approximately what price?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"67.65"},{"id":"b","label":"81.35"},{"id":"c","label":"82.55"},{"id":"d","label":"78.45"},{"id":"e","label":"77.65"}]'::jsonb,
 '"e"'::jsonb,
 'S = C - P + K(1-rt) = 8 - 3.5 + 75(1-0.025) = 4.5 + 73.125 = 77.625 ≈ 77.65',
 'option_characteristics'),

-- Q6: Numeric
('Suppose there are no interest or dividend considerations. If the underlying stock is trading at 52.30 and the Mar 50 call is trading at 3.40, the Mar 50 put should be trading at:',
 'derivatives', 2, 'numeric', NULL,
 '"1.1"'::jsonb,
 'P = C - S + K = 3.40 - 52.30 + 50 = 1.10',
 'option_characteristics'),

-- Q7: MCQ
('Given an annual interest rate of 6% and 6 months remaining to April expiration, if an Apr 60 put is trading at 2.50 and the underlying stock is trading at 61.25, then according to put-call parity, the Apr 60 call should be trading at approximately what price?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"5.55"},{"id":"b","label":"6.65"},{"id":"c","label":"5.35"},{"id":"d","label":"5.85"},{"id":"e","label":"5.15"}]'::jsonb,
 '"a"'::jsonb,
 'C = P + S - K(1-rt) = 2.50 + 61.25 - 60(1-0.03) = 63.75 - 58.20 = 5.55',
 'option_characteristics'),

-- Q8: Numeric
('Suppose there are no interest or dividend considerations. If the underlying stock is trading at 34.25 and the Jan 35 call is trading at 2.50, the Jan 35 put should be trading at:',
 'derivatives', 2, 'numeric', NULL,
 '"3.25"'::jsonb,
 'P = C - S + K = 2.50 - 34.25 + 35 = 3.25',
 'option_characteristics'),

-- Q9: MCQ
('Given an annual interest rate of 8% and 6 months remaining to June expiration, if a Jun 80 put is trading at 2.25 and the underlying stock is trading at 80.00, then according to put-call parity, the Jun 80 call should be trading at approximately what price?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"4.75"},{"id":"b","label":"5.80"},{"id":"c","label":"5.45"},{"id":"d","label":"5.15"}]'::jsonb,
 '"c"'::jsonb,
 'C = P + S - K(1-rt) = 2.25 + 80 - 80(1-0.04) = 82.25 - 76.80 = 5.45',
 'option_characteristics'),

-- Q10: MCQ
('Given an annual interest rate of 6% and 3 months remaining to June expiration, if the Jun 70 call is trading at 1.25 and the underlying stock is trading at 68.10, then according to put-call parity, the Jun 70 put should be trading at approximately what price?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"2.05"},{"id":"b","label":"2.15"},{"id":"c","label":"2.20"},{"id":"d","label":"2.25"},{"id":"e","label":"2.10"}]'::jsonb,
 '"e"'::jsonb,
 'P = C - S + K(1-rt) = 1.25 - 68.10 + 70(1-0.015) = 1.25 - 68.10 + 68.95 = 2.10',
 'option_characteristics'),

-- Q11: MCQ
('With 3 months remaining to September expiration and an annual interest rate of 10%, the carrying costs on the Sep 180 synthetic in the stock option market are approximately:',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"4.00"},{"id":"b","label":"3.75"},{"id":"c","label":"3.60"},{"id":"d","label":"4.50"},{"id":"e","label":"2.50"}]'::jsonb,
 '"d"'::jsonb,
 'Carrying cost = K × r × t = 180 × 0.10 × 0.25 = 4.50',
 'option_characteristics'),

-- Q12: MCQ
('A trader would like to buy a June 30 call (delta 35, multiplier 100). Assuming there are no restrictions on the short sale of stock, which of the following strategies might he consider?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"buy a June 30 put, buy 100 stocks"},{"id":"b","label":"buy a June 30 put, sell 100 stocks"},{"id":"c","label":"buy a June 30 put, buy 65 stocks"},{"id":"d","label":"buy a June 30 put, sell a September 30 put"},{"id":"e","label":"none of the above"}]'::jsonb,
 '"a"'::jsonb,
 'Synthetic Long Call = Long Put + Long Stock (by put-call parity: C = P + S - K)',
 'option_characteristics'),

-- Q13: MCQ
('A trader would like to buy a March 110 put (delta 70, multiplier 100). Assuming there are no restrictions on the short sale of stock, which of the following strategies might he consider?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"buy a March 110 call, buy 100 stocks"},{"id":"b","label":"buy a March 110 call, sell 100 stocks"},{"id":"c","label":"buy a March 110 call, sell 70 stocks"},{"id":"d","label":"buy a March 110 call, buy 30 stocks"},{"id":"e","label":"none of the above"}]'::jsonb,
 '"b"'::jsonb,
 'Synthetic Long Put = Long Call + Short Stock (by put-call parity: P = C - S + K)',
 'option_characteristics'),

-- Q14: MCQ
('A trader would like to sell a July 80 put (delta 50, multiplier 100). Assuming there are no restrictions on the short sale of stock, which of the following strategies might he consider?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"sell a July 80 call, buy 100 stocks"},{"id":"b","label":"buy a July 80 call, sell 100 stocks"},{"id":"c","label":"sell a July 80 call, buy 50 stocks"},{"id":"d","label":"buy a July 80 call, sell 50 stocks"},{"id":"e","label":"none of the above"}]'::jsonb,
 '"a"'::jsonb,
 'Short Put = Short Call + Long Stock (by put-call parity: -P = -C + S - K)',
 'option_characteristics'),

-- Q15: MCQ
('A trader would like to buy a December 150 straddle (multiplier 100). Assuming there are no restrictions on the short sale of stock, which of the following strategies might he consider?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"buy 2 December 150 puts, buy 100 stocks"},{"id":"b","label":"buy 1 December 150 call, buy 1 December 150 put"},{"id":"c","label":"buy 2 December 150 calls, sell 100 stocks"},{"id":"d","label":"all of the above"},{"id":"e","label":"none of the above"}]'::jsonb,
 '"d"'::jsonb,
 'Straddle = Call + Put. Can also be replicated as 2 Puts + Stock or 2 Calls - Stock via put-call parity.',
 'option_characteristics');

-- ========================================
-- Chapter 2: The Box and Pin Risk
-- Theme: box_pin_risk
-- ========================================

INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation, theme) VALUES

-- Q1: True/False → MCQ
('A trader who buys an Aug 135 call and an Aug 125 put, and sells an Aug 135 put and an Aug 125 call, has bought a box.',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"b"'::jsonb,
 'This position is actually a sold box: Synthetic Long at 135 + Synthetic Short at 125 = pay K2-K1 at expiry.',
 'box_pin_risk'),

-- Q2: True/False → MCQ
('A trader who sells a Jun 55 call and a Jun 45 put, and buys a Jun 55 put and a Jun 45 call, has sold a box.',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"b"'::jsonb,
 'This is actually a long box: Synthetic Long at 45 + Synthetic Short at 55 = receive 10 at expiry.',
 'box_pin_risk'),

-- Q3: MCQ
('Which of the following positions is a box?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"long Jul 45 call / long Jul 55 put / short Nov 45 call / short Nov 55 put"},{"id":"b","label":"long Jul 50 call / short Jul 50 put / short Jul 55 call / long Jul 55 put"},{"id":"c","label":"long Jul 55 call / short Jul 55 put / short stock"},{"id":"d","label":"short Jul 45 call / long Jul 55 call / long stock"},{"id":"e","label":"long Jul 55 call / short Jul 55 put / long stock"}]'::jsonb,
 '"b"'::jsonb,
 'Long 50 Call + Short 50 Put = Synthetic Long at 50. Short 55 Call + Long 55 Put = Synthetic Short at 55. Together = Box.',
 'box_pin_risk'),

-- Q4: True/False → MCQ
('A trader who sells a Feb 140 call and a Feb 145 put, and buys a Feb 140 put and a Feb 145 call, has sold a box.',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"a"'::jsonb,
 'Long 145 Call + Short 145 Put = Synthetic Long at 145. Long 140 Put + Short 140 Call = Synthetic Short at 140. Net: buy at 145, sell at 140 → lose 5 at expiry = sold box.',
 'box_pin_risk'),

-- Q5: MCQ
('If a trader has a large number of conversions or reversals, and expiration is approaching with the underlying market close to the strike, which strategy does he need to trade to reduce pin risk?',
 'derivatives', 2, 'mcq',
 '[{"id":"a","label":"straddle"},{"id":"b","label":"box"},{"id":"c","label":"vertical spread"},{"id":"d","label":"butterfly"},{"id":"e","label":"calendar spread"}]'::jsonb,
 '"b"'::jsonb,
 'Box trades are used to reduce pin risk when the market is near the strike at expiration.',
 'box_pin_risk'),

-- Q6: MCQ
('If interest rates are 7%, and there are 3 months remaining to expiration, and options are subject to stock-type settlement, the value of a 75/90 box is approximately:',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"14.74"},{"id":"b","label":"13.54"},{"id":"c","label":"14.34"},{"id":"d","label":"14.24"},{"id":"e","label":"13.74"}]'::jsonb,
 '"a"'::jsonb,
 'Box value = (K2-K1)(1-rt) = 15(1 - 0.07×0.25) = 15 × 0.9825 = 14.74',
 'box_pin_risk'),

-- Q7: True/False → MCQ
('Pin risk occurs when a trader is long an out-of-the-money option at expiration.',
 'derivatives', 2, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"b"'::jsonb,
 'Pin risk occurs when you are SHORT options with the strike near the market price at expiration, not long OTM options.',
 'box_pin_risk');

-- ========================================
-- Chapter 7: Rho
-- Theme: rho
-- ========================================

INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation, theme) VALUES

-- Q5: MCQ
('Which of the following strategies will be hurt by falling interest rates?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"long Nov 100 call / short Nov 100 put / short stock"},{"id":"b","label":"long Aug 100 call / short Aug 100 put / short Nov 100 call / long Nov 100 put"},{"id":"c","label":"long Nov 90 call / short Nov 90 put / short Nov 100 call / long Nov 100 put"},{"id":"d","label":"all of the above"},{"id":"e","label":"none of the above"}]'::jsonb,
 '"a"'::jsonb,
 'A reversal (long call, short put, short stock) earns interest on the short stock proceeds. Falling rates reduce this income.',
 'rho'),

-- Q6: True/False → MCQ
('A trader who does a conversion will usually be hurt by a decline in interest rates.',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"a"'::jsonb,
 'A conversion (long stock, long put, short call) involves paying interest to carry the long stock position. However, falling rates actually help reduce carrying costs, so this is tricky. The key is the initial pricing assumed higher rates.',
 'rho'),

-- Q7: True/False → MCQ
('If all other contract specifications are the same, an at-the-money option will have a greater absolute rho value than an out-of-the-money option.',
 'derivatives', 2, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"a"'::jsonb,
 'ATM options have the highest absolute rho because they are most sensitive to interest rate changes.',
 'rho'),

-- Q8: True/False → MCQ
('As an option goes more deeply into-the-money its rho will rise.',
 'derivatives', 2, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"a"'::jsonb,
 'Deep ITM options behave more like the underlying, making them more sensitive to interest rate changes (higher absolute rho).',
 'rho'),

-- Q9: MCQ
('With the underlying contract at 50.00, what is the relationship between the rho of a Jun 50 call and the rho of a Sep 55 call?',
 'derivatives', 4, 'mcq',
 '[{"id":"a","label":"the Jun 50 call has the greater rho"},{"id":"b","label":"the Sep 55 call has the greater rho"},{"id":"c","label":"the rhos are equal"},{"id":"d","label":"cannot be determined from the information given"},{"id":"e","label":"none of the above"}]'::jsonb,
 '"d"'::jsonb,
 'Jun 50 is ATM with shorter expiry, Sep 55 is OTM with longer expiry. The ATM factor increases rho but shorter time decreases it. Cannot be determined without more information.',
 'rho'),

-- Q10: MCQ
('If the carrying costs to expiration for a 10 point box are 0.85, and the 90/100 vertical put spread is trading for 5.50, then the 90/100 call vertical spread should be trading for approximately:',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"3.15"},{"id":"b","label":"4.50"},{"id":"c","label":"4.15"},{"id":"d","label":"3.85"},{"id":"e","label":"3.65"}]'::jsonb,
 '"e"'::jsonb,
 'Box value = (K2-K1) - carrying costs = 10 - 0.85 = 9.15. Call spread = Box - Put spread = 9.15 - 5.50 = 3.65',
 'rho'),

-- Q11: True/False → MCQ
('A trader who sells a box will usually be helped by a decline in interest rates.',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"b"'::jsonb,
 'Selling a box means receiving money now and paying the box value later. Lower rates mean lower discount, which hurts the seller.',
 'rho'),

-- Q12: True/False → MCQ
('A trader who is short stock option puts has a negative rho position.',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"True"},{"id":"b","label":"False"}]'::jsonb,
 '"b"'::jsonb,
 'Puts have negative rho. Being short puts gives positive rho (opposite sign).',
 'rho');

-- ========================================
-- Chapter 8: Position Analysis
-- Theme: position_analysis
-- ========================================

INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation, theme) VALUES

-- Q1: MCQ
('Suppose the underlying contract is trading at 74.00. If volatility rises, which of the following is likely to happen to a Dec 80 put?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"the option''s delta will rise (less negative)"},{"id":"b","label":"the option''s gamma will fall"},{"id":"c","label":"the option''s vega will rise"},{"id":"d","label":"all of the above"},{"id":"e","label":"none of the above"}]'::jsonb,
 '"d"'::jsonb,
 'When vol rises: ITM put delta moves toward -0.5 (rises), gamma peak broadens (individual gamma falls), vega increases for ITM options.',
 'position_analysis'),

-- Q2: MCQ
('Suppose the underlying contract is trading at 32.00. If the price of the underlying contract begins to rise, which of the following is likely to happen to an Oct 25 call?',
 'derivatives', 3, 'mcq',
 '[{"id":"a","label":"the option''s delta will rise"},{"id":"b","label":"the option''s gamma will fall"},{"id":"c","label":"the option''s vega will fall"},{"id":"d","label":"all of the above"},{"id":"e","label":"none of the above"}]'::jsonb,
 '"d"'::jsonb,
 'As the ITM call goes deeper ITM: delta approaches 1 (rises), gamma decreases, and vega decreases.',
 'position_analysis'),

-- Q3: MCQ
('Suppose a trader has a position with a negative delta, a negative gamma, and a positive vega. Which of the following scenarios will most help this trader''s position?',
 'derivatives', 4, 'mcq',
 '[{"id":"a","label":"A swift downward move with rising implied volatility"},{"id":"b","label":"A slow downward move with rising implied volatility"},{"id":"c","label":"A slow downward move with falling implied volatility"},{"id":"d","label":"A swift downward move with falling implied volatility"},{"id":"e","label":"No movement with falling implied volatility"}]'::jsonb,
 '"b"'::jsonb,
 'Negative delta → wants price to fall. Negative gamma → doesn''t want big moves (slow is better). Positive vega → wants vol to rise.',
 'position_analysis'),

-- Q4: MCQ
('Suppose a trader has a position that is delta neutral, has a positive gamma, and a positive vega. Which of the following scenarios will most help this trader''s position?',
 'derivatives', 4, 'mcq',
 '[{"id":"a","label":"A swift upward move with falling implied volatility"},{"id":"b","label":"No movement with falling implied volatility"},{"id":"c","label":"A swift downward move with falling implied volatility"},{"id":"d","label":"A swift upward move with rising implied volatility"},{"id":"e","label":"No movement with rising implied volatility"}]'::jsonb,
 '"d"'::jsonb,
 'Delta neutral → direction doesn''t matter. Positive gamma → wants big/swift moves. Positive vega → wants vol to rise.',
 'position_analysis'),

-- Q5: MCQ
('Suppose a trader has a position with a negative delta, a negative gamma, and a negative vega. Which of the following scenarios will most help this trader''s position?',
 'derivatives', 4, 'mcq',
 '[{"id":"a","label":"A swift downward move with rising implied volatility"},{"id":"b","label":"A slow downward move with falling implied volatility"},{"id":"c","label":"A slow downward move with rising implied volatility"},{"id":"d","label":"A swift downward move with falling implied volatility"},{"id":"e","label":"No movement with falling implied volatility"}]'::jsonb,
 '"b"'::jsonb,
 'Negative delta → wants price to fall. Negative gamma → wants slow moves. Negative vega → wants vol to fall.',
 'position_analysis'),

-- Q6: MCQ
('Suppose a trader has a position with a neutral delta, a positive gamma, and a negative vega. Which of the following scenarios will most HURT this trader''s position?',
 'derivatives', 4, 'mcq',
 '[{"id":"a","label":"A slow downward move with rising implied volatility"},{"id":"b","label":"A swift upward move with rising implied volatility"},{"id":"c","label":"A slow downward move with falling implied volatility"},{"id":"d","label":"A slow upward move with falling implied volatility"},{"id":"e","label":"No movement with falling implied volatility"}]'::jsonb,
 '"a"'::jsonb,
 'Positive gamma needs big moves (slow hurts). Negative vega is hurt by rising vol. Slow move + rising vol = worst combination.',
 'position_analysis'),

-- Q7: MCQ
('Suppose a trader has a position with a positive delta, a negative gamma, and a positive vega. Which of the following scenarios will most HURT this trader''s position?',
 'derivatives', 4, 'mcq',
 '[{"id":"a","label":"A swift upward move with rising implied volatility"},{"id":"b","label":"A slow downward move with falling implied volatility"},{"id":"c","label":"A swift downward move with falling implied volatility"},{"id":"d","label":"A slow upward move with rising implied volatility"},{"id":"e","label":"No movement with falling implied volatility"}]'::jsonb,
 '"c"'::jsonb,
 'Positive delta is hurt by price falling. Negative gamma is hurt by swift moves. Positive vega is hurt by falling vol.',
 'position_analysis'),

-- Q8: MCQ
('A trader has a position with the following sensitivities: delta = +515, gamma = +290, theta = -1.46, vega = +3.12. Which of the following scenarios will most help this trader?',
 'derivatives', 4, 'mcq',
 '[{"id":"a","label":"A fast downward move, falling implied volatility"},{"id":"b","label":"A fast upward move, rising implied volatility"},{"id":"c","label":"A fast upward move, falling implied volatility"},{"id":"d","label":"A fast downward move, rising implied volatility"},{"id":"e","label":"A slow upward move, rising implied volatility"}]'::jsonb,
 '"b"'::jsonb,
 'Positive delta → wants up. Positive gamma → wants fast moves. Positive vega → wants vol to rise. Best = fast up + rising vol.',
 'position_analysis'),

-- Q9: MCQ
('A trader has a position with the following sensitivities: delta = -600, gamma = +345, theta = -1.43, vega = +1.67. Which of the following scenarios will most HURT this trader?',
 'derivatives', 4, 'mcq',
 '[{"id":"a","label":"A slow upward move, falling implied volatility"},{"id":"b","label":"A fast downward move, falling implied volatility"},{"id":"c","label":"A fast upward move, falling implied volatility"},{"id":"d","label":"A fast downward move, rising implied volatility"},{"id":"e","label":"A slow upward move, rising implied volatility"}]'::jsonb,
 '"a"'::jsonb,
 'Negative delta is hurt by upward moves. Positive gamma needs fast moves (slow hurts). Positive vega is hurt by falling vol. Worst = slow up + falling vol.',
 'position_analysis');
