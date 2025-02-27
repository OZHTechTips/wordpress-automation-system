#!/bin/bash

# This script installs Node.js and NPM on your system
# It detects your operating system and uses the appropriate method

# Exit on error
set -e

echo "Installing Node.js and NPM..."

# Check if we're on Linux
if [ -f /etc/os-release ]; then
    # Get Linux distribution
    . /etc/os-release
    
    # Ubuntu/Debian
    if [ "$ID" = "ubuntu" ] || [ "$ID" = "debian" ] || [ "$ID_LIKE" = "ubuntu" ] || [ "$ID_LIKE" = "debian" ]; then
        echo "Detected Ubuntu/Debian-based system"
        echo "Installing Node.js using apt..."
        sudo apt update
        sudo apt install -y nodejs npm
    
    # CentOS/RHEL/Fedora
    elif [ "$ID" = "centos" ] || [ "$ID" = "rhel" ] || [ "$ID" = "fedora" ] || [ "$ID_LIKE" = "rhel" ] || [ "$ID_LIKE" = "fedora" ]; then
        echo "Detected CentOS/RHEL/Fedora-based system"
        echo "Installing Node.js using dnf/yum..."
        if command -v dnf &> /dev/null; then
            sudo dnf install -y nodejs npm
        else
            sudo yum install -y nodejs npm
        fi
    
    # Other Linux
    else
        echo "Using Node.js binary installation for Linux..."
        curl -fsSL https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.xz -o node.tar.xz
        sudo mkdir -p /usr/local/lib/nodejs
        sudo tar -xJf node.tar.xz -C /usr/local/lib/nodejs
        echo 'export PATH=/usr/local/lib/nodejs/node-v18.18.0-linux-x64/bin:$PATH' >> ~/.profile
        source ~/.profile
        rm node.tar.xz
    fi

# Check if we're on macOS
elif [ "$(uname)" = "Darwin" ]; then
    echo "Detected macOS"
    
    # Check if Homebrew is installed
    if command -v brew &> /dev/null; then
        echo "Installing Node.js using Homebrew..."
        brew install node
    else
        echo "Homebrew not found. Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        echo "Installing Node.js using Homebrew..."
        brew install node
    fi

# Fallback for other systems
else
    echo "Could not detect operating system."
    echo "Please install Node.js manually from https://nodejs.org/"
    exit 1
fi

# Verify installation
echo "Verifying Node.js and NPM installation..."
node -v
npm -v

echo "Node.js and NPM have been successfully installed!"