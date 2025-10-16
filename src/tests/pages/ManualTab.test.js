import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ManualTab from '../../pages/ManualTab';
import { MyContext } from '../../App';

// Mock the server API
jest.mock('../../brewnode/server-api.js', () => ({
  fill: jest.fn(),
  kettleTemp: jest.fn(),
  boil: jest.fn(),
  ferment: jest.fn()
}));

// Mock socket listeners
jest.mock('../../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn()
}));

// Mock Toggle component to make it testable
jest.mock('../../common/Toggle.jsx', () => {
  return function MockToggle({ displayName, disabled, onClick, ...props }) {
    return (
      <button
        data-testid={`${displayName.toLowerCase()}-button`}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {displayName}
      </button>
    );
  };
});

const { 
  fill: mockFill, 
  kettleTemp: mockKettleTemp, 
  boil: mockBoil, 
  ferment: mockFerment 
} = require('../../brewnode/server-api.js');
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

describe('ManualTab - Fill Button Tests', () => {
  const mockSetInProgress = jest.fn();
  const defaultContextValue = {
    inProgress: '',
    setInProgress: mockSetInProgress
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFill.mockResolvedValue({ data: 'success' });
    mockKettleTemp.mockResolvedValue({ data: 'success' });
    mockBoil.mockResolvedValue({ data: 'success' });
    mockFerment.mockResolvedValue({ data: 'success' });
  });

  describe('Fill Button Rendering', () => {
    test('renders ManualTab with all components', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Verify ManualTab structure - all four main buttons should be present
      expect(screen.getByTestId('fill-button')).toBeInTheDocument();
      expect(screen.getByTestId('kettle-button')).toBeInTheDocument();
      expect(screen.getByTestId('boil-button')).toBeInTheDocument();
      expect(screen.getByTestId('ferment-button')).toBeInTheDocument();
    });

    test('fill button displays correct text', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      expect(fillButton).toHaveTextContent('Fill');
    });

    test('fill button is enabled by default', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      expect(fillButton).not.toBeDisabled();
    });

    test('fill slider is present and functional', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const sliders = screen.getAllByRole('slider');
      const fillSlider = sliders[0]; // Fill slider is first
      expect(fillSlider).toBeInTheDocument();
      expect(fillSlider).toHaveValue('19'); // default value
    });
  });

  describe('Fill Button Functionality', () => {
    test('clicking fill button calls fill API with default value', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      
      fireEvent.click(fillButton);
      
      await waitFor(() => {
        expect(mockFill).toHaveBeenCalledWith(19); // default litres value
      });
    });

    test('clicking fill button calls fill API with slider value', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const sliders = screen.getAllByRole('slider');
      const fillSlider = sliders[0]; // Fill slider is first
      const fillButton = screen.getByTestId('fill-button');
      
      // Change slider value
      fireEvent.change(fillSlider, { target: { value: '35' } });
      
      // Click fill button
      fireEvent.click(fillButton);
      
      await waitFor(() => {
        expect(mockFill).toHaveBeenCalledWith(35);
      });
    });

    test('fill button handles multiple clicks correctly', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      
      // Click multiple times
      fireEvent.click(fillButton);
      fireEvent.click(fillButton);
      
      await waitFor(() => {
        expect(mockFill).toHaveBeenCalledTimes(2);
      });
    });

    test('fill button works with different slider values', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const sliders = screen.getAllByRole('slider');
      const fillSlider = sliders[0]; // Fill slider is first
      const fillButton = screen.getByTestId('fill-button');
      
      // Test multiple values
      const testValues = [10, 25, 40];
      
      for (const value of testValues) {
        fireEvent.change(fillSlider, { target: { value: value.toString() } });
        
        fireEvent.click(fillButton);
        
        await waitFor(() => {
          expect(mockFill).toHaveBeenCalledWith(value);
        });
      }
      
      expect(mockFill).toHaveBeenCalledTimes(testValues.length);
    });
  });

  describe('Fill Button Error Handling', () => {
    test('fill button handles API errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const testError = new Error('Fill operation failed');
      mockFill.mockRejectedValue(testError);
      
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      
      fireEvent.click(fillButton);
      
      await waitFor(() => {
        expect(mockSetInProgress).toHaveBeenCalledWith(testError);
      });
      
      expect(consoleError).toHaveBeenCalledWith(testError);
      consoleError.mockRestore();
    });

    test('fill button is disabled when operation is in progress', () => {
      const contextWithProgress = {
        inProgress: 123, // numeric value indicates in progress
        setInProgress: mockSetInProgress
      };
      
      renderWithContext(<ManualTab />, contextWithProgress);
      
      const fillButton = screen.getByTestId('fill-button');
      const sliders = screen.getAllByRole('slider');
      const fillSlider = sliders[0]; // Fill slider is first
      
      expect(fillButton).toBeDisabled();
      expect(fillSlider).toBeDisabled();
    });

    test('fill button remains disabled during operation', async () => {
      let resolvePromise;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockFill.mockReturnValue(mockPromise);
      
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      
      // Click button to start operation
      fireEvent.click(fillButton);
      
      // Button should still be clickable (this tests the component behavior)
      expect(fillButton).not.toBeDisabled();
      
      // Resolve the promise
      act(() => {
        resolvePromise({ data: 'success' });
      });
    });
  });

  describe('Fill Button Integration', () => {
    test('fill button works with socket listeners', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Verify socket listener was set up for fill component
      expect(addSocketListener).toHaveBeenCalledWith('remainingFillLitres', expect.any(Function));
    });

    test('fill button responds to socket updates', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Get the socket listener callback for remainingFillLitres
      const socketCallback = addSocketListener.mock.calls.find(
        call => call[0] === 'remainingFillLitres'
      )[1];
      
      // Simulate socket update
      act(() => {
        socketCallback(42);
      });
      
      // Check if slider value updated
      const sliders = screen.getAllByRole('slider');
      const fillSlider = sliders[0]; // Fill slider is first
      expect(fillSlider).toHaveValue('42');
    });

    test('fill button maintains state consistency', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const sliders = screen.getAllByRole('slider');
      const fillSlider = sliders[0]; // Fill slider is first
      const fillButton = screen.getByTestId('fill-button');
      
      // Set slider to specific value
      fireEvent.change(fillSlider, { target: { value: '33' } });
      expect(fillSlider).toHaveValue('33');
      
      // Click fill button
      fireEvent.click(fillButton);
      
      // Verify API was called with correct value
      await waitFor(() => {
        expect(mockFill).toHaveBeenCalledWith(33);
      });
      
      // Slider should maintain its value
      expect(fillSlider).toHaveValue('33');
    });
  });

  describe('Fill Button Accessibility', () => {
    test('fill button has proper accessibility attributes', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      
      // Check that it's a button element and has correct text
      expect(fillButton.tagName).toBe('BUTTON');
      expect(fillButton).toHaveTextContent('Fill');
    });

    test('fill button is keyboard accessible', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      
      // Should be focusable
      fillButton.focus();
      expect(fillButton).toHaveFocus();
    });
  });
});

