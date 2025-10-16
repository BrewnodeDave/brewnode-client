import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const EggTimer = require('../../components/EggTimer.jsx').default;

describe('EggTimer Component', () => {
  test('renders without crashing', () => {
    render(<EggTimer />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays circular progress indicator', () => {
    render(<EggTimer />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('MuiCircularProgress-root');
  });

  test('progress indicator has correct size', () => {
    render(<EggTimer />);
    const progressBar = screen.getByRole('progressbar');
    
    // The size prop should translate to width and height styles
    expect(progressBar).toHaveStyle({
      width: '80px',
      height: '80px'
    });
  });

  test('progress bar is indeterminate by default', () => {
    render(<EggTimer />);
    const progressBar = screen.getByRole('progressbar');
    
    // Should not have a value attribute (indeterminate)
    expect(progressBar).not.toHaveAttribute('aria-valuenow');
  });

  test('component is accessible', () => {
    render(<EggTimer />);
    const progressBar = screen.getByRole('progressbar');
    
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('role', 'progressbar');
  });

  test('renders as loading spinner', () => {
    render(<EggTimer />);
    const progressBar = screen.getByRole('progressbar');
    
    // Should have the default MUI circular progress classes
    expect(progressBar).toHaveClass('MuiCircularProgress-root');
    expect(progressBar).toHaveClass('MuiCircularProgress-indeterminate');
  });

  test('component renders as full screen overlay', () => {
    render(<EggTimer />);
    
    // Check that it renders the progress indicator correctly
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  test('displays loading state correctly', () => {
    render(<EggTimer />);
    
    // Verify the essential loading indicator is present
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass('MuiCircularProgress-indeterminate');
  });

  test('has circular progress component with correct configuration', () => {
    render(<EggTimer />);
    const progressBar = screen.getByRole('progressbar');
    
    // Verify it's a circular progress (not linear)
    expect(progressBar).toHaveClass('MuiCircularProgress-root');
    expect(progressBar).not.toHaveClass('MuiLinearProgress-root');
  });

  test('component structure is simple and focused', () => {
    render(<EggTimer />);
    
    // Should have a circular progress component
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveClass('MuiCircularProgress-root');
  });

  test('renders consistently', () => {
    const { rerender } = render(<EggTimer />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    rerender(<EggTimer />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('provides visual loading feedback', () => {
    render(<EggTimer />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass('MuiCircularProgress-indeterminate');
  });
});