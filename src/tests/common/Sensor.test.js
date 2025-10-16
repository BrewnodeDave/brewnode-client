import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../../brewnode/server-api.js', () => ({
  sensorStatus: jest.fn().mockResolvedValue(25.5)
}));

jest.mock('../../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn(),
  removeSocketListener: jest.fn()
}));

const Sensor = require('../../common/Sensor.jsx').default;
const { sensorStatus } = require('../../brewnode/server-api.js');
const { addSocketListener, removeSocketListener } = require('../../brewnode/socketListener.js');

describe('Sensor Component', () => {
  let mockCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallback = jest.fn();
    sensorStatus.mockResolvedValue('25.5');
    
    // Mock console methods to reduce test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderSensor = (props = {}) => {
    const defaultProps = {
      name: 'temperature-sensor',
      ...props
    };
    return render(<Sensor {...defaultProps} />);
  };

  test('renders without crashing', async () => {
    renderSensor();
    // Check that the component renders 
    const spans = screen.getAllByRole('generic');
    expect(spans.length).toBeGreaterThan(0);
    
    // Wait for the API call to complete and value to be set
    await waitFor(() => {
      expect(document.body.textContent).toContain('25.5');
    });
  });

  test('fetches initial sensor status on mount', async () => {
    renderSensor({ name: 'temp-sensor' });
    
    await waitFor(() => {
      expect(sensorStatus).toHaveBeenCalledWith('temp-sensor');
    });
  });

  test('displays sensor value from API', async () => {
    sensorStatus.mockResolvedValue('42.3');
    renderSensor({ name: 'pressure-sensor' });
    
    await waitFor(() => {
      expect(screen.getByText('42.3')).toBeInTheDocument();
    });
  });

  test('sets up socket listener with correct sensor name', () => {
    renderSensor({ name: 'humidity-sensor' });
    
    expect(addSocketListener).toHaveBeenCalledWith('humidity-sensor', expect.any(Function));
  });

  test('removes socket listener on unmount', () => {
    const { unmount } = renderSensor({ name: 'test-sensor' });
    
    // Get the handler function that was passed to addSocketListener
    const handler = addSocketListener.mock.calls[0][1];
    
    unmount();
    
    expect(removeSocketListener).toHaveBeenCalledWith('test-sensor', handler);
  });

  test('updates value through socket listener', async () => {
    renderSensor({ name: 'voltage-sensor' });
    
    // Get the handler function that was passed to addSocketListener
    const handler = addSocketListener.mock.calls[0][1];
    
    // Simulate socket data
    act(() => {
      handler('3.3V');
    });
    
    await waitFor(() => {
      expect(document.body.textContent).toContain('3.3V');
    });
  });

  test('calls callback function when provided', async () => {
    renderSensor({ name: 'flow-sensor', cb: mockCallback });
    
    // Get the handler function
    const handler = addSocketListener.mock.calls[0][1];
    
    // Simulate socket data
    handler('15.7');
    
    expect(mockCallback).toHaveBeenCalledWith('15.7');
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    sensorStatus.mockResolvedValue({ error: 'Sensor not found' });
    
    renderSensor({ name: 'missing-sensor' });
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sensor not found');
    });
    
    consoleSpy.mockRestore();
  });

  test('does not fetch data when noDisplay is true', () => {
    renderSensor({ name: 'hidden-sensor', noDisplay: true });
    
    expect(sensorStatus).not.toHaveBeenCalled();
  });

  test('does not display value when noDisplay is true but still calls callback', () => {
    renderSensor({ name: 'hidden-sensor', noDisplay: true, cb: mockCallback });
    
    // Get the handler function
    const handler = addSocketListener.mock.calls[0][1];
    
    // Simulate socket data
    handler('hidden-value');
    
    // Should call callback but not display value
    expect(mockCallback).toHaveBeenCalledWith('hidden-value');
    expect(screen.queryByText('hidden-value')).not.toBeInTheDocument();
  });

  test('handles undefined sensor status', async () => {
    sensorStatus.mockResolvedValue(undefined);
    renderSensor({ name: 'undefined-sensor' });
    
    await waitFor(() => {
      expect(sensorStatus).toHaveBeenCalledWith('undefined-sensor');
    });
    
    // Should not throw error and sensor component should still render
    const spans = screen.getAllByRole('generic');
    expect(spans.length).toBeGreaterThan(0);
  });

  test('handles API rejection', async () => {
    sensorStatus.mockRejectedValue(new Error('Network error'));
    
    renderSensor({ name: 'error-sensor' });
    
    await waitFor(() => {
      expect(sensorStatus).toHaveBeenCalledWith('error-sensor');
    });
    
    // Should not crash and sensor component should still render
    const spans = screen.getAllByRole('generic');
    expect(spans.length).toBeGreaterThan(0);
  });

  test('re-fetches data when sensor name changes', async () => {
    const { rerender } = renderSensor({ name: 'sensor1' });
    
    await waitFor(() => {
      expect(sensorStatus).toHaveBeenCalledWith('sensor1');
    });
    
    // Change the sensor name
    rerender(<Sensor name="sensor2" />);
    
    await waitFor(() => {
      expect(sensorStatus).toHaveBeenCalledWith('sensor2');
    });
    
    expect(sensorStatus).toHaveBeenCalledTimes(2);
  });

  test('updates socket listener when sensor name changes', () => {
    const { rerender } = renderSensor({ name: 'sensor1' });
    
    expect(addSocketListener).toHaveBeenCalledWith('sensor1', expect.any(Function));
    
    // Change the sensor name
    rerender(<Sensor name="sensor2" />);
    
    expect(removeSocketListener).toHaveBeenCalled();
    expect(addSocketListener).toHaveBeenCalledWith('sensor2', expect.any(Function));
  });
});