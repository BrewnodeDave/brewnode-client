# BrewNode Client GUI Testing

This directory contains comprehensive GUI tests for the BrewNode brewing client application built with React.

## Test Structure

All tests are now organized in the `/src/tests` folder:

```
src/
├── setupTests.js              # Jest configuration and global mocks
└── tests/
    ├── App.test.js           # Main App component tests
    ├── integration.test.js   # Full application integration tests
    ├── e2e.test.js          # End-to-end browser tests
    ├── pages/
    │   └── BasicTabs.test.js # Tab navigation tests
    └── brewnode/
        ├── Fill.test.js      # Fill component tests
        └── Temperature.test.js # Temperature component tests
```

## Test Types

### 1. Unit Tests
- **src/tests/App.test.js** - Tests the main App component, state management, and context
- **src/tests/pages/BasicTabs.test.js** - Tests tab navigation and component switching
- **src/tests/brewnode/Fill.test.js** - Tests the brewing fill functionality
- **src/tests/brewnode/Temperature.test.js** - Tests temperature monitoring components

### 2. Integration Tests
- **src/tests/integration.test.js** - Tests full application workflows and component interactions

### 3. End-to-End Tests
- **src/tests/e2e.test.js** - Browser-based tests using Puppeteer (requires installation)

## Running Tests

### Quick Start
```bash
# Run all tests once
npm test -- --watchAll=false

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test App.test.js

# Run tests in watch mode (development)
npm test
```

### Using the GUI Test Runner
```bash
# Make executable (if needed)
chmod +x run-gui-tests.js

# Run comprehensive GUI test suite
node run-gui-tests.js
```

This will:
- Discover all test files
- Run tests with coverage
- Generate an HTML report
- Display results in the terminal

### End-to-End Browser Tests

**Prerequisites:**
```bash
# Install Puppeteer for browser automation
npm install --save-dev puppeteer
```

**Running E2E Tests:**
```bash
# Start your app first
npm start  # In one terminal

# Run E2E tests
node src/e2e.test.js  # In another terminal
```

## Test Coverage

### Components Tested
- ✅ **App Component** - Main application structure, state management, context provider
- ✅ **BasicTabs** - Tab navigation, batch data loading, error handling
- ✅ **Fill Component** - Brewing fill controls, slider interactions, API calls
- ✅ **Temperature Component** - Temperature monitoring, socket communication, localStorage
- ✅ **Integration** - Full application workflows, component interactions

### Features Tested
- Component rendering and props
- User interactions (clicks, form inputs, sliders)
- State management and React Context
- API integration and error handling
- Socket communication for real-time updates
- LocalStorage persistence
- Responsive design elements
- Accessibility features
- Tab navigation
- Form validation
- Error boundaries

### Browser Testing Features
- Cross-browser compatibility
- Mobile responsiveness  
- Real user interactions
- Network error handling
- Performance testing
- Visual regression testing (can be extended)

## Test Setup and Configuration

### Jest Configuration
The project uses Create React App's built-in Jest configuration with:
- React Testing Library for component testing
- jest-dom for custom DOM matchers
- Setup file: `src/setupTests.js`

### Mock Setup
Tests include comprehensive mocks for:
- Socket connections (`socketListener.js`)
- API calls (`server-api.js`)
- Browser APIs (localStorage, fetch, WebSocket)
- External components and libraries

### Test Environment
- **Node Environment** for unit/integration tests
- **jsdom** for DOM simulation
- **Puppeteer** for real browser testing

## Adding New Tests

### For New Components
1. Create `YourComponent.test.js` in the same directory as your component
2. Follow the existing test patterns:
   ```javascript
   import { render, screen, fireEvent } from '@testing-library/react';
   import YourComponent from './YourComponent';
   
   describe('YourComponent', () => {
     test('renders correctly', () => {
       render(<YourComponent />);
       expect(screen.getByText('Expected Text')).toBeInTheDocument();
     });
   });
   ```

### For Integration Tests
Add new test cases to `integration.test.js` that test multiple components working together.

### For E2E Tests
Add new scenarios to `e2e.test.js` that test user workflows in a real browser.

## Continuous Integration

### GitHub Actions Example
```yaml
name: GUI Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test -- --coverage --watchAll=false
    - run: npm run build
```

### Test Reports
- Coverage reports generated in `coverage/` directory
- HTML test report generated as `test-report.html`
- Jest outputs detailed test results to console

## Debugging Tests

### Common Issues
1. **Tests timeout** - Increase timeout in test files or mock async operations
2. **Components not rendering** - Check if all required props are provided
3. **API calls failing** - Verify mocks are properly configured
4. **Socket tests failing** - Ensure socket listeners are mocked

### Debug Commands
```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test with debug info
npm test -- --testNamePattern="your test name"

# Generate coverage report
npm test -- --coverage --coverageReporters=html
```

## Performance Considerations

- Mock heavy dependencies (charts, large components)
- Use `screen.getByTestId()` for reliable element selection
- Avoid testing implementation details, focus on user behavior
- Group related tests in describe blocks
- Clean up after tests (clear mocks, reset state)

## Best Practices

1. **Test User Behavior** - Test what users actually do, not implementation details
2. **Use Semantic Queries** - Prefer `getByRole`, `getByText` over `getByTestId`
3. **Mock External Dependencies** - Don't test third-party libraries
4. **Keep Tests Simple** - One concept per test
5. **Use Descriptive Names** - Test names should explain what they verify
6. **Test Error Cases** - Include tests for error states and edge cases

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Puppeteer Documentation](https://pptr.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
