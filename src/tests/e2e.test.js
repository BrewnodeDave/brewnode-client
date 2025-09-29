/**
 * End-to-End Browser Tests for BrewNode Client
 * 
 * These tests focus on basic Puppeteer functionality and browser automation
 * without requiring a running server.
 */

// Polyfill setImmediate for compatibility
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('Puppeteer not installed. E2E tests will be skipped.');
}

// Increase Jest timeout for E2E tests
jest.setTimeout(30000);

describe('BrewNode E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    if (!puppeteer) {
      console.log('Skipping E2E tests - Puppeteer not installed');
      return;
    }
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process'
        ]
      });
      page = await browser.newPage();
      
      // Set viewport for consistent testing
      await page.setViewport({ width: 1280, height: 720 });
      
      // Set longer timeout for page operations
      page.setDefaultTimeout(10000);
      
    } catch (error) {
      console.error('Failed to launch browser:', error);
      throw error;
    }
  }, 20000); // 20 second timeout for browser launch

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
    if (!puppeteer) {
      console.log('Skipping test - Puppeteer not installed');
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
    if (!puppeteer) {
      console.log('Skipping test - Puppeteer not installed');
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
    if (!puppeteer) {
      console.log('Skipping test - Puppeteer not installed');
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
    if (!puppeteer) {
      console.log('Skipping test - Puppeteer not installed');
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
    if (!puppeteer) {
      console.log('Skipping test - Puppeteer not installed');
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
