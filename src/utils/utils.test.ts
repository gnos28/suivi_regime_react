import { describe, it, expect } from 'vitest';
import { convertJsonStringToDate, convertDateToString, removeAccents } from './utils';

describe('utils', () => {
  describe('convertJsonStringToDate', () => {
    it('converts ISO string to Date', () => {
      const input = '2023-01-01T00:00:00.000Z';
      const result = convertJsonStringToDate(input);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(input);
    });

    it('converts timestamp number to Date', () => {
      const input = 1672531200000; // 2023-01-01T00:00:00.000Z
      const result = convertJsonStringToDate(input);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(input);
    });
  });

  describe('convertDateToString', () => {
    it('formats date as DD/MM/YYYY', () => {
      // Note: Month is 0-indexed in JS Date constructor (0 = Jan)
      const date = new Date(2023, 0, 15); 
      const result = convertDateToString(date);
      expect(result).toBe('15/01/2023');
    });

    it('pads single digits with zero', () => {
      const date = new Date(2023, 8, 5); // Sept 5th
      const result = convertDateToString(date);
      expect(result).toBe('05/09/2023');
    });
  });

  describe('removeAccents', () => {
    it('removes accents for "goûter"', () => {
      expect(removeAccents('goûter')).toBe('gouter');
    });

    it('removes accents for "nausées"', () => {
      expect(removeAccents('nausées')).toBe('nausees');
    });

    it('returns original string for other inputs', () => {
      expect(removeAccents('matin')).toBe('matin');
      expect(removeAccents('ballonnements')).toBe('ballonnements');
      const arbitraryString = 'someString' as any;
      expect(removeAccents(arbitraryString)).toBe('someString');
    });
  });
});
