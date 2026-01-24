import { describe, it, expect } from 'vitest';
import { cleanPhotoDescription } from './textUtils';

describe('textUtils', () => {
  describe('cleanPhotoDescription', () => {
    it('trims whitespace', () => {
      expect(cleanPhotoDescription('  hello  ')).toBe('hello');
    });

    it('removes trailing period', () => {
      expect(cleanPhotoDescription('hello.')).toBe('hello');
    });

    it('removes trailing period and trims', () => {
      expect(cleanPhotoDescription('  hello.  ')).toBe('hello');
    });

    it('keeps internal periods', () => {
      expect(cleanPhotoDescription('hello. world.')).toBe('hello. world');
    });
    
    it('handles empty string', () => {
        expect(cleanPhotoDescription('')).toBe('');
    });
  });
});
