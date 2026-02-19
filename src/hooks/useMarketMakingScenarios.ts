import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { MarketMakingScenario } from '../types';

// Fallback scenarios if Supabase is empty or unavailable
const FALLBACK_SCENARIOS: MarketMakingScenario[] = [
  {
    id: 'fallback_1',
    title: 'Eiffel Tower',
    question: 'What is the height of the Eiffel Tower in meters (to the tip)?',
    real_value: 330,
    unit: 'meters',
    category: 'fact',
    predefined_spread: 20,
  },
  {
    id: 'fallback_2',
    title: 'Golden Gate Bridge',
    question: 'What is the total length of the Golden Gate Bridge in meters?',
    real_value: 2737,
    unit: 'meters',
    category: 'fact',
    predefined_spread: 20,
  },
  {
    id: 'fallback_3',
    title: 'Mount Everest',
    question: 'What is the height of Mount Everest in meters?',
    real_value: 8849,
    unit: 'meters',
    category: 'fact',
    predefined_spread: 15,
  },
  {
    id: 'fallback_4',
    title: 'Amazon River',
    question: 'What is the approximate length of the Amazon River in kilometers?',
    real_value: 6400,
    unit: 'km',
    category: 'guesstimate',
    predefined_spread: 20,
  },
  {
    id: 'fallback_5',
    title: 'Fort Knox Gold',
    question: 'How many metric tons of gold are stored at Fort Knox (approximately)?',
    real_value: 4580,
    unit: 'metric tons',
    category: 'guesstimate',
    predefined_spread: 25,
  },
  {
    id: 'fallback_6',
    title: 'Ostrich Speed',
    question: 'What is the top speed of an ostrich in km/h?',
    real_value: 70,
    unit: 'km/h',
    category: 'fact',
    predefined_spread: 20,
  },
];

export const useMarketMakingScenarios = (category?: 'fact' | 'guesstimate') => {
  const [scenarios, setScenarios] = useState<MarketMakingScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        let query = supabase.from('market_making_scenarios').select('*');

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query.order('title');

        if (fetchError) {
          console.warn('Error fetching scenarios from Supabase:', fetchError.message);
          // Use fallback
          const filtered = category
            ? FALLBACK_SCENARIOS.filter(s => s.category === category)
            : FALLBACK_SCENARIOS;
          setScenarios(filtered);
        } else if (data && data.length > 0) {
          setScenarios(data as MarketMakingScenario[]);
        } else {
          // No data in Supabase, use fallback
          const filtered = category
            ? FALLBACK_SCENARIOS.filter(s => s.category === category)
            : FALLBACK_SCENARIOS;
          setScenarios(filtered);
        }
      } catch (err: any) {
        console.error('Error in useMarketMakingScenarios:', err);
        setError(err.message);
        // Use fallback
        const filtered = category
          ? FALLBACK_SCENARIOS.filter(s => s.category === category)
          : FALLBACK_SCENARIOS;
        setScenarios(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, [category]);

  return { scenarios, loading, error };
};
