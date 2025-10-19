#!/bin/bash

# ARM Browser Installation Helper for BrewNode Client E2E Tests

echo "🔧 BrewNode E2E Test Browser Setup for ARM Systems"
echo "=================================================="

# Detect the system
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux system detected"
    
    # Check if running on Debian/Ubuntu based system
    if command -v apt-get &> /dev/null; then
        echo "Installing Chromium via apt-get..."
        sudo apt-get update
        sudo apt-get install -y chromium-browser
        
    # Check if running on Red Hat based system  
    elif command -v dnf &> /dev/null; then
        echo "Installing Chromium via dnf..."
        sudo dnf install -y chromium
        
    # Check if running on older Red Hat system
    elif command -v yum &> /dev/null; then
        echo "Installing Chromium via yum..."
        sudo yum install -y chromium
        
    # Check if running on Arch based system
    elif command -v pacman &> /dev/null; then
        echo "Installing Chromium via pacman..."
        sudo pacman -S --noconfirm chromium
        
    else
        echo "❌ Unable to detect package manager"
        echo "Please install chromium manually for your distribution"
        exit 1
    fi
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macOS detected"
    if command -v brew &> /dev/null; then
        echo "Installing Chromium via Homebrew..."
        brew install chromium
    else
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

echo ""
echo "✅ Browser installation completed!"
echo ""
echo "Verifying installation..."

# Check for installed browsers
BROWSERS=("/usr/bin/chromium-browser" "/usr/bin/chromium" "/usr/bin/google-chrome-stable" "/usr/bin/google-chrome")
FOUND_BROWSER=false

for browser in "${BROWSERS[@]}"; do
    if [[ -x "$browser" ]]; then
        echo "✅ Found: $browser"
        FOUND_BROWSER=true
    fi
done

if [[ "$FOUND_BROWSER" == "true" ]]; then
    echo ""
    echo "🎉 Browser setup complete! You can now run E2E tests:"
    echo "npm run test:e2e"
else
    echo ""
    echo "⚠️  No browsers found. Installation may have failed."
    echo "Try installing manually:"
    echo "  Ubuntu/Debian: sudo apt-get install chromium-browser"
    echo "  Fedora/RHEL: sudo dnf install chromium"
    echo "  Arch: sudo pacman -S chromium"
fi