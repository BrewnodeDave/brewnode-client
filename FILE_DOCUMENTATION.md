# BrewNode Client - Complete File Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Configuration Files](#configuration-files)
3. [Build Output](#build-output)
4. [Public Assets](#public-assets)
5. [Source Code Structure](#source-code-structure)
6. [Core Application](#core-application)
7. [BrewNode Components](#brewnode-components)
8. [Common Components](#common-components)
9. [UI Components](#ui-components)
10. [Pages & Navigation](#pages--navigation)
11. [Test Suite](#test-suite)
12. [Development Tools](#development-tools)
13. [File Organization Summary](#file-organization-summary)

---

## Project Overview

The **BrewNode Client** is a React-based web application that provides a comprehensive user interface for controlling and monitoring brewing processes. It serves as the frontend for the BrewNode brewing automation system.

**Key Technologies:**
- React 18.2.0 with Hooks and Context API
- Material-UI (MUI) v5 for modern UI components
- React Router v6.28.0 for navigation
- Socket.IO for real-time communication
- Chart.js and Highcharts for data visualization
- Jest and React Testing Library for testing
- Axios for HTTP requests

**Project Size:** ~100+ files, ~10,000+ lines of code
**Architecture:** Component-based SPA with real-time data integration

---

## Configuration Files

### `package.json`
**Purpose:** NPM package configuration and dependency management
**Key Features:**
- React 18.2.0 with modern tooling
- Material-UI v5 for component library
- Socket.IO 4.7.5 for real-time communication
- Testing suite with Jest and React Testing Library
- Build tools via Create React App

**Key Dependencies:**
```json
{
  "react": "^18.2.0",
  "@mui/material": "^5.11.10",
  "socket.io-client": "4.7.5",
  "react-router-dom": "^6.28.0",
  "chart.js": "^4.4.6",
  "axios": "^1.7.7"
}
```

### `jest.config.js`
**Purpose:** Jest testing framework configuration
**Key Features:**
- Custom test environment setup
- Coverage reporting configuration
- Test file pattern matching
- Mock configurations for external dependencies

---

## Build Output

### `build/` Directory
**Purpose:** Production build output from `npm run build`
**Generated Files:**
- `index.html` - Main HTML entry point
- `asset-manifest.json` - Build asset mapping
- `static/css/` - Compiled CSS bundles with source maps
- `static/js/` - Compiled JavaScript bundles with source maps
- Public assets (favicon, logos, manifest, robots.txt)

**Build Characteristics:**
- Minified and optimized for production
- Code splitting for efficient loading
- Source maps for debugging
- Progressive Web App compatible

---

## Public Assets

### `public/` Directory
**Purpose:** Static assets served directly by the web server

#### Core Files
- **`index.html`** - Main HTML template with React root element
- **`favicon.ico`** - Browser tab icon
- **`manifest.json`** - Progressive Web App configuration
- **`robots.txt`** - Search engine crawler instructions

#### Images & Icons
- **`logo192.png`** - 192x192 app icon for PWA
- **`logo512.png`** - 512x512 app icon for PWA

#### Button Assets (`static/buttons/`)
- **`pump-off.jpg`** - Pump control UI (off state)
- **`pump-on.jpg`** - Pump control UI (on state)

#### Ingredient Images (`static/images/`)
- **`brewfather.png`** - Brewfather integration logo
- **`hops.jpeg`** / **`hops.jpg`** - Hop ingredient imagery
- **`malt.jpeg`** / **`malt.jpg`** - Malt ingredient imagery
- **`yeast.jpg`** / **`yeast.png`** - Yeast ingredient imagery

---

## Source Code Structure

### `src/` Directory
**Purpose:** Main React application source code
**Organization:** Feature-based with shared components

---

## Core Application

### `App.js`
**Purpose:** Main application component and root state management
**Key Features:**
- React Context provider for global state
- Socket.IO connection management
- Recipe data management
- Error boundary implementation
- Theme provider integration

**Key State:**
- `fetchRecipe` - Recipe loading flag
- Socket connection for real-time updates
- Global brewing context for child components

### `index.js`
**Purpose:** React application entry point
**Functions:**
- React DOM root creation
- Service worker registration
- Performance monitoring setup
- App component mounting

### `setupTests.js`
**Purpose:** Jest test environment configuration
**Key Features:**
- React Testing Library setup
- Custom matchers from `@testing-library/jest-dom`
- Global test utilities
- Mock configurations for consistent testing
- React Router future flag warning suppression

---

## BrewNode Components

### Core Brewing Components (`src/brewnode/`)

#### `Boil.jsx`
**Purpose:** Boiling process control interface
**Features:**
- Boil temperature monitoring
- Timing controls
- Safety monitoring
- Real-time status updates

#### `Brewfather.jsx`
**Purpose:** Brewfather integration and recipe display
**Key Functions:**
- `decodeBatch(body)` - Parse Brewfather batch data
- Recipe data visualization
- Ingredient display integration
- External API data handling

#### `Ferment.jsx`
**Purpose:** Fermentation process control
**Features:**
- Fermentation temperature control
- Time-based fermentation profiles
- Monitoring and alerts
- Process automation interface

#### `Fill.jsx`
**Purpose:** Tank filling operations control
**Features:**
- Volume control with sliders
- Flow rate monitoring
- Fill level indicators
- Safety interlocks

#### `Heater.jsx`
**Purpose:** Heating element control interface
**Features:**
- Temperature setpoint control
- PWM heating control
- Safety temperature limits
- Real-time heating status

#### `Ingredients.jsx`
**Purpose:** Recipe ingredient display component
**Key Features:**
- Fermentables display with malt imagery
- Hops schedule with hop imagery
- Yeast information with yeast imagery
- Ingredient quantity calculations
- Visual ingredient categorization

**Props Interface:**
```javascript
function Ingredients({
  fermentables = [], 
  hops = [], 
  yeasts = []
})
```

#### `Kettle2Ferment.jsx`
**Purpose:** Kettle to fermenter transfer control
**Features:**
- Transfer valve control
- Flow monitoring
- Temperature preservation
- Process automation

#### `Kettle2Mash.jsx`
**Purpose:** Kettle to mash tun transfer control
**Features:**
- Mash transfer operations
- Temperature management during transfer
- Volume tracking
- Process coordination

#### `KettleTemp.jsx`
**Purpose:** Kettle temperature monitoring and control
**Features:**
- Real-time temperature display
- Setpoint adjustment
- PID control interface
- Temperature graphing

#### `Log.jsx`
**Purpose:** Process logging and history display
**Features:**
- Brewing process log display
- Historical data access
- Event timeline
- Export functionality

#### `Mash2Kettle.jsx`
**Purpose:** Mash to kettle transfer control
**Features:**
- Lautering process control
- Sparge water management
- Runoff monitoring
- Transfer automation

#### `Power.jsx`
**Purpose:** System power management interface
**Features:**
- Equipment power control
- Safety shutdowns
- Power status monitoring
- Emergency stops

#### `PowerMenu.jsx`
**Purpose:** Power control menu interface
**Features:**
- Centralized power controls
- Equipment status overview
- Safety controls
- System management

#### `Temperature.jsx`
**Purpose:** Temperature monitoring system
**Key Features:**
- Multi-sensor temperature display
- Real-time updates via Socket.IO
- Local storage for settings persistence
- Temperature trend visualization
- Sensor status monitoring

**Socket Integration:**
- Listens for real-time temperature updates
- Handles sensor disconnection events
- Maintains connection state

### Service Layer (`src/brewnode/`)

#### `php-service.js`
**Purpose:** Legacy PHP API service interface
**Status:** Legacy integration layer
**Functions:** Bridge between React app and PHP backend services

#### `server-api.js`
**Purpose:** Main API service layer for BrewNode server communication
**Key Functions:**
- HTTP request management
- API endpoint definitions
- Error handling and retry logic
- Response data transformation

#### `socketListener.js`
**Purpose:** Socket.IO client management
**Key Functions:**
- `addSocketListener(event, callback)` - Register event listeners
- `removeSocketListener(event, callback)` - Cleanup listeners
- Connection state management
- Real-time event handling

#### `temp.js`
**Purpose:** Temperature calculation utilities
**Functions:**
- Temperature conversion utilities
- Sensor data processing
- Temperature validation
- Calibration functions

---

## Common Components

### Shared Components (`src/common/`)

#### Styling Files
- **`App.css`** - Main application styles and theme
- **`global.css`** - Global CSS variables and typography
- **`index.css`** - Base HTML and body styling

#### Reusable Components

#### `countdown.jsx`
**Purpose:** Timer countdown component for brewing processes
**Features:**
- Configurable countdown timers
- Visual countdown display
- Completion callbacks
- Pause/resume functionality

#### `Sensor.jsx`
**Purpose:** Generic sensor display component
**Features:**
- Real-time sensor value display
- Status indicators (connected/disconnected)
- Configurable units and formatting
- Error state handling

#### `Toggle.jsx`
**Purpose:** Reusable toggle switch component
**Features:**
- Boolean state toggle
- Custom styling integration
- Callback handling for state changes
- Accessibility features

---

## UI Components

### Advanced Components (`src/components/`)

#### `CombinedGraph.jsx`
**Purpose:** Multi-series data visualization component
**Features:**
- Time-series data plotting
- Multiple data series support
- Interactive zooming and panning
- Real-time data updates
- Export functionality

**Props:**
- `brewname` - Brew session identifier for data filtering

#### `EggTimer.jsx`
**Purpose:** Visual countdown timer with circular progress
**Features:**
- Circular progress indicator
- Configurable duration
- Visual and audio alerts
- Pause/resume functionality

#### `FileStreamer.jsx`
**Purpose:** Log file streaming and pagination component
**Key Features:**
- Real-time log file streaming
- Paginated display with navigation controls
- Monospace font for proper log formatting
- Previous/Next page navigation
- Configurable lines per page

**UI Controls:**
```jsx
<button onClick={handlePreviousPage} disabled={currentPage === 1}>
  Previous
</button>
<span>Page {currentPage} of {totalPages}</span>
<button onClick={handleNextPage} disabled={currentPage === totalPages}>
  Next
</button>
```

---

## Pages & Navigation

### Main Pages (`src/pages/`)

#### `BasicTabs.jsx`
**Purpose:** Main application navigation with tab interface
**Key Features:**
- Material-UI Tabs for navigation
- Batch data loading and management
- Error dialog integration
- Context integration for global state

**Tab Structure:**
1. **Manual Tab** - Manual brewing controls
2. **Automatic Tab** - Automated brewing processes
3. **Devices Tab** - Hardware device management
4. **Graphs Tab** - Data visualization
5. **Log Tab** - Process logging

**State Management:**
- Batch data from server API
- Error state handling
- Active tab selection
- Loading states

#### `AutomaticTab.jsx`
**Purpose:** Automated brewing process interface
**Key Components:**
- `AutoFill` - Automated filling operations
- `AutoKettleTemp` - Automatic temperature control
- `AutoFerment` - Automated fermentation management
- `AutoMash` - Automated mashing process
- `Process` - Overall process coordination

**Layout:** Grid-based responsive design with colored sections

#### `ManualTab.jsx`
**Purpose:** Manual brewing control interface
**Key Components:**
- `Fill` - Manual tank filling controls
- `KettleTemp` - Manual temperature control
- `Boil` - Boiling process controls
- `Ferment` - Fermentation management

**Layout:** Two-column grid layout for optimal control organization

#### `Controls.jsx`
**Purpose:** Comprehensive brewing controls page
**Features:**
- Complete brewing process control suite
- All brewing components integrated
- Responsive grid layout
- Real-time status monitoring

#### `Devices.jsx`
**Purpose:** Hardware device management interface
**Features:**
- Device status monitoring
- Hardware control interfaces
- Sensor readings display
- Device configuration options

### Automated Process Pages (`src/pages/auto/`)

#### `AutoFerment.jsx`
**Purpose:** Automated fermentation control
**Features:**
- Temperature profile automation
- Time-based fermentation stages
- Monitoring and alerting
- Process safety controls

#### `AutoFill.jsx`
**Purpose:** Automated filling operations
**Features:**
- Volume-based filling automation
- Flow rate control
- Level monitoring
- Safety interlocks

#### `AutoKettleTemp.jsx`
**Purpose:** Automated kettle temperature control
**Features:**
- PID temperature control
- Setpoint scheduling
- Ramp/soak profiles
- Temperature safety monitoring

#### `AutoMash.jsx`
**Purpose:** Automated mashing process control
**Key Features:**
- Mash step temperature control
- Time-based step progression
- Recipe-driven automation
- Toggle controls for manual override

**Component Structure:**
```jsx
function AutoMash(props) {
  // Recipe-based mash step automation
  // Temperature control integration
  // Manual override capabilities
}
```

#### `Process.jsx`
**Purpose:** Overall brewing process coordination
**Features:**
- Multi-stage process management
- Process state tracking
- Automated transitions between stages
- Process monitoring and logging

---

## Test Suite

### Test Organization (`src/tests/`)

#### Main Test Files

#### `App.test.js`
**Purpose:** Main App component testing
**Test Coverage:**
- Context provider functionality
- State management
- Socket integration
- Error handling
- Component rendering

#### `integration.test.js`
**Purpose:** Full application integration testing
**Test Coverage:**
- Component interactions
- Data flow between components
- API integration
- Socket communication
- User workflow testing

#### `e2e.test.js`
**Purpose:** End-to-end browser testing with Puppeteer
**Test Coverage:**
- Real browser interactions
- Cross-browser compatibility
- Performance testing
- Visual regression testing
- User journey validation

### Component Tests

#### `tests/pages/BasicTabs.test.js`
**Purpose:** Tab navigation and switching functionality
**Key Test Cases:**
- Tab rendering without crashing
- Correct tab label display
- Tab switching functionality
- Batch data loading
- Error state handling

**Mock Strategy:**
- Comprehensive component mocking
- API service mocking
- Socket listener mocking
- Context provider mocking

#### `tests/brewnode/Fill.test.js`
**Purpose:** Fill component functionality testing
**Test Coverage:**
- Slider interactions
- Volume calculations
- API calls and responses
- Error handling
- State management

#### `tests/brewnode/Temperature.test.js`
**Purpose:** Temperature monitoring system testing
**Test Coverage:**
- Sensor data display
- Socket communication
- Local storage integration
- Real-time updates
- Error state handling

### Error Components

#### `Error.jsx`
**Purpose:** Application error dialog component
**Features:**
- Error message display
- User-dismissible dialogs
- Error state management
- Graceful error handling

**Props Interface:**
```jsx
function ErrorDialog({ open, message, onClose }) {
  // Error display logic
}
```

### Additional Test Files

#### `debug-temperature.test.js`
**Purpose:** Temperature system debugging and testing
**Features:**
- Temperature sensor validation
- Socket communication debugging
- Real-time data flow testing
- Sensor error simulation

---

## Development Tools

### `run-gui-tests.js`
**Purpose:** Comprehensive test execution and reporting tool
**Key Features:**
- Automated test suite execution
- HTML test report generation
- Coverage analysis
- Browser testing coordination
- Performance metrics collection

**Generated Report Features:**
- Test coverage overview
- Component testing status
- Feature testing checklist
- Browser compatibility results
- Performance benchmarks

### `GUI_TESTING.md`
**Purpose:** Comprehensive testing documentation
**Contents:**
- Testing strategy overview
- Test types and coverage
- Component testing guidelines
- Integration testing patterns
- End-to-end testing procedures
- Browser testing instructions
- Best practices and conventions

### `README.md`
**Purpose:** Project documentation and setup instructions
**Key Sections:**
- Getting Started with Create React App
- Available Scripts and Commands
- Project Maintenance History
- Build and Deployment Instructions
- Learning Resources and Documentation Links

---

## File Organization Summary

```
brewnode-client/
├── 📄 Configuration
│   ├── package.json              # NPM dependencies & scripts
│   └── jest.config.js           # Test configuration
├── 🏗️ Build Output
│   └── build/                   # Production build artifacts
├── 🎨 Public Assets
│   ├── index.html               # HTML entry point
│   └── static/                  # Images & icons
├── ⚛️ React Application
│   ├── App.js                   # Main app & context
│   ├── index.js                 # Application entry point
│   └── setupTests.js            # Test environment setup
├── 🍺 BrewNode Components
│   └── brewnode/                # Brewing process controls
│       ├── Boil.jsx             # Boiling process
│       ├── Ferment.jsx          # Fermentation control
│       ├── Fill.jsx             # Tank filling operations
│       ├── Temperature.jsx      # Temperature monitoring
│       ├── Ingredients.jsx      # Recipe ingredients display
│       └── server-api.js        # API service layer
├── 🔧 Common Components
│   └── common/                  # Reusable UI components
│       ├── App.css              # Main application styles
│       ├── Toggle.jsx           # Toggle switch component
│       └── Sensor.jsx           # Generic sensor display
├── 📊 UI Components
│   └── components/              # Advanced UI components
│       ├── CombinedGraph.jsx    # Multi-series data visualization
│       ├── EggTimer.jsx         # Circular countdown timer
│       └── FileStreamer.jsx     # Log file pagination
├── 📱 Pages & Navigation
│   └── pages/                   # Main application pages
│       ├── BasicTabs.jsx        # Main navigation tabs
│       ├── AutomaticTab.jsx     # Automated processes
│       ├── ManualTab.jsx        # Manual controls
│       └── auto/                # Automated process components
├── 🧪 Test Suite
│   └── tests/                   # Comprehensive test coverage
│       ├── App.test.js          # Main app testing
│       ├── integration.test.js  # Integration testing
│       ├── pages/               # Page component tests
│       └── brewnode/            # BrewNode component tests
└── 🛠️ Development Tools
    ├── run-gui-tests.js         # Test execution & reporting
    └── GUI_TESTING.md           # Testing documentation
```

**Total Files:** ~100+ files
**Total Lines of Code:** ~10,000+ lines
**Primary Technology:** React 18 with Material-UI
**Architecture:** Component-based SPA with real-time integration
**Deployment:** Create React App build system

---

## Key Features Summary

### 🎯 Core Functionality
- **Real-time Brewing Control** - Complete brewing process automation
- **Temperature Management** - Multi-sensor monitoring with PID control
- **Process Automation** - Recipe-driven automated brewing sequences
- **Data Visualization** - Real-time charts and historical trending
- **Brewfather Integration** - External recipe and batch management

### 🔧 Technical Features
- **Modern React Architecture** - Hooks, Context API, and functional components
- **Real-time Communication** - Socket.IO for live data updates
- **Responsive Design** - Material-UI components with mobile support
- **Comprehensive Testing** - Unit, integration, and E2E test coverage
- **Production Ready** - Optimized builds with code splitting

### 🛡️ Quality Assurance
- **47+ Comprehensive Tests** - Complete test coverage across all components
- **Type Safety** - PropTypes validation for component interfaces
- **Error Handling** - Graceful error states and user feedback
- **Performance Optimized** - Efficient rendering and data management
- **Accessibility Ready** - WCAG compliant UI components

This documentation provides a complete overview of all files, components, and functionality within the BrewNode Client application, making it easy for developers to understand, maintain, and extend the brewing control system.