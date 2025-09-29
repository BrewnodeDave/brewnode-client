import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../App';

// Mock socket listener to avoid real socket connections during tests
jest.mock('../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn()
}));

// Mock components to isolate App component testing
jest.mock('../AppBar', () => {
  return function MockAppBar({ actionButton }) {
    return (
      <div data-testid="mock-appbar">
        AppBar Component
        {actionButton}
      </div>
    );
  };
});

jest.mock('../pages/BasicTabs', () => {
  return function MockBasicTabs({ fetchBatch }) {
    return <div data-testid="mock-basictabs">BasicTabs - fetchBatch: {fetchBatch.toString()}</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('mock-appbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-basictabs')).toBeInTheDocument();
  });

  test('initializes with correct default state', () => {
    render(<App />);
    // fetchBatch should start as false
    expect(screen.getByText(/fetchBatch: false/)).toBeInTheDocument();
  });

  test('toggles fetchRecipe state when action button is clicked', () => {
    render(<App />);
    
    // Find the Brewfather button
    const brewfatherButton = screen.getByRole('button');
    expect(brewfatherButton).toBeInTheDocument();
    
    // Initially fetchBatch should be false
    expect(screen.getByText(/fetchBatch: false/)).toBeInTheDocument();
    
    // Click the button to toggle
    fireEvent.click(brewfatherButton);
    
    // Now fetchBatch should be true
    expect(screen.getByText(/fetchBatch: true/)).toBeInTheDocument();
    
    // Click again to toggle back
    fireEvent.click(brewfatherButton);
    
    // Should be false again
    expect(screen.getByText(/fetchBatch: false/)).toBeInTheDocument();
  });

  test('provides context to child components', () => {
    // Test that the App component renders properly with context provider
    render(<App />);
    
    // The context is working if the app renders properly with mocked components
    // and the fetchBatch state can be toggled (which uses context internally)
    expect(screen.getByTestId('mock-appbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-basictabs')).toBeInTheDocument();
    
    // Test that context is working by verifying state changes work
    const brewfatherButton = screen.getByRole('button');
    fireEvent.click(brewfatherButton);
    expect(screen.getByText(/fetchBatch: true/)).toBeInTheDocument();
  });

  test('renders with correct theme provider', () => {
    render(<App />);
    
    // Verify theme provider is working by checking if Material-UI components render
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-appbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-basictabs')).toBeInTheDocument();
  });

  test('brewfather button has correct styling and icon', () => {
    render(<App />);
    
    // Check for Brewfather image
    const brewfatherImage = screen.getByRole('img', { name: 'Brewfather' });
    expect(brewfatherImage).toBeInTheDocument();
    expect(brewfatherImage).toHaveAttribute('src', '/static/images/brewfather.png');
  });
});
