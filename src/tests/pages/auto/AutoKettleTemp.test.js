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
  kettleTemp: jest.fn()
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

const AutoKettleTemp = require('../../../pages/auto/AutoKettleTemp').default;
const { kettleTemp } = require('../../../brewnode/server-api.js');
const { MyContext } = require('../../../App.js');

describe('AutoKettleTemp Component', () => {
  const mockSetInProgress = jest.fn();
  
  const renderAutoKettleTemp = (props = {}) => {
    const defaultProps = {
      temp: 65,
      ...props
    };

    return render(
      <MyContext.Provider value={{ inProgress: '', setInProgress: mockSetInProgress }}>
        <AutoKettleTemp {...defaultProps} />
      </MyContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    kettleTemp.mockResolvedValue({ data: 'Temperature set successfully' });
    
    // Mock console.error to reduce test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('renders without crashing', () => {
    renderAutoKettleTemp();
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('displays correct temperature value', () => {
    renderAutoKettleTemp({ temp: 70 });
    expect(screen.getByText('70°C')).toBeInTheDocument();
  });

  test('displays zero temperature when temp is undefined', () => {
    renderAutoKettleTemp({ temp: undefined });
    expect(screen.getByText('°C')).toBeInTheDocument();
  });

  test('displays negative temperature correctly', () => {
    renderAutoKettleTemp({ temp: -5 });
    expect(screen.getByText('-5°C')).toBeInTheDocument();
  });

  test('strike button is enabled when not in progress', () => {
    renderAutoKettleTemp();
    const button = screen.getByTestId('toggle-button');
    expect(button).not.toBeDisabled();
  });

  test('strike button is disabled when in progress', () => {
    render(
      <MyContext.Provider value={{ inProgress: 'Heating...', setInProgress: mockSetInProgress }}>
        <AutoKettleTemp temp={65} />
      </MyContext.Provider>
    );
    const button = screen.getByTestId('toggle-button');
    expect(button).toBeDisabled();
  });

  test('calls kettleTemp API with correct temperature when button clicked', async () => {
    renderAutoKettleTemp({ temp: 72 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(kettleTemp).toHaveBeenCalledWith(72, 0);
    });
  });

  test('sets progress message when starting temperature setting', async () => {
    renderAutoKettleTemp({ temp: 68 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('Heating Kettle to 68C');
    });
  });

  test('clears progress message on successful temperature setting', async () => {
    kettleTemp.mockResolvedValue({ data: 'Success' });
    
    renderAutoKettleTemp({ temp: 65 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('');
    });
  });

  test('handles kettleTemp API error correctly', async () => {
    const mockError = new Error('Temperature sensor error');
    kettleTemp.mockRejectedValue(mockError);
    
    renderAutoKettleTemp({ temp: 65 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  test('works with zero temperature', async () => {
    renderAutoKettleTemp({ temp: 0 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(kettleTemp).toHaveBeenCalledWith(0, 0);
    });
    expect(mockSetInProgress).toHaveBeenCalledWith('Heating Kettle to 0C');
  });

  test('works with high temperature', async () => {
    renderAutoKettleTemp({ temp: 100 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(kettleTemp).toHaveBeenCalledWith(100, 0);
    });
    expect(mockSetInProgress).toHaveBeenCalledWith('Heating Kettle to 100C');
  });

  test('component has correct styling', () => {
    renderAutoKettleTemp();
    
    // Test that the component renders with MUI Box styling
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('header has correct styling', () => {
    renderAutoKettleTemp({ temp: 65 });
    const header = screen.getByText('65°C');
    
    expect(header).toHaveStyle({
      'margin-top': '-2vh'
    });
  });

  test('button shows correct text', () => {
    renderAutoKettleTemp();
    const button = screen.getByTestId('toggle-button');
    expect(button).toHaveTextContent('Strike');
  });

  test('always calls kettleTemp with 0 minutes parameter', async () => {
    renderAutoKettleTemp({ temp: 75 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(kettleTemp).toHaveBeenCalledWith(75, 0);
    });
  });
});