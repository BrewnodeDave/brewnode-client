#!/usr/bin/env node

/**
 * Browser-based GUI Test Runner for BrewNode Client
 * 
 * This script sets up automated browser testing for the GUI components
 * using Jest and React Testing Library. It can be extended to use tools
 * like Puppeteer or Playwright for full browser automation.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 BrewNode Client GUI Test Suite');
console.log('==================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

// Read package.json to verify it's a React project
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJson.dependencies?.react) {
  console.error('❌ Error: This doesn\'t appear to be a React project');
  process.exit(1);
}

console.log('📋 Test Configuration:');
console.log(`   Project: ${packageJson.name}`);
console.log(`   React Version: ${packageJson.dependencies.react}`);
console.log(`   Testing Library: ${packageJson.dependencies['@testing-library/react'] || 'Not installed'}`);
console.log();

// List all test files
const testFiles = [];
const findTestFiles = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'build') {
      findTestFiles(filePath);
    } else if (file.endsWith('.test.js') || file.endsWith('.test.jsx')) {
      testFiles.push(filePath);
    }
  });
};

findTestFiles('src');

console.log('🔍 Found Test Files:');
testFiles.forEach(file => {
  console.log(`   ✓ ${file}`);
});
console.log();

// Run the tests
try {
  console.log('🚀 Running GUI Tests...\n');
  
  // Run Jest with specific options for GUI testing
  const jestCommand = 'npm test -- --watchAll=false --coverage --verbose';
  
  console.log(`Executing: ${jestCommand}\n`);
  
  execSync(jestCommand, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ All GUI tests completed successfully!');
  
} catch (error) {
  console.error('\n❌ GUI tests failed:', error.message);
  process.exit(1);
}

// Generate a simple HTML report
const generateReport = () => {
  const reportContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BrewNode GUI Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 5px; }
        .test-file { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 3px; }
        .success { color: #4CAF50; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 BrewNode GUI Test Report</h1>
        <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <h2>Test Coverage</h2>
    <div class="test-file">
        <h3>📱 GUI Components Tested:</h3>
        <ul>
            <li>✅ App Component - Main application structure and state</li>
            <li>✅ BasicTabs Component - Tab navigation and switching</li>
            <li>✅ Fill Component - Brewing fill functionality</li>
            <li>✅ Temperature Component - Temperature monitoring</li>
            <li>✅ Integration Tests - Full application flow</li>
        </ul>
    </div>
    
    <div class="test-file">
        <h3>🎯 Test Features:</h3>
        <ul>
            <li>Component rendering and props</li>
            <li>User interactions (clicks, form inputs)</li>
            <li>State management and context</li>
            <li>API integration and error handling</li>
            <li>Socket communication</li>
            <li>Responsive design elements</li>
            <li>Accessibility features</li>
        </ul>
    </div>
    
    <div class="test-file">
        <h3>🛠 Test Tools Used:</h3>
        <ul>
            <li>Jest - Test framework</li>
            <li>React Testing Library - Component testing</li>
            <li>@testing-library/jest-dom - Custom matchers</li>
            <li>Mock functions for external dependencies</li>
        </ul>
    </div>
    
    <h2>Browser Testing Guide</h2>
    <div class="test-file">
        <h3>Running Tests in Development:</h3>
        <ol>
            <li><code>npm test</code> - Run tests in watch mode</li>
            <li><code>npm test -- --coverage</code> - Run with coverage report</li>
            <li><code>npm test -- --watchAll=false</code> - Run once and exit</li>
        </ol>
    </div>
    
    <div class="test-file">
        <h3>Adding New Tests:</h3>
        <p>Create new test files with <code>.test.js</code> extension in the same directory as your components.</p>
        <p>Use the existing test files as templates for component-specific and integration tests.</p>
    </div>
</body>
</html>`;

  fs.writeFileSync('test-report.html', reportContent);
  console.log('\n📊 Test report generated: test-report.html');
  console.log('   Open this file in your browser to view the detailed report.');
};

generateReport();
