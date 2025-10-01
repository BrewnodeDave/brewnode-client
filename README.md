# 🍺 BrewNode Client

A comprehensive React-based web application for controlling and monitoring automated brewing processes. This client provides a modern, responsive user interface for the BrewNode brewing automation system.

## 🚀 Features

- **Real-time Brewing Control** - Complete brewing process automation and monitoring
- **Temperature Management** - Multi-sensor temperature monitoring with PID control
- **Process Automation** - Recipe-driven automated brewing sequences
- **Data Visualization** - Real-time charts and historical data trending
- **Brewfather Integration** - External recipe and batch management system
- **Mobile-Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Communication** - Live updates via Socket.IO connection

## 🛠️ Technology Stack

- **React 18.2.0** - Modern React with Hooks and Context API
- **Material-UI v5** - Comprehensive React component library
- **Socket.IO Client** - Real-time bidirectional communication
- **React Router v6.28.0** - Client-side routing and navigation
- **Chart.js & Highcharts** - Advanced data visualization
- **Axios** - HTTP client for API communication
- **Jest & React Testing Library** - Comprehensive testing framework

## 📚 Documentation

- **[📄 Complete File Documentation](FILE_DOCUMENTATION.md)** - Comprehensive overview of all files, components, and functionality
- **[🧪 GUI Testing Guide](GUI_TESTING.md)** - Complete testing documentation and strategies
- **[🔧 Create React App Docs](#getting-started-with-create-react-app)** - Standard Create React App documentation

## 🏃‍♂️ Quick Start

### Development Mode
```bash
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
```bash
npm run build
npm install -g serve
serve -s build
```

### Testing
```bash
npm test              # Interactive test runner
npm run test:coverage # Generate coverage report
```

## 🚀 Deployment & Autostart

### Install http-server globally
```bash
npm i http-server -g
```

### Autostart Client
Add to `/etc/rc.local`:
```bash
/home/dave/.nvm/versions/node/v20.18.3/bin/http-server -p 3000 /home/dave/git/brewnode-client/build &
```

### Autostart Kiosk Mode
Add to `~/.config/lxsession/LXDE-pi/autostart`:
```bash
@chromium-browser --kiosk http://localhost:3000/
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## 🔧 Project Maintenance

### Recent Updates (October 2025)
- ✅ **Complete File Documentation** - Added comprehensive `FILE_DOCUMENTATION.md` covering all 100+ files
- ✅ **Enhanced README** - Improved project overview and documentation structure
- ✅ **Documentation Organization** - Clear documentation index with technical specifications

### Recent Cleanup (September 2025)
- ✅ Removed unused backup and duplicate test files
- ✅ Consolidated test directory structure (`/tests` → `/src/tests`)
- ✅ Removed obsolete configuration files
- ✅ Cleaned up unused React components
- ✅ All tests passing: 47/47 ✓
- ✅ React Router future flag warnings suppressed

### Project Statistics
- **Total Files:** ~100+ files documented
- **Lines of Code:** ~10,000+ lines
- **Test Coverage:** 47+ comprehensive tests
- **Components:** 30+ React components
- **Architecture:** Modern React SPA with real-time integration