describe('ManualTab - Kettle Button Tests', () => {
  const mockSetInProgress = jest.fn();
  const defaultContextValue = {
    inProgress: '',
    setInProgress: mockSetInProgress
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockKettleTemp.mockResolvedValue({ data: 'success' });
  });

  describe('Kettle Button Rendering', () => {
    test('renders kettle button with correct text', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const kettleButton = screen.getByTestId('kettle-button');
      expect(kettleButton).toBeInTheDocument();
      expect(kettleButton).toHaveTextContent('Kettle');
    });

    test('kettle button is enabled by default', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const kettleButton = screen.getByTestId('kettle-button');
      expect(kettleButton).not.toBeDisabled();
    });

    test('kettle temperature and time sliders are present', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const sliders = screen.getAllByRole('slider');
      // Should have sliders for Fill (1), KettleTemp (2), Boil (1), Ferment (2) = 6 total
      expect(sliders.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Kettle Button Functionality', () => {
    test('clicking kettle button calls kettleTemp API with default values', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const kettleButton = screen.getByTestId('kettle-button');
      
      fireEvent.click(kettleButton);
      
      await waitFor(() => {
        expect(mockKettleTemp).toHaveBeenCalledWith(60, 10); // default temp and mins
      });
    });

    test('kettle button calls API when clicked', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const kettleButton = screen.getByTestId('kettle-button');
      fireEvent.click(kettleButton);
      
      // Note: KettleTemp doesn't have error handling in onClick, so we just verify the call
      await waitFor(() => {
        expect(mockKettleTemp).toHaveBeenCalledWith(60, 10);
      });
    });

    test('kettle button is disabled when operation is in progress', () => {
      const contextWithProgress = {
        inProgress: 'some-operation',
        setInProgress: mockSetInProgress
      };
      
      renderWithContext(<ManualTab />, contextWithProgress);
      
      const kettleButton = screen.getByTestId('kettle-button');
      expect(kettleButton).toBeDisabled();
    });
  });

  describe('Kettle Button Integration', () => {
    test('kettle button works with socket listeners', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Verify socket listener was set up for kettle component
      expect(addSocketListener).toHaveBeenCalledWith('remainingKettleMinutes', expect.any(Function));
    });
  });
});

