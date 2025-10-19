@echo off
REM Post-install script for Windows - BrewNode Client

echo Running post-install setup...
echo Platform: Windows, Architecture: %PROCESSOR_ARCHITECTURE%

REM Check if Puppeteer is installed
if exist "node_modules\puppeteer" (
    echo ✓ Puppeteer found
    
    REM Test Puppeteer import
    node -e "try { require('puppeteer'); console.log('✓ Puppeteer can be imported successfully'); } catch (e) { console.warn('⚠ Puppeteer import failed:', e.message); console.log('   E2E tests will be skipped automatically'); }" 2>nul
    
    REM Provide Windows-specific guidance for ARM systems
    if "%PROCESSOR_ARCHITECTURE%"=="ARM64" (
        echo 🔧 ARM architecture detected
        echo    If E2E tests fail, consider installing Chrome manually:
        echo    Download from: https://www.google.com/chrome/
    )
) else (
    echo ℹ Puppeteer not found (this is okay for production builds)
)

REM Ensure test directories exist
if not exist "src\__mocks__" mkdir "src\__mocks__"
if not exist "coverage" mkdir "coverage"

echo ✓ Post-install setup complete