#!/usr/bin/env node

/**
 * Post-install script to handle cross-platform setup
 * Particularly for handling Puppeteer browser binaries on different architectures
 */

const fs = require('fs');
const path = require('path');

console.log('Running post-install setup...');
console.log(`Platform: ${process.platform}, Architecture: ${process.arch}`);

// Check if Puppeteer is installed
try {
  const puppeteerPath = path.join(process.cwd(), 'node_modules', 'puppeteer');
  if (fs.existsSync(puppeteerPath)) {
    console.log('✓ Puppeteer found');
    
    // For ARM systems, provide additional guidance
    if (process.arch === 'arm64' || process.arch === 'arm') {
      console.log('🔧 ARM architecture detected');
      console.log('   If E2E tests fail, consider installing system Chrome/Chromium:');
      
      if (process.platform === 'linux') {
        console.log('   Ubuntu/Debian: sudo apt-get install chromium-browser');
        console.log('   Fedora/RHEL: sudo dnf install chromium');
        console.log('   Arch: sudo pacman -S chromium');
      } else if (process.platform === 'darwin') {
        console.log('   macOS: brew install chromium');
      }
    }
    
    // Test Puppeteer browser installation
    try {
      require('puppeteer');
      console.log('✓ Puppeteer can be imported successfully');
    } catch (error) {
      console.warn('⚠ Puppeteer import failed:', error.message);
      console.log('   E2E tests will be skipped automatically');
    }
  } else {
    console.log('ℹ Puppeteer not found (this is okay for production builds)');
  }
} catch (error) {
  console.warn('⚠ Error checking Puppeteer setup:', error.message);
}

// Ensure test directories exist
const testDirs = [
  path.join(process.cwd(), 'src', '__mocks__'),
  path.join(process.cwd(), 'coverage')
];

testDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Created directory: ${path.relative(process.cwd(), dir)}`);
    } catch (error) {
      console.warn(`⚠ Could not create directory ${dir}:`, error.message);
    }
  }
});

console.log('✓ Post-install setup complete');