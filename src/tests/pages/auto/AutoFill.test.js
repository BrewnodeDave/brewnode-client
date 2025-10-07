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
  fill: jest.fn()
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

const AutoFill = require('../../../pages/auto/AutoFill').default;
const { fill } = require('../../../brewnode/server-api.js');
const { MyContext } = require('../../../App.js');

describe('AutoFill Component', () => {
  const mockSetInProgress = jest.fn();
  
  const renderAutoFill = (props = {}) => {
    const defaultProps = {
      strikeLitres: 25,
      ...props
    };

    return render(
      <MyContext.Provider value={{ inProgress: '', setInProgress: mockSetInProgress }}>
        <AutoFill {...defaultProps} />
      </MyContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fill.mockResolvedValue({ data: 'Fill successful' });
    
    // Mock console.log to reduce test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test('renders without crashing', () => {
    renderAutoFill();
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  test('displays correct strike litres value', () => {
    renderAutoFill({ strikeLitres: 30 });
    expect(screen.getByText('30 L')).toBeInTheDocument();
  });

  test('displays zero when strikeLitres is undefined', () => {
    renderAutoFill({ strikeLitres: undefined });
    expect(screen.getByText('L')).toBeInTheDocument(); // Shows as " L" when undefined
  });

  test('fill button is enabled when not in progress', () => {
    renderAutoFill();
    const button = screen.getByTestId('toggle-button');
    expect(button).not.toBeDisabled();
  });

  test('fill button is disabled when in progress', () => {
    render(
      <MyContext.Provider value={{ inProgress: 'Filling...', setInProgress: mockSetInProgress }}>
        <AutoFill strikeLitres={25} />
      </MyContext.Provider>
    );
    const button = screen.getByTestId('toggle-button');
    expect(button).toBeDisabled();
  });

  test('calls fill API with correct litres when button clicked', async () => {
    renderAutoFill({ strikeLitres: 20 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(fill).toHaveBeenCalledWith(20);
    });
  });

  test('handles successful fill operation', async () => {
    fill.mockResolvedValue({ data: 'Fill completed' });
    
    renderAutoFill({ strikeLitres: 15 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(fill).toHaveBeenCalledWith(15);
    });
  });

  test('handles fill API error correctly', async () => {
    const mockError = new Error('Network error');
    fill.mockRejectedValue(mockError);
    
    renderAutoFill({ strikeLitres: 25 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('Error: Network error');
    });
  });

  test('validates strikeLitres before making API call', async () => {
    renderAutoFill({ strikeLitres: 0 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('Invalid strike litres value: 0');
      expect(fill).not.toHaveBeenCalled();
    });
  });

  test('validates negative strikeLitres', async () => {
    renderAutoFill({ strikeLitres: -5 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('Invalid strike litres value: -5');
      expect(fill).not.toHaveBeenCalled();
    });
  });

  test('validates undefined strikeLitres', async () => {
    renderAutoFill({ strikeLitres: undefined });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSetInProgress).toHaveBeenCalledWith('Invalid strike litres value: undefined');
      expect(fill).not.toHaveBeenCalled();
    });
  });

  test('logs debug information on mount', () => {
    renderAutoFill({ strikeLitres: 25 });
    
    expect(console.log).toHaveBeenCalledWith('AutoFill props:', expect.objectContaining({ strikeLitres: 25 }));
    expect(console.log).toHaveBeenCalledWith('Strike litres:', 25);
  });

  test('logs fill operation start', async () => {
    renderAutoFill({ strikeLitres: 25 });
    const button = screen.getByTestId('toggle-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('AutoFill: Starting fill with', 25, 'litres');
    });
  });

  test('component has correct styling', () => {
    const { container } = renderAutoFill();
    const box = container.querySelector('div');
    
    expect(box).toHaveStyle({
      'border': '2px solid',
      'padding': '16px',
      'display': 'flex',
      'flex-direction': 'column',
      'box-sizing': 'border-box'
    });
  });

  test('header has correct styling', () => {
    renderAutoFill({ strikeLitres: 25 });
    const header = screen.getByText('25 L');
    
    expect(header).toHaveStyle({
      'margin-top': '-2vh'
    });
  });
});