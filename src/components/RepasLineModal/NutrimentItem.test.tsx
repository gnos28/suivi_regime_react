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

  it('renders correctly with given props', () => {
    render(
      <NutrimentItem
        colName="Proteines"
        donutGroups={mockDonutGroups}
        nutrimentsResume={mockNutrimentsResume}
      />
    );

    expect(screen.getByText('Prot')).toBeInTheDocument();
    expect(screen.getByText('10.6')).toBeInTheDocument(); // 10.55 fixed to 1 decimal
    expect(screen.getByText('g')).toBeInTheDocument();
  });

  it('applies correct background color and grayscale', () => {
    const { container } = render(
      <NutrimentItem
        colName="Proteines"
        donutGroups={mockDonutGroups}
        nutrimentsResume={mockNutrimentsResume}
      />
    );

    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle('background-color: rgb(255, 0, 0)'); // red
    // Grayscale: 1 - min(1, 0.8) = 0.2
    // Handle floating point precision issues
    const style = window.getComputedStyle(div);
    const filter = style.getPropertyValue('filter');
    // grayscale(0.2) or grayscale(0.19999...)
    const match = filter.match(/grayscale\(([\d\.]+)\)/);
    expect(match).not.toBeNull();
    if (match) {
        expect(parseFloat(match[1])).toBeCloseTo(0.2);
    }
  });

  it('renders nothing if nutrimentsResume is null', () => {
    const { container } = render(
      <NutrimentItem
        colName="Proteines"
        donutGroups={mockDonutGroups}
        nutrimentsResume={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
