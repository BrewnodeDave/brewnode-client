import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Fill from '../../brewnode/Fill';
import { MyContext } from '../../App';

// Mock the server API
jest.mock('../../brewnode/server-api.js', () => ({
  fill: jest.fn()
}));

// Mock socket listener
jest.mock('../../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn()
}));

// Mock Toggle component
jest.mock('../../common/Toggle.jsx', () => {
  return function MockToggle({ displayName, disabled, onClick, ...props }) {
    return (
      <button
        data-testid="fill-toggle"
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {displayName}
      </button>
    );
  };
});

const { fill: mockFill } = require('../../brewnode/server-api.js');
const { addSocketListener } = require('../../brewnode/socketListener.js');

const theme = createTheme();

const renderWithContext = (component, contextValue = { inProgress: '', setInProgress: jest.fn() }) => {
  return render(
    <ThemeProvider theme={theme}>
      <MyContext.Provider value={contextValue}>
        {component}
      </MyContext.Provider>
    </ThemeProvider>
  );
};

describe('Fill Component', () => {
  const mockSetInProgress = jest.fn();
  const defaultContextValue = {
    inProgress: '',
    setInProgress: mockSetInProgress
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFill.mockResolvedValue({ data: 'success' });
  });

  test('renders with default values', () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByTestId('fill-toggle')).toBeInTheDocument();
    expect(screen.getByText('Fill')).toBeInTheDocument();
  });

  test('initializes slider with default litres value (19)', () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('19');
  });

  test('displays correct slider marks', () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    // Check for mark labels
    expect(screen.getByText('0L')).toBeInTheDocument();
    expect(screen.getByText('10L')).toBeInTheDocument();
    expect(screen.getByText('20L')).toBeInTheDocument();
    expect(screen.getByText('30L')).toBeInTheDocument();
    expect(screen.getByText('40L')).toBeInTheDocument();
    expect(screen.getByText('50L')).toBeInTheDocument();
  });

  test('updates slider value when changed', () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '25' } });
    
    expect(slider).toHaveValue('25');
  });

  test('calls fill function when toggle is clicked', async () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    const fillButton = screen.getByTestId('fill-toggle');
    fireEvent.click(fillButton);
    
    await waitFor(() => {
      expect(mockFill).toHaveBeenCalledWith(19); // default value
    });
  });

  test('calls fill function with updated slider value', async () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '30' } });
    
    const fillButton = screen.getByTestId('fill-toggle');
    fireEvent.click(fillButton);
    
    await waitFor(() => {
      expect(mockFill).toHaveBeenCalledWith(30);
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('Fill API Error');
    mockFill.mockRejectedValue(testError);
    
    renderWithContext(<Fill />, defaultContextValue);
    
    const fillButton = screen.getByTestId('fill-toggle');
    fireEvent.click(fillButton);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith(testError);
    });
    
    expect(consoleError).toHaveBeenCalledWith(testError);
    consoleError.mockRestore();
  });

  test('disables components when in progress (numeric)', () => {
    const contextWithProgress = {
      inProgress: 123, // numeric value indicates in progress
      setInProgress: mockSetInProgress
    };
    
    renderWithContext(<Fill />, contextWithProgress);
    
    const slider = screen.getByRole('slider');
    const fillButton = screen.getByTestId('fill-toggle');
    
    expect(slider).toBeDisabled();
    expect(fillButton).toBeDisabled();
  });

  test('enables components when not in progress (string)', () => {
    const contextWithoutProgress = {
      inProgress: 'idle', // string value indicates not in progress
      setInProgress: mockSetInProgress
    };
    
    renderWithContext(<Fill />, contextWithoutProgress);
    
    const slider = screen.getByRole('slider');
    const fillButton = screen.getByTestId('fill-toggle');
    
    expect(slider).not.toBeDisabled();
    expect(fillButton).not.toBeDisabled();
  });

  test('sets up socket listener for remaining fill litres', () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    expect(addSocketListener).toHaveBeenCalledWith(
      'remainingFillLitres',
      expect.any(Function)
    );
  });

  test('has correct slider properties', () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '50');
    expect(slider).toHaveAttribute('step', '1');
  });

  test('toggle button has correct properties', () => {
    renderWithContext(<Fill />, defaultContextValue);
    
    const fillButton = screen.getByTestId('fill-toggle');
    expect(fillButton).toHaveAttribute('borderRadius', '0%');
    expect(fillButton).toHaveAttribute('width', '96%');
    expect(fillButton).toHaveAttribute('height', '60%');
  });

  test('slider value updates through socket listener', async () => {
    let socketCallback;
    addSocketListener.mockImplementation((event, callback) => {
      if (event === 'remainingFillLitres') {
        socketCallback = callback;
      }
    });
    
    renderWithContext(<Fill />, defaultContextValue);
    
    // Simulate socket message
    act(() => {
      socketCallback(35);
    });
    
    await waitFor(() => {
      const slider = screen.getByRole('slider');
      expect(slider).toHaveValue('35');
    });
  });
});
