-- Insert Derivatives questions
-- Run this in Supabase SQL Editor after updating the schema

INSERT INTO public.questions (statement, topic, difficulty, type, choices, answer, explanation)
VALUES
-- 1) Extrinsic value of a call
('A European call has strike K=50. The underlying is trading at S=52 and the call is priced at 4.00. What is the extrinsic value of the call?',
 'derivatives', 2, 'mcq',
 '[{"id":"a","label":"2.00"},{"id":"b","label":"4.00"},{"id":"c","label":"1.50"},{"id":"d","label":"0.00"}]'::jsonb,
 '"a"'::jsonb,
 'Intrinsic = max(S-K,0) = max(52-50,0) = 2.00. Extrinsic = premium - intrinsic = 4.00 - 2.00 = 2.00');

-- Add more questions here as needed