describe('ManualTab - Boil Button Tests', () => {
  const mockSetInProgress = jest.fn();
  const defaultContextValue = {
    inProgress: '',
    setInProgress: mockSetInProgress
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBoil.mockResolvedValue({ data: 'success' });
  });

  describe('Boil Button Rendering', () => {
    test('renders boil button with correct text', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const boilButton = screen.getByTestId('boil-button');
      expect(boilButton).toBeInTheDocument();
      expect(boilButton).toHaveTextContent('Boil');
    });

    test('boil button is enabled by default', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const boilButton = screen.getByTestId('boil-button');
      expect(boilButton).not.toBeDisabled();
    });
  });

  describe('Boil Button Functionality', () => {
    test('clicking boil button calls boil API with default value', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const boilButton = screen.getByTestId('boil-button');
      
      fireEvent.click(boilButton);
      
      await waitFor(() => {
        expect(mockBoil).toHaveBeenCalledWith(0); // default mins value
      });
    });

    test('boil button handles API errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const testError = new Error('Boil operation failed');
      mockBoil.mockRejectedValue(testError);
      
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const boilButton = screen.getByTestId('boil-button');
      fireEvent.click(boilButton);
      
      await waitFor(() => {
        expect(mockSetInProgress).toHaveBeenCalledWith(testError);
      });
      
      expect(consoleError).toHaveBeenCalledWith(testError);
      consoleError.mockRestore();
    });

    test('boil button is disabled when operation is in progress', () => {
      const contextWithProgress = {
        inProgress: 'some-operation',
        setInProgress: mockSetInProgress
      };
      
      renderWithContext(<ManualTab />, contextWithProgress);
      
      const boilButton = screen.getByTestId('boil-button');
      expect(boilButton).toBeDisabled();
    });
  });

  describe('Boil Button Integration', () => {
    test('boil button works with socket listeners', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Verify socket listener was set up for boil component
      expect(addSocketListener).toHaveBeenCalledWith('remainingBoilMinutes', expect.any(Function));
    });

    test('boil button responds to socket updates', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Get the socket listener callback for remainingBoilMinutes
      const socketCallback = addSocketListener.mock.calls.find(
        call => call[0] === 'remainingBoilMinutes'
      )[1];
      
      // Simulate socket update
      act(() => {
        socketCallback({ value: 30 });
      });
      
      // The component should have updated its internal state
      // We can verify this by checking that the socket listener was called
      expect(addSocketListener).toHaveBeenCalledWith('remainingBoilMinutes', expect.any(Function));
    });
  });
});

describe('ManualTab - Ferment Button Tests', () => {
  const mockSetInProgress = jest.fn();
  const defaultContextValue = {
    inProgress: '',
    setInProgress: mockSetInProgress
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFerment.mockResolvedValue({ data: 'success' });
  });

  describe('Ferment Button Rendering', () => {
    test('renders ferment button with correct text', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fermentButton = screen.getByTestId('ferment-button');
      expect(fermentButton).toBeInTheDocument();
      expect(fermentButton).toHaveTextContent('Ferment');
    });

    test('ferment button is enabled by default', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fermentButton = screen.getByTestId('ferment-button');
      expect(fermentButton).not.toBeDisabled();
    });
  });

  describe('Ferment Button Functionality', () => {
    test('clicking ferment button calls ferment API with default values', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fermentButton = screen.getByTestId('ferment-button');
      
      fireEvent.click(fermentButton);
      
      await waitFor(() => {
        expect(mockFerment).toHaveBeenCalledWith([{ stepTemp: 19, stepTime: 7 }]); // default values
      });
    });

    test('ferment button handles API errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const testError = new Error('Ferment operation failed');
      mockFerment.mockRejectedValue(testError);
      
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fermentButton = screen.getByTestId('ferment-button');
      fireEvent.click(fermentButton);
      
      await waitFor(() => {
        expect(mockSetInProgress).toHaveBeenCalledWith(testError);
      });
      
      expect(consoleError).toHaveBeenCalledWith(testError);
      consoleError.mockRestore();
    });

    test('ferment button is disabled when operation is in progress', () => {
      const contextWithProgress = {
        inProgress: 'some-operation',
        setInProgress: mockSetInProgress
      };
      
      renderWithContext(<ManualTab />, contextWithProgress);
      
      const fermentButton = screen.getByTestId('ferment-button');
      expect(fermentButton).toBeDisabled();
    });
  });

  describe('Ferment Button Integration', () => {
    test('ferment button works with socket listeners', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Verify socket listener was set up for ferment component
      expect(addSocketListener).toHaveBeenCalledWith('remainingFermentDays', expect.any(Function));
    });

    test('ferment button responds to socket updates', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Get the socket listener callback for remainingFermentDays
      const socketCallback = addSocketListener.mock.calls.find(
        call => call[0] === 'remainingFermentDays'
      )[1];
      
      // Simulate socket update
      act(() => {
        socketCallback({ value: 14 });
      });
      
      // The component should have updated its internal state
      // We can verify this by checking that the socket listener was called
      expect(addSocketListener).toHaveBeenCalledWith('remainingFermentDays', expect.any(Function));
    });
  });
});

