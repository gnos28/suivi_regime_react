import { describe, it, expect } from "vitest";
import {
  convertJsonStringToDate,
  convertDateToString,
  removeAccents,
  parseMealLine,
  formatMealLine,
  formatQuantityDisplay,
} from "./utils";

describe("utils", () => {
  describe("convertJsonStringToDate", () => {
    it("converts ISO string to Date", () => {
      const input = "2023-01-01T00:00:00.000Z";
      const result = convertJsonStringToDate(input);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(input);
    });

    it("converts timestamp number to Date", () => {
      const input = 1672531200000; // 2023-01-01T00:00:00.000Z
      const result = convertJsonStringToDate(input);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(input);
    });
  });

  describe("convertDateToString", () => {
    it("formats date as DD/MM/YYYY", () => {
      // Note: Month is 0-indexed in JS Date constructor (0 = Jan)
      const date = new Date(2023, 0, 15);
      const result = convertDateToString(date);
      expect(result).toBe("15/01/2023");
    });

    it("pads single digits with zero", () => {
      const date = new Date(2023, 8, 5); // Sept 5th
      const result = convertDateToString(date);
      expect(result).toBe("05/09/2023");
    });
  });

  describe("removeAccents", () => {
    it('removes accents for "goûter"', () => {
      expect(removeAccents("goûter")).toBe("gouter");
    });

    it('removes accents for "nausées"', () => {
      expect(removeAccents("nausées")).toBe("nausees");
    });

    it("returns original string for other inputs", () => {
      expect(removeAccents("matin")).toBe("matin");
      expect(removeAccents("ballonnements")).toBe("ballonnements");
      const arbitraryString = "someString" as any;
      expect(removeAccents(arbitraryString)).toBe("someString");
    });
  });

  describe("parseMealLine", () => {
    it("parses line with quantity", () => {
      expect(parseMealLine("[2] Apple")).toEqual({
        quantity: 2,
        text: "Apple",
      });
      expect(parseMealLine("[0.5] Milk")).toEqual({
        quantity: 0.5,
        text: "Milk",
      });
    });

    it("parses line without quantity", () => {
      expect(parseMealLine("Apple")).toEqual({
        quantity: 1,
        text: "Apple",
      });
    });

    it("handles extra spaces", () => {
      expect(parseMealLine(" [2]  Apple ")).toEqual({
        quantity: 2,
        text: "Apple",
      });
    });
  });

  describe("formatMealLine", () => {
    it("formats with quantity", () => {
      expect(formatMealLine(2, "Apple")).toBe("[2] Apple");
      expect(formatMealLine(0.5, "Milk")).toBe("[0.5] Milk");
    });

    it("formats without quantity when quantity is 1", () => {
      expect(formatMealLine(1, "Apple")).toBe("Apple");
    });
  });

  describe("formatQuantityDisplay", () => {
    it('returns empty string for quantity 1', () => {
      expect(formatQuantityDisplay(1)).toBe("");
    });

    it("formats as percentage for quantity < 1", () => {
      expect(formatQuantityDisplay(0.5)).toBe("50%");
      expect(formatQuantityDisplay(0.25)).toBe("25%");
    });

    it("formats as multiplier for quantity > 1", () => {
      expect(formatQuantityDisplay(2)).toBe("x2");
      expect(formatQuantityDisplay(1.5)).toBe("x1.5");
    });
  });
});
