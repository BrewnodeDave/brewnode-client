import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../../brewnode/server-api.js', () => ({
  sensorStatus: jest.fn().mockResolvedValue(0),
  PumpKettle: jest.fn().mockResolvedValue({ success: true }),
  PumpMash: jest.fn().mockResolvedValue({ success: true }),
  PumpGlycol: jest.fn().mockResolvedValue({ success: true }),
  GlycolHeater: jest.fn().mockResolvedValue({ success: true }),
  GlycolChiller: jest.fn().mockResolvedValue({ success: true }),
  ValveMashIn: jest.fn().mockResolvedValue({ success: true }),
  ValveKettleIn: jest.fn().mockResolvedValue({ success: true }),
  ValveChillWortIn: jest.fn().mockResolvedValue({ success: true }),
  ValveChillWortOut: jest.fn().mockResolvedValue({ success: true }),
  Heater: jest.fn().mockResolvedValue({ success: true })
}));

jest.mock('../../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn(),
  removeSocketListener: jest.fn()
}));

const Toggle = require('../../common/Toggle.jsx').default;
const serverApi = require('../../brewnode/server-api.js');
const { addSocketListener, removeSocketListener } = require('../../brewnode/socketListener.js');

describe('Toggle Component', () => {
  let mockOnClick;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnClick = jest.fn().mockResolvedValue();
    serverApi.sensorStatus.mockResolvedValue(0);

    // Mock console methods to reduce test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderToggle = (props = {}) => {
    const defaultProps = {
      sensorName: 'Pump Kettle',
      displayName: 'Test Pump',
      ...props
    };
    return render(<Toggle {...defaultProps} />);
  };

  test('renders without crashing', () => {
    renderToggle();
    expect(screen.getByText('Test Pump')).toBeInTheDocument();
  });

  test('displays correct sensor name', () => {
    renderToggle({ sensorName: 'Kettle Heater', displayName: 'Heater Control' });
    expect(screen.getByText('Heater Control')).toBeInTheDocument();
  });

  test('fetches initial sensor status on mount', async () => {
    renderToggle({ sensorName: 'Pump Mash' });
    await waitFor(() => {
      expect(serverApi.sensorStatus).toHaveBeenCalledWith('Pump Mash');
    });
  });

  test('sets up socket listener with correct sensor name', () => {
    renderToggle({ sensorName: 'Glycol Heater' });
    
    expect(addSocketListener).toHaveBeenCalledWith('Glycol Heater', expect.any(Function));
  });

  test('removes socket listener on unmount', () => {
    const { unmount } = renderToggle({ sensorName: 'Pump Kettle' });
    
    // Get the handler function that was passed to addSocketListener
    const handler = addSocketListener.mock.calls[0][1];
    
    unmount();
    
    expect(removeSocketListener).toHaveBeenCalledWith('Pump Kettle', handler);
  });

  test('toggle button starts in off state (blue border)', async () => {
    serverApi.sensorStatus.mockResolvedValue(0);
    renderToggle();
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border: 5px solid blue');
    });
  });

  test('toggle button shows on state (red border) when sensor value > 0', async () => {
    serverApi.sensorStatus.mockResolvedValue(1);
    renderToggle();
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border: 5px solid red');
    });
  });

  test('calls custom onClick function when provided', async () => {
    renderToggle({ onClick: mockOnClick });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('calls appropriate server API function on toggle for Pump Kettle', async () => {
    serverApi.PumpKettle.mockResolvedValue();
    renderToggle({ sensorName: 'Pump Kettle' });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(serverApi.PumpKettle).toHaveBeenCalledWith(true);
    });
  });

  test('calls appropriate server API function on toggle for Kettle Heater', async () => {
    serverApi.Heater.mockResolvedValue();
    renderToggle({ sensorName: 'Kettle Heater' });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(serverApi.Heater).toHaveBeenCalledWith(true);
    });
  });

  test('handles server API errors gracefully', async () => {
    const errorMessage = 'Server connection failed';
    serverApi.PumpKettle.mockRejectedValue(new Error(errorMessage));
    renderToggle({ sensorName: 'Pump Kettle' });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(new Error(errorMessage));
    });
  });

  test('handles sensor status API errors', async () => {
    const errorObject = { error: 'Sensor not found' };
    serverApi.sensorStatus.mockResolvedValue(errorObject);
    renderToggle({ sensorName: 'Missing Sensor' });
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Sensor not found');
    });
  });

  test('updates state through socket listener', async () => {
    renderToggle({ sensorName: 'Pump Glycol' });
    
    // Get the handler function that was passed to addSocketListener
    const handler = addSocketListener.mock.calls[0][1];
    
    // Simulate socket data indicating device is on
    act(() => {
      handler(1);
    });
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border: 5px solid red');
    }, { timeout: 3000 });
  });

  test('uses custom dimensions when provided', () => {
    renderToggle({ width: '200px', height: '100px' });
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('width: 200px');
    expect(button).toHaveStyle('height: 100px');
  });

  test('uses default dimensions when not provided', () => {
    renderToggle();
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('width: 18vh');
    expect(button).toHaveStyle('height: 18vh');
  });

  test('uses custom border radius when provided', () => {
    renderToggle({ borderRadius: '10px' });
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('border-radius: 10px');
  });

  test('uses default circular border radius', () => {
    renderToggle();
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('border-radius: 50%');
  });

  test('displays background image when on', async () => {
    serverApi.sensorStatus.mockResolvedValue(1);
    renderToggle({ imageOn: '/pump-on.jpg', imageOff: '/pump-off.jpg' });
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-image: url(/pump-on.jpg)');
    });
  });

  test('displays background image when off', async () => {
    serverApi.sensorStatus.mockResolvedValue(0);
    renderToggle({ imageOn: '/pump-on.jpg', imageOff: '/pump-off.jpg' });
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-image: url(/pump-off.jpg)');
    });
  });

  test('handles undefined sensor status', async () => {
    serverApi.sensorStatus.mockResolvedValue(undefined);
    renderToggle({ sensorName: 'Unknown Sensor' });
    await waitFor(() => {
      expect(serverApi.sensorStatus).toHaveBeenCalledWith('Unknown Sensor');
    });
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('border: 5px solid blue');
  });

  test('maps valve sensor names correctly', async () => {
    serverApi.ValveMashIn.mockResolvedValue();
    renderToggle({ sensorName: 'Valve Mash-in' });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(serverApi.ValveMashIn).toHaveBeenCalledWith(true);
    });
  });

  test('toggles from on to off state', async () => {
    serverApi.sensorStatus.mockResolvedValue(1);
    serverApi.PumpKettle.mockResolvedValue({ success: true });
    renderToggle({ sensorName: 'Pump Kettle' });
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border: 5px solid red');
    });
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(serverApi.PumpKettle).toHaveBeenCalledWith(false);
    });
  });

  test('logs correct socket listener setup', () => {
    renderToggle({ sensorName: 'Test Sensor' });
    
    expect(console.log).toHaveBeenCalledWith('Listen for', 'Test Sensor');
  });

  test('logs correct socket listener removal', () => {
    const { unmount } = renderToggle({ sensorName: 'Test Sensor' });
    
    unmount();
    
    expect(console.log).toHaveBeenCalledWith('remove', 'Test Sensor');
  });
});