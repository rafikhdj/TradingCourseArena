-- ================================================
-- Market Making Scenarios Table
-- ================================================

CREATE TABLE IF NOT EXISTS market_making_scenarios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  question text NOT NULL,
  real_value numeric NOT NULL,
  unit text DEFAULT '',
  category text NOT NULL CHECK (category IN ('fact', 'guesstimate')),
  predefined_spread numeric DEFAULT 20,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE market_making_scenarios ENABLE ROW LEVEL SECURITY;

-- Everyone can read scenarios
CREATE POLICY "Anyone can read scenarios"
  ON market_making_scenarios FOR SELECT
  USING (true);

-- ================================================
-- Sample scenarios to get started
-- ================================================

INSERT INTO market_making_scenarios (title, question, real_value, unit, category, predefined_spread) VALUES
('Eiffel Tower', 'What is the height of the Eiffel Tower in meters (to the tip)?', 330, 'meters', 'fact', 20),
('Golden Gate Bridge', 'What is the total length of the Golden Gate Bridge in meters?', 2737, 'meters', 'fact', 20),
('Great Pyramid of Giza', 'What was the original height of the Great Pyramid of Giza in meters?', 146, 'meters', 'fact', 20),
('Lake Baikal', 'What is the maximum depth of Lake Baikal in meters?', 1642, 'meters', 'fact', 20),
('Trans-Siberian Railway', 'What is the length of the Trans-Siberian Railway in kilometers?', 9289, 'km', 'fact', 20),
('Mount Everest', 'What is the height of Mount Everest in meters?', 8849, 'meters', 'fact', 15),
('Amazon River', 'What is the approximate length of the Amazon River in kilometers?', 6400, 'km', 'guesstimate', 20),
('Fort Knox Gold', 'How many metric tons of gold are stored at Fort Knox (approximately)?', 4580, 'metric tons', 'guesstimate', 25),
('Louvre Visitors', 'How many visitors did the Louvre receive in 2019 in millions?', 9.6, 'millions', 'guesstimate', 20),
('Las Vegas High Roller', 'What is the height of the Las Vegas High Roller Ferris wheel in meters?', 168, 'meters', 'fact', 20),
('Ostrich Speed', 'What is the top speed of an ostrich in km/h?', 70, 'km/h', 'fact', 20),
('Coffee Production', 'How many millions of 60kg bags of coffee does Brazil produce annually (approximately)?', 63, 'millions of bags', 'guesstimate', 25);
