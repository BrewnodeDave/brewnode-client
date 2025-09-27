import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb) { this.cb = cb; }
  observe() { this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this); }
  unobserve() {}
  disconnect() {}
};

// Essential mocks only
const mockReact = require('react');
jest.mock('../../App.js', () => ({
  MyContext: mockReact.createContext({ fetchRecipe: false })
}));

// Mock server API with all needed functions
jest.mock('../../brewnode/server-api.js', () => ({
  getBatch: jest.fn(),
  sensorStatus: jest.fn()
}));

// Mock socket listener
jest.mock('../../brewnode/socketListener.js', () => ({
  addSocketListener: jest.fn(),
  removeSocketListener: jest.fn()
}));

// Mock all child components to isolate BasicTabs
jest.mock('../../pages/Controls', () => ({
  __esModule: true,
  default: () => <div data-testid="controls-component">Controls</div>
}));

jest.mock('../../pages/AutomaticTab.jsx', () => {
  return function MockAutomaticTab() {
    return <div data-testid="automatic-tab">Automatic Tab</div>;
  };
});

jest.mock('../../pages/ManualTab.jsx', () => {
  return function MockManualTab() {
    return <div data-testid="manual-tab">Manual Tab</div>;
  };
});

jest.mock('../../components/CombinedGraph.jsx', () => {
  return function MockCombinedGraph() {
    return <div data-testid="combined-graph">Combined Graph</div>;
  };
});

jest.mock('../../components/FileStreamer', () => {
  return function MockFileStreamer() {
    return <div data-testid="file-streamer">File Streamer</div>;
  };
});

jest.mock('../../Error.jsx', () => {
  return function MockError({ open, message, onClose }) {
    if (!open) return null;
    return (
      <div data-testid="error-dialog">
        <div>{message}</div>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

const { getBatch, sensorStatus } = require('../../brewnode/server-api.js');

describe('BasicTabs Fixed Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getBatch.mockResolvedValue({
      name: 'Test Batch',
      recipe: { name: 'Test Recipe' }
    });
    sensorStatus.mockResolvedValue(20.5); // Mock default sensor reading
  });

  const renderBasicTabs = () => {
    const BasicTabs = require('../../pages/BasicTabs').default;
    return render(
      <BrowserRouter>
        <BasicTabs />
      </BrowserRouter>
    );
  };

  test('renders without crashing', () => {
    renderBasicTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  test('displays correct tab labels', () => {
    renderBasicTabs();
    
    expect(screen.getByRole('tab', { name: 'Manual' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Automatic' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Graphs' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Log' })).toBeInTheDocument();
  });
});
