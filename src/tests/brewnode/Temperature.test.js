import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Temperature from '../../brewnode/Temperature';

// Mock the server API
jest.mock('../../brewnode/server-api.js', () => ({
  sensorStatus: jest.fn()
}));

// Mock socket listener
jest.mock('../../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn(),
  removeSocketListener: jest.fn()
}));

const { sensorStatus } = require('../../brewnode/server-api.js');
const { addSocketListener, removeSocketListener } = require('../../brewnode/socketListener.js');

// Mock localStorage more comprehensively
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock localStorage at the window level as well
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

global.localStorage = localStorageMock;

describe('Temperature Component', () => {
  beforeEach(() => {
    // Clear all mocks except our localStorage mock structure
    sensorStatus.mockClear();
    addSocketListener.mockClear();
    removeSocketListener.mockClear();
    
    // Reset localStorage mock call history but keep the mock functions
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    
    // Mock sensorStatus to return undefined to avoid the .error check
    sensorStatus.mockResolvedValue(undefined);
  });

  test('renders with default temperature of 0', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<Temperature sensor="TempKettle" />);
    
    expect(screen.getByText('0°C')).toBeInTheDocument();
  });

  test('loads temperature from localStorage if available', async () => {
    localStorageMock.getItem.mockReturnValue('"22.3"'); // JSON string
    
    render(<Temperature sensor="TempKettle" />);
    
    // Wait for useEffect to run
    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('temp-TempKettle');
    });
    
    expect(screen.getByText('22.3°C')).toBeInTheDocument();
  });

  test('fetches initial temperature from server API', async () => {
    sensorStatus.mockResolvedValue(18.7);
    
    render(<Temperature sensor="TempMash" />);
    
    await waitFor(() => {
      expect(sensorStatus).toHaveBeenCalledWith('TempMash');
    });
    
    await waitFor(() => {
      expect(screen.getByText('18.7°C')).toBeInTheDocument();
    });
  });

  test('handles server API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    sensorStatus.mockResolvedValue({ error: 'Sensor not found' });
    
    render(<Temperature sensor="InvalidSensor" />);
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Sensor not found');
    }, { timeout: 3000 });
    
    // Should still show default temperature
    expect(screen.getByText('0°C')).toBeInTheDocument();
    
    consoleError.mockRestore();
  });

  test('sets up socket listener for real-time updates', () => {
    render(<Temperature sensor="TempFermenter" />);
    
    expect(addSocketListener).toHaveBeenCalledWith('TempFermenter', expect.any(Function));
  });

  test('removes socket listener on unmount', () => {
    const { unmount } = render(<Temperature sensor="TempGlycol" />);
    
    unmount();
    
    expect(removeSocketListener).toHaveBeenCalledWith('TempGlycol', expect.any(Function));
  });

  test('updates temperature through socket listener', async () => {
    let socketCallback;
    addSocketListener.mockImplementation((sensor, callback) => {
      socketCallback = callback;
    });
    
    render(<Temperature sensor="TempAmbient" />);
    
    // Simulate socket update
    socketCallback(27.8);
    
    await waitFor(() => {
      expect(screen.getByText('27.8°C')).toBeInTheDocument();
    });
  });

  test('saves temperature to localStorage when updated', async () => {
    let socketCallback;
    addSocketListener.mockImplementation((sensor, callback) => {
      socketCallback = callback;
    });
    
    render(<Temperature sensor="TempKettle" />);
    
    // Simulate socket update
    socketCallback(45.2);
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('temp-TempKettle', '45.2');
    });
  });

  test('has correct styling', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<Temperature sensor="TempTest" />);
    
    const temperatureElement = screen.getByText('0°C');
    expect(temperatureElement).toHaveStyle({
      fontSize: '4vw',
      color: '#FF7C00'
    });
    expect(temperatureElement.tagName).toBe('H1');
  });

  test('handles undefined sensor status', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    sensorStatus.mockResolvedValue(undefined);
    
    render(<Temperature sensor="TempTest" />);
    
    await waitFor(() => {
      expect(sensorStatus).toHaveBeenCalledWith('TempTest');
    });
    
    // Should keep default temperature
    expect(screen.getByText('0°C')).toBeInTheDocument();
  });

  test('updates when sensor prop changes', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { rerender } = render(<Temperature sensor="TempKettle" />);
    
    // Change sensor prop
    rerender(<Temperature sensor="TempMash" />);
    
    await waitFor(() => {
      expect(sensorStatus).toHaveBeenCalledWith('TempMash');
    });
    
    expect(addSocketListener).toHaveBeenCalledWith('TempMash', expect.any(Function));
  });

  test('loads different localStorage values for different sensors', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'temp-TempKettle') return '"65.0"'; // JSON string
      if (key === 'temp-TempMash') return '"72.5"'; // JSON string
      return null;
    });
    
    const { rerender } = render(<Temperature sensor="TempKettle" />);
    await waitFor(() => {
      expect(screen.getByText('65.0°C')).toBeInTheDocument();
    });
    
    rerender(<Temperature sensor="TempMash" />);
    await waitFor(() => {
      expect(screen.getByText('72.5°C')).toBeInTheDocument();
    });
  });
});
