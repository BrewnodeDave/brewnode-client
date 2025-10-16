import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock GaugeChart component
jest.mock('react-gauge-chart', () => {
  return function MockGaugeChart({ percent, formatTextValue, nrOfLevels, textColor, animate }) {
    const formattedValue = formatTextValue ? formatTextValue(percent * 100) : `${percent * 100}%`;
    return (
      <div data-testid="gauge-chart">
        <div data-testid="gauge-percent">{percent}</div>
        <div data-testid="gauge-text">{formattedValue}</div>
        <div data-testid="gauge-levels">{nrOfLevels}</div>
        <div data-testid="gauge-color">{textColor}</div>
        <div data-testid="gauge-animate">{animate.toString()}</div>
      </div>
    );
  };
});

// Mock socket listener
jest.mock('../../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn(),
  removeSocketListener: jest.fn()
}));

const Power = require('../../brewnode/Power.jsx').default;
const { addSocketListener, removeSocketListener } = require('../../brewnode/socketListener.js');

describe('Power Component', () => {
  const defaultProps = {
    name: 'Power Monitor',
    min: 0,
    max: 3000
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPower = (props = {}) => {
    const finalProps = { ...defaultProps, ...props };
    return render(<Power {...finalProps} />);
  };

  test('renders without crashing', () => {
    renderPower();
    expect(screen.getByText('Power Monitor')).toBeInTheDocument();
  });

  test('sets up socket listener on mount', () => {
    renderPower();
    expect(addSocketListener).toHaveBeenCalledWith('Power', expect.any(Function));
  });

  test('removes socket listener on unmount', () => {
    const { unmount } = renderPower();
    const handler = addSocketListener.mock.calls[0][1];
    
    unmount();
    expect(removeSocketListener).toHaveBeenCalledWith('Power', handler);
  });

  test('displays min and max values', () => {
    renderPower({ min: 100, max: 2500 });
    // Check that both values exist somewhere in the document
    expect(screen.getByText('Power Monitor')).toBeInTheDocument();
    expect(document.body.textContent).toContain('100');
    expect(document.body.textContent).toContain('2500');
  });

  test('renders gauge chart with correct properties', () => {
    renderPower({ min: 0, max: 2000 });
    
    const gaugeChart = screen.getByTestId('gauge-chart');
    expect(gaugeChart).toBeInTheDocument();
    
    const levels = screen.getByTestId('gauge-levels');
    expect(levels).toHaveTextContent('10');
    
    const color = screen.getByTestId('gauge-color');
    expect(color).toHaveTextContent('black');
    
    const animate = screen.getByTestId('gauge-animate');
    expect(animate).toHaveTextContent('false');
  });

  test('initializes with minimum value as percentage', () => {
    renderPower({ min: 100, max: 1000 });
    
    // Component initializes percent state with props.min
    const percent = screen.getByTestId('gauge-percent');
    expect(percent).toHaveTextContent('100');
  });

  test('formats text value correctly', () => {
    renderPower({ min: 0, max: 2000 });
    
    // With initial state (percent = props.min = 0), formatTextValue should show 0W
    const text = screen.getByTestId('gauge-text');
    expect(text).toHaveTextContent('0W');
  });

  test('handles zero power reading', () => {
    renderPower({ min: 0, max: 1000 });
    
    const percent = screen.getByTestId('gauge-percent');
    expect(percent).toHaveTextContent('0');
    
    const text = screen.getByTestId('gauge-text');
    expect(text).toHaveTextContent('0W');
  });

  test('uses default range when props not provided', () => {
    renderPower();
    
    // Default props: min: 0, max: 3000
    expect(document.body.textContent).toContain('0');
    expect(document.body.textContent).toContain('3000');
  });

  test('component structure includes all required elements', () => {
    renderPower();
    
    // Should have title
    expect(screen.getByText('Power Monitor')).toBeInTheDocument();
    
    // Should have gauge chart
    expect(screen.getByTestId('gauge-chart')).toBeInTheDocument();
    
    // Should have percentage display
    expect(screen.getByTestId('gauge-percent')).toBeInTheDocument();
    
    // Should have text display
    expect(screen.getByTestId('gauge-text')).toBeInTheDocument();
  });
});