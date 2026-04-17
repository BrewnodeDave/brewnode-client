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
  mash: jest.fn()
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

const AutoMash = require('../../../pages/auto/AutoMash').default;
const { mash } = require('../../../brewnode/server-api.js');
const { MyContext } = require('../../../App.js');

describe('AutoMash Component', () => {
  const mockSetInProgress = jest.fn();
  
  const mockRecipe = {
    mash: {
      steps: [
        { name: 'Protein Rest', stepTemp: 50, stepTime: 15 },
        { name: 'Saccharification', stepTemp: 65, stepTime: 60 },
        { name: 'Mash Out', stepTemp: 75, stepTime: 10 }
      ]
    }
  };

  const renderAutoMash = (props = {}) => {
    const defaultProps = {
      recipe: mockRecipe,
      ...props
    };

    return render(
      <MyContext.Provider value={{ inProgress: '', setInProgress: mockSetInProgress }}>
        <AutoMash {...defaultProps} />
      </MyContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mash.mockResolvedValue({ data: 'Mash started' });
    
    // Mock console.error to reduce test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('renders without crashing', () => {
    renderAutoMash();
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('renders with empty recipe', () => {
    renderAutoMash({ recipe: null });
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('renders mash steps from recipe', () => {
    renderAutoMash();
    expect(screen.getByText('Protein Rest')).toBeInTheDocument();
    expect(screen.getByText('Saccharification')).toBeInTheDocument();
    expect(screen.getByText('Mash Out')).toBeInTheDocument();
  });

  test('displays step details correctly', () => {
    renderAutoMash();
    expect(screen.getByText('50°C for 15m')).toBeInTheDocument();
    expect(screen.getByText('65°C for 60m')).toBeInTheDocument();
    expect(screen.getByText('75°C for 10m')).toBeInTheDocument();
  });

  test('mash button is enabled when not in progress', () => {
    renderAutoMash();
    const button = screen.getByTestId('toggle-button');
    expect(button).not.toBeDisabled();
  });

  test('mash button is disabled when in progress', () => {
    render(
      <MyContext.Provider value={{ inProgress: 'Mashing...', setInProgress: mockSetInProgress }}>
        <AutoMash recipe={mockRecipe} />
      </MyContext.Provider>
    );
    const button = screen.getByTestId('toggle-button');
    expect(button).toBeDisabled();
  });

  test('calls mash API with correct steps when button clicked', async () => {
    renderAutoMash();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mash).toHaveBeenCalledWith([
        { tempC: 50, mins: 15 },
        { tempC: 65, mins: 60 },
        { tempC: 75, mins: 10 }
      ], true);
    });
  });

  test('sets progress message when starting mash', async () => {
    renderAutoMash();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('Mashing ...');
    });
  });

  test('clears progress message on successful mash start', async () => {
    mash.mockResolvedValue({ data: 'Success' });
    
    renderAutoMash();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('');
    });
  });

  test('handles mash API error correctly', async () => {
    const mockError = new Error('Mash controller error');
    mash.mockRejectedValue(mockError);
    
    renderAutoMash();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  test('does not call API when no steps are available', async () => {
    renderAutoMash({ recipe: { mash: { steps: [] } } });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    // Wait a bit to ensure no API call is made
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mash).not.toHaveBeenCalled();
  });

  test('handles recipe without mash steps', () => {
    renderAutoMash({ recipe: {} });
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('handles recipe with undefined mash', () => {
    renderAutoMash({ recipe: { mash: undefined } });
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('processes single step correctly', () => {
    const singleStepRecipe = {
      mash: {
        steps: [
          { name: 'Single Infusion', stepTemp: 67, stepTime: 60 }
        ]
      }
    };
    
    renderAutoMash({ recipe: singleStepRecipe });
    expect(screen.getByText('Single Infusion')).toBeInTheDocument();
    expect(screen.getByText('67°C for 60m')).toBeInTheDocument();
  });

  test('handles steps with zero values', () => {
    const zeroValueRecipe = {
      mash: {
        steps: [
          { name: 'Zero Test', stepTemp: 0, stepTime: 0 }
        ]
      }
    };
    
    renderAutoMash({ recipe: zeroValueRecipe });
    expect(screen.getByText('Zero Test')).toBeInTheDocument();
    expect(screen.getByText('0°C for 0m')).toBeInTheDocument();
  });

  test('transforms steps correctly for API call', async () => {
    const testRecipe = {
      mash: {
        steps: [
          { name: 'Test 1', stepTemp: 55, stepTime: 20 },
          { name: 'Test 2', stepTemp: 70, stepTime: 45 }
        ]
      }
    };
    
    renderAutoMash({ recipe: testRecipe });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mash).toHaveBeenCalledWith([
        { tempC: 55, mins: 20 },
        { tempC: 70, mins: 45 }
      ], true);
    });
  });

  test('button shows correct text', () => {
    renderAutoMash();
    const button = screen.getByTestId('toggle-button');
    expect(button).toHaveTextContent('Mash');
  });

  test('table renders with correct structure', () => {
    renderAutoMash();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('handles undefined step properties gracefully', () => {
    const undefinedStepRecipe = {
      mash: {
        steps: [
          { name: 'Undefined Test', stepTemp: undefined, stepTime: undefined }
        ]
      }
    };
    
    renderAutoMash({ recipe: undefinedStepRecipe });
    expect(screen.getByText('Undefined Test')).toBeInTheDocument();
    expect(screen.getByText('undefined°C for undefinedm')).toBeInTheDocument();
  });
});