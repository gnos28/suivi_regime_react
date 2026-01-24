import { describe, it, expect } from 'vitest';
import { calcNutrimentGrayscale, isNutrimentRelevant } from './displayUtils';
import type { DatabaseExtended } from '../types/databaseExtended';

describe('displayUtils', () => {
  const mockDatabaseExtended = {
    nutrimentByCalorieVsAverage: {
      Proteines: 0.5, // 50% of average
      Lipides: 1.5,   // 150% of average
      Glucides: 0.1,  // 10% of average
    },
    nutrimentVsAverage: {
      Proteines: 0.5,
      Lipides: 1.5,
      Glucides: 0.1,
      Sodium: 0.3, // > 0.25 (relevant condition)
      Potassium: 0.1 // < 0.25 (irrelevant condition)
    },
    Calories: 100,
    Proteines: 10,
    Lipides: 5,
    Glucides: 2,
    Sodium: 50,
    Potassium: 20
  } as unknown as DatabaseExtended;

  describe('calcNutrimentGrayscale', () => {
    it('returns 0 for excluded columns', () => {
      expect(calcNutrimentGrayscale('aliment', mockDatabaseExtended)).toBe(0);
      expect(calcNutrimentGrayscale('Calories', mockDatabaseExtended)).toBe(0);
    });

    it('calculates grayscale based on nutriment density', () => {
      // 1 - min(1, 0.5) = 0.5
      expect(calcNutrimentGrayscale('Proteines', mockDatabaseExtended)).toBe(0.5);
      
      // 1 - min(1, 1.5) = 0
      expect(calcNutrimentGrayscale('Lipides', mockDatabaseExtended)).toBe(0);

       // 1 - min(1, 0.1) = 0.9
      expect(calcNutrimentGrayscale('Glucides', mockDatabaseExtended)).toBeCloseTo(0.9);
    });
  });

  describe('isNutrimentRelevant', () => {
    it('returns true for main macronutrients regardless of values', () => {
       // Values are present in mock
       expect(isNutrimentRelevant('Proteines', mockDatabaseExtended)).toBe(true);
       expect(isNutrimentRelevant('Lipides', mockDatabaseExtended)).toBe(true);
       expect(isNutrimentRelevant('Calories', mockDatabaseExtended)).toBe(true);
    });

    it('returns false if value is missing/zero/irrelevant', () => {
        const emptyMock = { ...mockDatabaseExtended, Zinc: 0 } as  unknown as DatabaseExtended;
        expect(isNutrimentRelevant('Zinc', emptyMock)).toBe(false);
    });

    it('returns true for other nutrients only if significant vs average or density', () => {
       // Sodium: nutrimentVsAverage is 0.3 (> 0.25) -> True condition 1
       // But also check calcCalorieVsAverage logic:
       // calcCalorieVsAverage checks density > 0.8
       
       // Code logic: return (MainMacros OR (vsAverage AND CalorieVsAverage))
       
       // Sodium: vsAverage(0.3 > 0.25) is true.
       // We need CalorieVsAverage to be true too.
       // Sodium density not in mock, assume undefined -> false.
       // So likely false.
       
       expect(isNutrimentRelevant('Sodium', mockDatabaseExtended)).toBe(false); 
       
       // Let's make a case where it is relevant.
       const relevantMock = {
           ...mockDatabaseExtended,
           nutrimentVsAverage: { ...mockDatabaseExtended.nutrimentVsAverage, MegNut: 1.0 },
           nutrimentByCalorieVsAverage: { ...mockDatabaseExtended.nutrimentByCalorieVsAverage, MegNut: 0.9 },
           MegNut: 100
       } as unknown as DatabaseExtended;
       
       // vsAverage (1.0 > 0.25) -> true
       // CalorieVsAverage (0.9 > 0.8) -> true
       expect(isNutrimentRelevant('MegNut' as any, relevantMock)).toBe(true);
    });
  });
});
