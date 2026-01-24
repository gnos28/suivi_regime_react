import { describe, it, expect } from 'vitest';
import { calcColumnTotal } from './calcColumnTotal';
import type { DatabaseColName } from '../types/globales';

describe('calcColumnTotal', () => {
  const database: Record<DatabaseColName, string | number | undefined>[] = [
    {
      aliment: 'Apple',
      Calories: 50,
      'Oméga-3': 10,
      'Oméga-6': 20,
      'fibre solubles': 2,
      'fibres insolubles': 4,
    },
    {
      aliment: 'Banana',
      Calories: 100,
      'Oméga-3': 5,
      'Oméga-6': 2,
      'fibre solubles': 1,
      'fibres insolubles': 1,
    },
    {
      aliment: 'Water',
      Calories: 0,
      'Oméga-3': 0,
      'Oméga-6': 0,
      'fibre solubles': 0,
      'fibres insolubles': 0,
    }
  ] as unknown as Record<DatabaseColName, string | number | undefined>[];

  it('calculates total for a simple column', () => {
    const periods = ['Apple', 'Banana']; // 50 + 100 = 150
    const calculate = calcColumnTotal({ periods, database });
    expect(calculate('Calories')).toBe(150);
  });

  it('handles multiple items in one period string', () => {
    const periods = ['Apple\nBanana']; // 50 + 100 = 150
    const calculate = calcColumnTotal({ periods, database });
    expect(calculate('Calories')).toBe(150);
  });

  it('handles periods with unknown items', () => {
    const periods = ['Apple', 'UnknownFood']; // 50 + 0 = 50
    const calculate = calcColumnTotal({ periods, database });
    expect(calculate('Calories')).toBe(50);
  });

  it('calculates ratio for soluble / insoluble', () => {
    const periods = ['Apple', 'Banana'];
    // Soluble: 2 + 1 = 3
    // Insoluble: 4 + 1 = 5
    // Ratio: 3 / 5 = 0.6
    const calculate = calcColumnTotal({ periods, database });
    expect(calculate('soluble / insoluble')).toBe(0.6);
  });

  it('calculates ratio for Ω3 / Ω6', () => {
    const periods = ['Apple', 'Banana'];
    // Omega-3: 10 + 5 = 15
    // Omega-6: 20 + 2 = 22
    // Ratio: 15 / 22 ~= 0.6818
    const calculate = calcColumnTotal({ periods, database });
    expect(calculate('Ω3 / Ω6')).toBeCloseTo(0.6818, 4);
  });

  it('handles division by zero (returns 0 instead of Infinity/NaN if logic dictates, or lets see implementation)', () => {
    // Logic uses avoidNaN which checks isNaN.
    // loops return 0 if empty.
    // 0/0 is NaN -> returns 0.
    const periods = ['Water'];
    const calculate = calcColumnTotal({ periods, database });
    // Should be 0 / 0
    expect(calculate('soluble / insoluble')).toBe(0);
  });
  
  it('is case insensitive', () => {
     const periods = ['apple'];
     const calculate = calcColumnTotal({ periods, database });
     expect(calculate('Calories')).toBe(50);
  });
});
