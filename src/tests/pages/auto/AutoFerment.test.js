import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb) { this.cb = cb; }
  observe() { this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this); }
  unobserve() {}
  disconnect() {}
};

// Mock App context
const mockReact = require('react');
jest.mock('../../../App.js', () => ({
  MyContext: mockReact.createContext({ 
    inProgress: '', 
    setInProgress: jest.fn() 
  })
}));

// Mock server API
jest.mock('../../../brewnode/server-api.js', () => ({
  ferment: jest.fn()
}));

// Mock Toggle component
jest.mock('../../../common/Toggle.jsx', () => {
  return function MockToggle({ displayName, disabled, onClick, children }) {
    return (
      <button 
        data-testid="toggle-button"
        disabled={disabled}
        onClick={onClick}
      >
        {children || displayName}
      </button>
    );
  };
});

const AutoFerment = require('../../../pages/auto/AutoFerment').default;
const { ferment } = require('../../../brewnode/server-api.js');
const { MyContext } = require('../../../App.js');

describe('AutoFerment Component', () => {
  const mockSetInProgress = jest.fn();
  
  const mockRecipe = {
    fermentation: {
      steps: [
        { name: 'Primary', stepTemp: 18, stepTime: 7, ramp: 0 },
        { name: 'Secondary', stepTemp: 20, stepTime: 14, ramp: 2 }
      ]
    }
  };

  const renderAutoFerment = (props = {}) => {
    const defaultProps = {
      recipe: mockRecipe,
      ...props
    };

    return render(
      <MyContext.Provider value={{ inProgress: '', setInProgress: mockSetInProgress }}>
        <AutoFerment {...defaultProps} />
      </MyContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ferment.mockResolvedValue({ data: 'Fermentation started' });
    
    // Mock console.error to reduce test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('renders without crashing', () => {
    renderAutoFerment();
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('renders with empty recipe', () => {
    renderAutoFerment({ recipe: null });
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('renders fermentation steps from recipe', () => {
    renderAutoFerment();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  test('displays step details correctly', () => {
    renderAutoFerment();
    expect(screen.getByText('18°C for 7d')).toBeInTheDocument();
    expect(screen.getByText('(ramp 2d) 20°C for 14d')).toBeInTheDocument();
  });

  test('ferment button is enabled when not in progress', () => {
    renderAutoFerment();
    const button = screen.getByTestId('toggle-button');
    expect(button).not.toBeDisabled();
  });

  test('ferment button is disabled when in progress', () => {
    render(
      <MyContext.Provider value={{ inProgress: 'Fermenting...', setInProgress: mockSetInProgress }}>
        <AutoFerment recipe={mockRecipe} />
      </MyContext.Provider>
    );
    const button = screen.getByTestId('toggle-button');
    expect(button).toBeDisabled();
  });

  test('calls ferment API when button clicked', async () => {
    renderAutoFerment();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(ferment).toHaveBeenCalled();
    });
  });

  test('sets progress message when starting fermentation', async () => {
    renderAutoFerment();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('Fermenting ...');
    });
  });

  test('clears progress message on successful fermentation start', async () => {
    ferment.mockResolvedValue({ data: 'Success' });
    
    renderAutoFerment();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('');
    });
  });

  test('handles ferment API error correctly', async () => {
    const mockError = new Error('Fermentation controller error');
    ferment.mockRejectedValue(mockError);
    
    renderAutoFerment();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  test('does not call API when no steps are available', async () => {
    renderAutoFerment({ recipe: { fermentation: { steps: [] } } });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    // Wait a bit to ensure no API call is made
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(ferment).not.toHaveBeenCalled();
  });

  test('handles recipe without fermentation steps', () => {
    renderAutoFerment({ recipe: {} });
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('handles recipe with undefined fermentation', () => {
    renderAutoFerment({ recipe: { fermentation: undefined } });
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('processes single step correctly', () => {
    const singleStepRecipe = {
      fermentation: {
        steps: [
          { name: 'Primary Only', stepTemp: 19, stepTime: 14, ramp: 0 }
        ]
      }
    };
    
    renderAutoFerment({ recipe: singleStepRecipe });
    expect(screen.getByText('Primary Only')).toBeInTheDocument();
    expect(screen.getByText('19°C for 14d')).toBeInTheDocument();
  });

  test('processes ramp steps correctly', () => {
    const rampRecipe = {
      fermentation: {
        steps: [
          { name: 'Ramp Test', stepTemp: 22, stepTime: 10, ramp: 5 }
        ]
      }
    };
    
    renderAutoFerment({ recipe: rampRecipe });
    expect(screen.getByText('Ramp Test')).toBeInTheDocument();
    expect(screen.getByText('(ramp 5d) 22°C for 10d')).toBeInTheDocument();
  });

  test('handles zero ramp correctly', () => {
    const zeroRampRecipe = {
      fermentation: {
        steps: [
          { name: 'No Ramp', stepTemp: 18, stepTime: 7, ramp: 0 }
        ]
      }
    };
    
    renderAutoFerment({ recipe: zeroRampRecipe });
    expect(screen.getByText('No Ramp')).toBeInTheDocument();
    expect(screen.getByText('18°C for 7d')).toBeInTheDocument();
  });

  test('handles null ramp correctly', () => {
    const nullRampRecipe = {
      fermentation: {
        steps: [
          { name: 'Null Ramp', stepTemp: 18, stepTime: 7, ramp: null }
        ]
      }
    };
    
    renderAutoFerment({ recipe: nullRampRecipe });
    expect(screen.getByText('Null Ramp')).toBeInTheDocument();
    expect(screen.getByText('18°C for 7d')).toBeInTheDocument();
  });

  test('button shows correct text', () => {
    renderAutoFerment();
    const button = screen.getByTestId('toggle-button');
    expect(button).toHaveTextContent('Ferment');
  });

  test('table renders with correct structure', () => {
    renderAutoFerment();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});