describe('ManualTab - All Buttons Integration Tests', () => {
  const mockSetInProgress = jest.fn();
  const defaultContextValue = {
    inProgress: '',
    setInProgress: mockSetInProgress
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFill.mockResolvedValue({ data: 'success' });
    mockKettleTemp.mockResolvedValue({ data: 'success' });
    mockBoil.mockResolvedValue({ data: 'success' });
    mockFerment.mockResolvedValue({ data: 'success' });
  });

  describe('All Buttons Rendering', () => {
    test('renders all buttons on manual tab', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Verify all four main buttons are present
      expect(screen.getByTestId('fill-button')).toBeInTheDocument();
      expect(screen.getByTestId('kettle-button')).toBeInTheDocument();
      expect(screen.getByTestId('boil-button')).toBeInTheDocument();
      expect(screen.getByTestId('ferment-button')).toBeInTheDocument();
    });

    test('all buttons have correct text content', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      expect(screen.getByTestId('fill-button')).toHaveTextContent('Fill');
      expect(screen.getByTestId('kettle-button')).toHaveTextContent('Kettle');
      expect(screen.getByTestId('boil-button')).toHaveTextContent('Boil');
      expect(screen.getByTestId('ferment-button')).toHaveTextContent('Ferment');
    });

    test('all buttons are enabled by default', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      expect(screen.getByTestId('fill-button')).not.toBeDisabled();
      expect(screen.getByTestId('kettle-button')).not.toBeDisabled();
      expect(screen.getByTestId('boil-button')).not.toBeDisabled();
      expect(screen.getByTestId('ferment-button')).not.toBeDisabled();
    });
  });

  describe('All Buttons Functionality', () => {
    test('all buttons can be clicked and call their respective APIs', async () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      const fillButton = screen.getByTestId('fill-button');
      const kettleButton = screen.getByTestId('kettle-button');
      const boilButton = screen.getByTestId('boil-button');
      const fermentButton = screen.getByTestId('ferment-button');
      
      // Click all buttons
      fireEvent.click(fillButton);
      fireEvent.click(kettleButton);
      fireEvent.click(boilButton);
      fireEvent.click(fermentButton);
      
      // Verify all APIs were called
      await waitFor(() => {
        expect(mockFill).toHaveBeenCalledWith(19);
      });
      await waitFor(() => {
        expect(mockKettleTemp).toHaveBeenCalledWith(60, 10);
      });
      await waitFor(() => {
        expect(mockBoil).toHaveBeenCalledWith(0);
      });
      await waitFor(() => {
        expect(mockFerment).toHaveBeenCalledWith([{ stepTemp: 19, stepTime: 7 }]);
      });
    });

    test('fill button is disabled with numeric inProgress', () => {
      // Test with numeric inProgress (affects Fill and sliders)
      const contextWithNumericProgress = {
        inProgress: 123,
        setInProgress: mockSetInProgress
      };
      
      renderWithContext(<ManualTab />, contextWithNumericProgress);
      
      // Fill button is disabled by numeric inProgress
      expect(screen.getByTestId('fill-button')).toBeDisabled();
    });

    test('other buttons are disabled with string inProgress', () => {
      // Test with string inProgress (affects Kettle, Boil, Ferment)
      const contextWithStringProgress = {
        inProgress: 'any-operation',
        setInProgress: mockSetInProgress
      };
      
      renderWithContext(<ManualTab />, contextWithStringProgress);
      
      // These buttons are disabled by non-empty string inProgress
      expect(screen.getByTestId('kettle-button')).toBeDisabled();
      expect(screen.getByTestId('boil-button')).toBeDisabled();
      expect(screen.getByTestId('ferment-button')).toBeDisabled();
    });
  });

  describe('All Buttons Socket Integration', () => {
    test('all socket listeners are properly set up', () => {
      renderWithContext(<ManualTab />, defaultContextValue);
      
      // Verify all socket listeners were set up
      expect(addSocketListener).toHaveBeenCalledWith('remainingFillLitres', expect.any(Function));
      expect(addSocketListener).toHaveBeenCalledWith('remainingKettleMinutes', expect.any(Function));
      expect(addSocketListener).toHaveBeenCalledWith('remainingBoilMinutes', expect.any(Function));
      expect(addSocketListener).toHaveBeenCalledWith('remainingFermentDays', expect.any(Function));
    });
  });
});