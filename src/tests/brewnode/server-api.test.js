// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch for streamLog
global.fetch = jest.fn();

const axios = require('axios');

describe('Server API Service', () => {
  const mockHost = 'localhost';
  const mockPort = '4000';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup localStorage mocks
    localStorageMock.getItem.mockImplementation((key) => {
      const values = {
        'ipAddress': mockHost,
        'ipPort': mockPort,
        'username': 'testuser',
        'password': 'testpass'
      };
      return values[key] || null;
    });

    // Default successful axios response
    axios.get.mockResolvedValue({ data: { success: true } });
    axios.put.mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    // Reset modules to ensure fresh imports
    jest.resetModules();
  });

  test('server-api module loads correctly', () => {
    const serverApi = require('../../brewnode/server-api.js');
    
    // Check that key functions exist
    expect(typeof serverApi.getBatch).toBe('function');
    expect(typeof serverApi.getBrewnames).toBe('function');
    expect(typeof serverApi.sensorStatus).toBe('function');
    expect(typeof serverApi.boil).toBe('function');
    expect(typeof serverApi.fill).toBe('function');
  });

  test('axios module is mocked correctly', () => {
    expect(typeof axios.get).toBe('function');
    expect(typeof axios.put).toBe('function');
    expect(jest.isMockFunction(axios.get)).toBe(true);
    expect(jest.isMockFunction(axios.put)).toBe(true);
  });

  test('localStorage mock is configured correctly', () => {
    // Test that our localStorage mock is working
    expect(localStorageMock.getItem).toBeDefined();
    expect(localStorageMock.setItem).toBeDefined();
    expect(typeof localStorageMock.getItem).toBe('function');
    expect(typeof localStorageMock.setItem).toBe('function');
  });

  test('server-api functions exist and are callable', () => {
    const serverApi = require('../../brewnode/server-api.js');
    
    // Test that functions exist
    expect(serverApi.boil).toBeDefined();
    expect(serverApi.fill).toBeDefined();
    expect(serverApi.sensorStatus).toBeDefined();
    expect(serverApi.Heater).toBeDefined();
    expect(serverApi.PumpKettle).toBeDefined();
  });
});