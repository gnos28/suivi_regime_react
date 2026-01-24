import { describe, it, expect } from 'vitest';
import { calcCarences } from './calcCarences';
import type { DatabaseColName } from '../types/globales';

describe('calcCarences', () => {
  const database: Record<DatabaseColName, string | number | undefined>[] = [
    { aliment: 'Orange', "Vitamine C": 50, Calories: 45 },
    { aliment: 'Steak', "Proteines": 25, "Fer": 2.5, Calories: 200 },
  ];

  const targets = [
    { targetName: 'Vitamine C', min: '80' }, // deficient if < 80
    { targetName: 'Proteines', min: '50' }, // deficient if < 50
    { targetName: 'Fer', min: '10' },      // deficient if < 10
  ];

  it('calculates deficiencies correctly', () => {
    // Orange provides 50 Vit C. Target 80. Ratio 50/80 = 0.625. Deficient.
    // Steak provides 25 Prot. Target 50. Ratio 0.5. Deficient.
    const selectedSuiviDay = {
      matin: 'Orange',
      midi: 'Steak',
    };

    const result = calcCarences({
      selectedSuiviDay,
      targets,
      database,
      dayTimes: ['matin', 'midi']
    });

    // Should contain Vit C and Proteines and Fer
    // Fer: 2.5 / 10 = 0.25 (most deficient)
    // Proteines: 25 / 50 = 0.5
    // Vit C: 50 / 80 = 0.625

    expect(result).toHaveLength(3);
    
    // Ordered by deficiency severity (lowest carence ratio first)
    expect(result[0].nutriment).toBe('Fer');
    expect(result[0].carence).toBe(0.25);

    expect(result[1].nutriment).toBe('Proteines');
    expect(result[1].carence).toBe(0.5);

    expect(result[2].nutriment).toBe('Vitamine C');
    expect(result[2].carence).toBe(0.625);
  });

  it('handles unknown food items', () => {
    const selectedSuiviDay = {
      matin: 'UnknownFood',
    };
    const result = calcCarences({
      selectedSuiviDay,
      targets,
      database,
    });
    // Values will be 0. Carence will be 0/Target = 0.
    // Should return all targeted nutrients as highly deficient (ratio 0)
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].carence).toBe(0);
  });

  it('does not return non-deficient items', () => {
     // Eating 2 Oranges: 100 Vit C. Target 80. Ratio 1.25. Not deficient.
     const selectedSuiviDay = {
       matin: 'Orange\nOrange',
     };
     const result = calcCarences({
       selectedSuiviDay,
       targets: [{ targetName: 'Vitamine C', min: '80' }],
       database
     });
     expect(result).toHaveLength(0);
  });
});
