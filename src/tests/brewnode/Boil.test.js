import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
jest.mock('../../App.js', () => ({
  MyContext: mockReact.createContext({ 
    inProgress: '', 
    setInProgress: jest.fn() 
  })
}));

// Mock server API
jest.mock('../../brewnode/server-api.js', () => ({
  boil: jest.fn()
}));

// Mock socket listener
jest.mock('../../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn()
}));

// Mock Toggle component
jest.mock('../../common/Toggle.jsx', () => {
  return function MockToggle({ displayName, disabled, onClick, width, height, borderRadius }) {
    return (
      <button 
        data-testid="toggle-button"
        disabled={disabled}
        onClick={onClick}
        style={{ width, height, borderRadius }}
      >
        {displayName}
      </button>
    );
  };
});

const Boil = require('../../brewnode/Boil.jsx').default;
const { boil } = require('../../brewnode/server-api.js');
const { addSocketListener } = require('../../brewnode/socketListener.js');
const { MyContext } = require('../../App.js');

describe('Boil Component', () => {
  const mockSetInProgress = jest.fn();
  
  const renderBoil = (contextValue = {}) => {
    const defaultContext = {
      inProgress: '',
      setInProgress: mockSetInProgress,
      ...contextValue
    };

    return render(
      <MyContext.Provider value={defaultContext}>
        <Boil />
      </MyContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    boil.mockResolvedValue({ data: 'Boil started' });
    
    // Mock console.error to reduce test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crashing', () => {
    renderBoil();
    expect(screen.getByText('Boil')).toBeInTheDocument();
  });

  test('renders slider with correct initial value', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('0');
  });

  test('slider has correct properties', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-label', 'Boil Minutes');
    expect(slider).toHaveAttribute('max', '90');
    expect(slider).toHaveAttribute('step', '5');
  });

  test('displays correct slider marks', () => {
    renderBoil();
    expect(screen.getByText('0m')).toBeInTheDocument();
    expect(screen.getByText('30m')).toBeInTheDocument();
    expect(screen.getByText('60m')).toBeInTheDocument();
    expect(screen.getByText('90m')).toBeInTheDocument();
  });

  test('updates slider value when changed', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '60' } });
    
    expect(slider).toHaveValue('60');
  });

  test('boil button is enabled when not in progress', () => {
    renderBoil({ inProgress: '' });
    const button = screen.getByTestId('toggle-button');
    expect(button).not.toBeDisabled();
  });

  test('boil button is disabled when in progress (string)', () => {
    renderBoil({ inProgress: 'Boiling in progress' });
    const button = screen.getByTestId('toggle-button');
    expect(button).toBeDisabled();
  });

  test('slider is disabled when in progress (numeric)', () => {
    renderBoil({ inProgress: 45 });
    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
  });

  test('slider is enabled when not in progress (string)', () => {
    renderBoil({ inProgress: '' });
    const slider = screen.getByRole('slider');
    expect(slider).not.toBeDisabled();
  });

  test('calls boil API when button clicked', async () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    const button = screen.getByTestId('toggle-button');
    
    // Set slider to 60 minutes
    fireEvent.change(slider, { target: { value: '60' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(boil).toHaveBeenCalledWith(60);
    });
  });

  test('calls boil API with current slider value', async () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    const button = screen.getByTestId('toggle-button');
    
    // Set slider to 30 minutes
    fireEvent.change(slider, { target: { value: '30' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(boil).toHaveBeenCalledWith(30);
    });
  });

  test('handles successful boil operation', async () => {
    boil.mockResolvedValue({ data: 'Boil process started successfully' });
    renderBoil();
    
    const button = screen.getByTestId('toggle-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(boil).toHaveBeenCalledWith(0);
    });
  });

  test('handles boil API error correctly', async () => {
    const mockError = new Error('Boil controller error');
    boil.mockRejectedValue(mockError);
    
    renderBoil();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith(mockError);
    });
    
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  test('sets up socket listener for remaining boil minutes', () => {
    renderBoil();
    
    expect(addSocketListener).toHaveBeenCalledWith('remainingBoilMinutes', expect.any(Function));
  });

  test('updates minutes through socket listener', async () => {
    renderBoil();
    
    // Get the handler function that was passed to addSocketListener
    const handler = addSocketListener.mock.calls[0][1];
    
    // Simulate socket data
    act(() => {
      handler({ value: 45 });
    });
    
    await waitFor(() => {
      const slider = screen.getByRole('slider');
      expect(slider).toHaveValue('45');
    });
  });

  test('component renders with box container', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  test('slider renders correctly', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('type', 'range');
  });

  test('toggle button has correct properties', () => {
    renderBoil();
    const button = screen.getByTestId('toggle-button');
    expect(button).toHaveStyle('width: 95%');
    expect(button).toHaveStyle('height: 60%');
    expect(button).toHaveStyle('border-radius: 0%');
  });

  test('slider value updates correctly with step increment', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    
    // Test step increment (should be 5-minute increments)
    fireEvent.change(slider, { target: { value: '25' } });
    expect(slider).toHaveValue('25');
    
    fireEvent.change(slider, { target: { value: '85' } });
    expect(slider).toHaveValue('85');
  });

  test('handles slider value at maximum', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '90' } });
    expect(slider).toHaveValue('90');
  });

  test('handles slider value at minimum', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '0' } });
    expect(slider).toHaveValue('0');
  });

  test('displays value label on slider', () => {
    renderBoil();
    const slider = screen.getByRole('slider');
    
    // Check that slider is rendered correctly
    expect(slider).toBeInTheDocument();
  });

  test('calls boil with zero when no slider change', async () => {
    renderBoil();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(boil).toHaveBeenCalledWith(0);
    });
  });

  test('socket listener updates state correctly', async () => {
    renderBoil();
    
    const handler = addSocketListener.mock.calls[0][1];
    
    // Test various socket values
    act(() => {
      handler({ value: 15 });
    });
    
    await waitFor(() => {
      expect(screen.getByRole('slider')).toHaveValue('15');
    });
    
    act(() => {
      handler({ value: 75 });
    });
    
    await waitFor(() => {
      expect(screen.getByRole('slider')).toHaveValue('75');
    });
  });

  test('error from boil API returns error object', async () => {
    const mockError = new Error('Network failure');
    boil.mockRejectedValue(mockError);
    
    renderBoil();
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });
});