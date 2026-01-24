import { render, screen } from '@testing-library/react';
import NutrimentItem from './NutrimentItem';
import { describe, it, expect } from 'vitest';
import type { DatabaseExtended } from '../../types/databaseExtended';
import type { DonutGroupItem } from '../../utils/calcDonutGroups';

describe('NutrimentItem', () => {
  const mockDonutGroups: DonutGroupItem[] = [
    {
      name: 'Proteines',
      nameAbbr: 'Prot',
      unit: 'g',
      colorValue: 'red',
      unitDecimals: 1,
      value: 10.55,
      target: 50,
      textLines: ['Proteines', '10.6 / 50 g'],
      // other props not used in this component can be omitted or mocked if strictly typed
    } as unknown as DonutGroupItem
  ];

  const mockNutrimentsResume: DatabaseExtended = {
    // minimalist mock
    Proteines: 10.55,
    Calories: 100,
    nutrimentByCalorieVsAverage: {
       Proteines: 0.8, // Should result in grayscale 0.2
       Calories: 1
    }
  } as unknown as DatabaseExtended;

  it("renders correctly with given props", () => {
    render(
      <NutrimentItem
        colName="Proteines"
        donutGroups={mockDonutGroups}
        nutrimentsResume={mockNutrimentsResume}
        quantity={1}
      />
    );

    expect(screen.getByText("Prot")).toBeInTheDocument();
    expect(screen.getByText("10.6")).toBeInTheDocument(); // 10.55 fixed to 1 decimal
    expect(screen.getByText("g")).toBeInTheDocument();
  });

  it("calculates value with quantity correctly", () => {
    render(
      <NutrimentItem
        colName="Proteines"
        donutGroups={mockDonutGroups}
        nutrimentsResume={mockNutrimentsResume}
        quantity={2}
      />
    );

    // 10.55 * 2 = 21.1
    expect(screen.getByText("21.1")).toBeInTheDocument();
  });

  it("applies correct background color and grayscale via CSS variables", () => {
    const { container } = render(
      <NutrimentItem
        colName="Proteines"
        donutGroups={mockDonutGroups}
        nutrimentsResume={mockNutrimentsResume}
        quantity={1}
      />
    );

    const div = container.firstChild as HTMLElement;
    const style = div.style;

    expect(style.getPropertyValue("--bg-color")).toBe("red");
    // Grayscale: 1 - min(1, 0.8) = 0.2
    expect(parseFloat(style.getPropertyValue("--grayscale"))).toBeCloseTo(0.2);
  });

  it('renders nothing if nutrimentsResume is null', () => {
    const { container } = render(
      <NutrimentItem
        colName="Proteines"
        donutGroups={mockDonutGroups}
        nutrimentsResume={null}
        quantity={1}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
