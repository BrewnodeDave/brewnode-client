/**
 * End-to-End Browser Tests for BrewNode Client
 * 
 * These tests focus on basic Puppeteer functionality and browser automation
 * without requiring a running server.
 */

// Polyfill setImmediate for compatibility
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));

let puppeteer;
let skipE2ETests = false;

try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('Puppeteer not installed. E2E tests will be skipped.');
  skipE2ETests = true;
}

// Helper function to check if a browser executable exists and is executable
function checkBrowserExecutable(path) {
  const fs = require('fs');
  try {
    // Check if file exists
    if (!fs.existsSync(path)) {
      return false;
    }
    
    // Check if it's executable
    fs.accessSync(path, fs.constants.F_OK | fs.constants.X_OK);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get platform-specific browser launch options
function getBrowserLaunchOptions() {
  const baseArgs = [
    '--no-sandbox', 
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-extensions',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-web-security',
    '--disable-features=VizMonitorFeatures',
    '--disable-ipc-flooding-protection',
    '--disable-default-apps',
    '--disable-sync'
  ];

  // Add Windows-specific args
  if (process.platform === 'win32') {
    baseArgs.push('--disable-features=VizDisplayCompositor');
  }

  const options = {
    headless: true,
    args: baseArgs,
    timeout: 30000
  };

  // Force system browser on ARM systems to avoid architecture mismatch
  const isARM = process.arch === 'arm64' || process.arch === 'arm';
  
  if (isARM) {
    console.log(`ARM architecture detected (${process.arch}), using system browser`);
    
    // Common Chrome/Chromium paths on different systems
    const possiblePaths = [
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/snap/bin/chromium',
      '/usr/bin/firefox', // Firefox as fallback
      '/usr/bin/firefox-esr'
    ];

    let foundBrowser = false;
    for (const path of possiblePaths) {
      if (checkBrowserExecutable(path)) {
        console.log(`Found working browser: ${path}`);
        options.executablePath = path;
        foundBrowser = true;
        break;
      }
    }

    if (!foundBrowser) {
      console.warn('No system browser found on ARM system');
      console.warn('Paths checked:', possiblePaths);
      
      // Show what files actually exist for debugging
      const fs = require('fs');
      const existingPaths = possiblePaths.filter(path => {
        try {
          return fs.existsSync(path);
        } catch {
          return false;
        }
      });
      
      if (existingPaths.length > 0) {
        console.warn('Found these browser files but they are not executable:', existingPaths);
      } else {
        console.warn('No browser files found at standard locations');
      }
      
      throw new Error('No compatible browser found for ARM architecture. Please install chromium-browser or google-chrome.');
    }
  } else {
    // For non-ARM systems, let Puppeteer use its bundled Chrome
    console.log(`Non-ARM architecture (${process.arch}), using Puppeteer bundled Chrome`);
  }

  return options;
}

// Increase Jest timeout for E2E tests
jest.setTimeout(30000);

describe('BrewNode E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    if (!puppeteer || skipE2ETests) {
      console.log('Skipping E2E tests - Puppeteer not available');
      return;
    }
    
    try {
      const launchOptions = getBrowserLaunchOptions();
      console.log('Platform:', process.platform, 'Architecture:', process.arch);
      console.log('Launching browser with options:', JSON.stringify(launchOptions, null, 2));
      
      browser = await puppeteer.launch(launchOptions);
      page = await browser.newPage();
      
      // Set viewport for consistent testing
      await page.setViewport({ width: 1280, height: 720 });
      
      // Set longer timeout for page operations
      page.setDefaultTimeout(15000);
      
      console.log('Browser launched successfully');
      
    } catch (error) {
      console.error('Failed to launch browser:', error.message);
      console.log('Platform:', process.platform, 'Architecture:', process.arch);
      
      // Provide specific guidance for ARM systems
      if (process.arch === 'arm64' || process.arch === 'arm') {
        console.log('\n🔧 ARM System Browser Installation:');
        console.log('Ubuntu/Debian: sudo apt-get install chromium-browser');
        console.log('Raspberry Pi OS: sudo apt-get install chromium-browser');
        console.log('Fedora/RHEL: sudo dnf install chromium');
        console.log('Arch Linux: sudo pacman -S chromium');
      }
      
      // Mark tests to be skipped instead of failing
      skipE2ETests = true;
      console.warn('\nE2E tests will be skipped due to browser launch failure');
      console.warn('This is expected on systems without a compatible browser installed');
    }
  }, 45000); // 45 second timeout for browser launch (longer for ARM systems)

  afterAll(async () => {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }, 10000); // 10 second timeout for cleanup

  test('puppeteer setup works', async () => {
    if (!puppeteer || skipE2ETests) {
      console.log('Skipping test - Puppeteer not available');
      return;
    }
    
    expect(browser).toBeDefined();
    expect(page).toBeDefined();
    
    // Test basic page functionality
    await page.setContent('<html><body><h1>BrewNode Test</h1></body></html>');
    const title = await page.$eval('h1', el => el.textContent);
    expect(title).toBe('BrewNode Test');
  });

  test('can simulate tab navigation', async () => {
    if (!puppeteer || skipE2ETests) {
      console.log('Skipping test - Puppeteer not available');
      return;
    }
    
    // Create a mock BrewNode-like interface
    await page.setContent(`
      <html>
        <head><title>BrewNode Client</title></head>
        <body>
          <div role="tablist">
            <button role="tab" aria-selected="true" id="manual-tab">Manual</button>
            <button role="tab" aria-selected="false" id="automatic-tab">Automatic</button>
            <button role="tab" aria-selected="false" id="graphs-tab">Graphs</button>
            <button role="tab" aria-selected="false" id="log-tab">Log</button>
          </div>
          <div id="content">Manual Control Panel</div>
          <script>
            function selectTab(tabId, content) {
              document.querySelectorAll('[role="tab"]').forEach(tab => {
                tab.setAttribute('aria-selected', 'false');
              });
              document.getElementById(tabId).setAttribute('aria-selected', 'true');
              document.getElementById('content').textContent = content;
            }
            
            document.getElementById('manual-tab').onclick = () => selectTab('manual-tab', 'Manual Control Panel');
            document.getElementById('automatic-tab').onclick = () => selectTab('automatic-tab', 'Automatic Process Control');
            document.getElementById('graphs-tab').onclick = () => selectTab('graphs-tab', 'Temperature Graphs');
            document.getElementById('log-tab').onclick = () => selectTab('log-tab', 'System Logs');
          </script>
        </body>
      </html>
    `);
    
    // Test navigation to different tabs
    await page.click('#automatic-tab');
    await page.waitForFunction(() => 
      document.querySelector('#content').textContent === 'Automatic Process Control'
    );
    
    const automaticContent = await page.$eval('#content', el => el.textContent);
    expect(automaticContent).toBe('Automatic Process Control');
    
    // Test graphs tab
    await page.click('#graphs-tab');
    await page.waitForFunction(() => 
      document.querySelector('#content').textContent === 'Temperature Graphs'
    );
    
    const graphsContent = await page.$eval('#content', el => el.textContent);
    expect(graphsContent).toBe('Temperature Graphs');
  });

  test('can simulate temperature display', async () => {
    if (!puppeteer || skipE2ETests) {
      console.log('Skipping test - Puppeteer not available');
      return;
    }
    
    // Create a mock temperature display
    await page.setContent(`
      <html>
        <body>
          <div id="temp-display">0°C</div>
          <button id="update-temp">Update Temperature</button>
          <script>
            let temp = 0;
            document.getElementById('update-temp').onclick = function() {
              temp += 5;
              document.getElementById('temp-display').textContent = temp + '°C';
            };
          </script>
        </body>
      </html>
    `);
    
    // Initial temperature should be 0
    const initialTemp = await page.$eval('#temp-display', el => el.textContent);
    expect(initialTemp).toBe('0°C');
    
    // Click update button and check temperature changes
    await page.click('#update-temp');
    await page.waitForFunction(() => 
      document.querySelector('#temp-display').textContent === '5°C'
    );
    
    const updatedTemp = await page.$eval('#temp-display', el => el.textContent);
    expect(updatedTemp).toBe('5°C');
  });

  test('can test responsive design', async () => {
    if (!puppeteer || skipE2ETests) {
      console.log('Skipping test - Puppeteer not available');
      return;
    }
    
    await page.setContent(`
      <html>
        <head>
          <style>
            .mobile-only { display: none; }
            @media (max-width: 768px) {
              .desktop-only { display: none; }
              .mobile-only { display: block; }
            }
          </style>
        </head>
        <body>
          <div class="desktop-only">Desktop View</div>
          <div class="mobile-only">Mobile View</div>
        </body>
      </html>
    `);
    
    // Test desktop view
    await page.setViewport({ width: 1280, height: 720 });
    const desktopVisible = await page.$eval('.desktop-only', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(desktopVisible).toBe(true);
    
    // Test mobile view
    await page.setViewport({ width: 400, height: 600 });
    const mobileVisible = await page.$eval('.mobile-only', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(mobileVisible).toBe(true);
  });

  test('can handle JavaScript execution', async () => {
    if (!puppeteer || skipE2ETests) {
      console.log('Skipping test - Puppeteer not available');
      return;
    }
    
    // Create a page with JavaScript error handling
    await page.setContent(`
      <html>
        <body>
          <button id="error-button">Test Error Handling</button>
          <div id="result">No Error</div>
          <script>
            document.getElementById('error-button').onclick = function() {
              try {
                // This will cause an error
                undefinedFunction();
              } catch (e) {
                document.getElementById('result').textContent = 'Error Caught: ' + e.message;
              }
            };
          </script>
        </body>
      </html>
    `);
    
    await page.click('#error-button');
    await page.waitForFunction(() => 
      document.querySelector('#result').textContent.startsWith('Error Caught:')
    );
    
    const result = await page.$eval('#result', el => el.textContent);
    expect(result).toContain('Error Caught:');
  });
});
