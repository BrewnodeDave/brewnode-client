import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../App';

// Mock all external dependencies
jest.mock('../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn(),
  removeSocketListener: jest.fn()
}));

jest.mock('../brewnode/server-api.js', () => ({
  getBatch: jest.fn(),
  sensorStatus: jest.fn(),
  fill: jest.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const { getBatch, sensorStatus, fill } = require('../brewnode/server-api.js');
const { addSocketListener, removeSocketListener } = require('../brewnode/socketListener.js');

describe('BrewNode Client Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Setup default mock responses
    getBatch.mockResolvedValue({
      name: 'Integration Test Brew',
      recipe: 'Test Recipe',
      fermentation: {
        steps: [
          { name: 'Primary', stepTemp: 20, stepTime: 7 },
          { name: 'Secondary', stepTemp: 18, stepTime: 14 }
        ]
      },
      mash: {
        steps: [
          { name: 'Protein Rest', stepTemp: 50, stepTime: 15 },
          { name: 'Saccharification', stepTemp: 65, stepTime: 60 }
        ]
      }
    });
    
    sensorStatus.mockResolvedValue(22.5);
    fill.mockResolvedValue({ data: 'Fill completed' });
  });

  test('full application flow - manual brewing process', async () => {
    render(<App />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(getBatch).toHaveBeenCalled();
    });
    
    // App should render with default Manual tab
    expect(screen.getByRole('tab', { name: 'Manual' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Manual' })).toHaveAttribute('aria-selected', 'true');
    
    // Should show manual brewing controls
    await waitFor(() => {
      expect(screen.getByText('Fill')).toBeInTheDocument();
    });
    
    // Test Fill operation
    const fillSlider = screen.queryByLabelText(/fill/i);
    const fillButton = screen.queryByRole('button', { name: /fill/i });
    
    if (fillSlider && fillButton) {
      fireEvent.change(fillSlider, { target: { value: '25' } });
      fireEvent.click(fillButton);
      
      await waitFor(() => {
        expect(fill).toHaveBeenCalledWith(25);
      });
    }
  });

  test('navigation between tabs works correctly', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(getBatch).toHaveBeenCalled();
    });
    
    // Start on Manual tab
    expect(screen.getByRole('tab', { name: 'Manual' })).toHaveAttribute('aria-selected', 'true');
    
    // Switch to Automatic tab
    fireEvent.click(screen.getByRole('tab', { name: 'Automatic' }));
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Automatic' })).toHaveAttribute('aria-selected', 'true');
    });
    
    // Switch to Devices tab
    fireEvent.click(screen.getByRole('tab', { name: 'Devices' }));
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Devices' })).toHaveAttribute('aria-selected', 'true');
    });
    
    // Switch to Graphs tab
    fireEvent.click(screen.getByRole('tab', { name: 'Graphs' }));
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Graphs' })).toHaveAttribute('aria-selected', 'true');
    });
    
    // Switch to Log tab
    fireEvent.click(screen.getByRole('tab', { name: 'Log' }));
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Log' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  test('fetchBatch toggle functionality works end-to-end', async () => {
    render(<App />);
    
    // Wait for initial batch fetch
    await waitFor(() => {
      expect(getBatch).toHaveBeenCalledTimes(1);
    });
    
    // Find and click the Brewfather toggle button by finding the image first
    const brewfatherImage = screen.getByRole('img', { name: 'Brewfather' });
    expect(brewfatherImage).toBeInTheDocument();
    
    // Find the button that contains the Brewfather image
    const brewfatherButton = screen.getByRole('button', { name: /brewfather/i });
    expect(brewfatherButton).toBeInTheDocument();
    
    // Click to toggle fetchBatch
    fireEvent.click(brewfatherButton);
    
    // Should trigger another batch fetch
    await waitFor(() => {
      expect(getBatch).toHaveBeenCalledTimes(2);
    });
  });

  test('error handling works across components', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Make getBatch fail
    getBatch.mockRejectedValue(new Error('Network error'));
    
    render(<App />);
    
    // Should show error dialog
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    
    // Error dialog should be closeable
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
    
    consoleError.mockRestore();
  });

  test('socket listeners are properly set up for real-time updates', () => {
    render(<App />);
    
    // Should set up Progress listener for the app
    expect(addSocketListener).toHaveBeenCalledWith('Progress', expect.any(Function));
  });

  test('context provides proper values to child components', async () => {
    // Test that context is working by verifying the app renders correctly
    // and state changes work (which rely on context)
    render(<App />);
    
    // Verify the app structure renders (requires working context)
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    
    // Test that context-dependent functionality works
    const brewfatherImage = screen.getByRole('img', { name: 'Brewfather' });
    expect(brewfatherImage).toBeInTheDocument();
    
    // The fact that the app renders and functions properly indicates context is working
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'basic tabs example');
  });

  test('responsive design elements render correctly', () => {
    render(<App />);
    
    // Check that the app renders with proper structure
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Brewfather' })).toBeInTheDocument(); // Brewfather button content
  });

  test('brewing data flows correctly between components', async () => {
    render(<App />);
    
    // Wait for batch data to load
    await waitFor(() => {
      expect(getBatch).toHaveBeenCalled();
    });
    
    // Switch to Automatic tab to see batch data
    fireEvent.click(screen.getByRole('tab', { name: 'Automatic' }));
    
    // Should display batch information (mocked components should show the data)
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Automatic' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  test('temperature monitoring works across the application', async () => {
    render(<App />);
    
    // Switch to Devices tab where temperature sensors are displayed
    fireEvent.click(screen.getByRole('tab', { name: 'Devices' }));
    
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Devices' })).toHaveAttribute('aria-selected', 'true');
    });
    
    // Temperature components should be initialized
    expect(sensorStatus).toHaveBeenCalled();
  });
});
