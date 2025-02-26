#!/bin/bash

# setup-local-certs.sh
# Script to create local SSL certificates for development

# Create certificates directory if it doesn't exist
mkdir -p certificates

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "mkcert is not installed. Installing mkcert..."
    
    # Check OS and install mkcert accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install mkcert
            brew install nss # for Firefox support
        else
            echo "Homebrew is not installed. Please install Homebrew first:"
            echo "https://brew.sh/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y libnss3-tools
            # Download and install mkcert
            curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
            chmod +x mkcert-v*-linux-amd64
            sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
        else
            echo "Could not automatically install mkcert. Please install manually:"
            echo "https://github.com/FiloSottile/mkcert#installation"
            exit 1
        fi
    elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* ]]; then
        # Windows
        echo "On Windows, please install mkcert manually using:"
        echo "choco install mkcert"
        echo "or download from: https://github.com/FiloSottile/mkcert/releases"
        exit 1
    else
        echo "Unsupported operating system. Please install mkcert manually:"
        echo "https://github.com/FiloSottile/mkcert#installation"
        exit 1
    fi
fi

# Initialize mkcert's local CA if not already set up
echo "Setting up mkcert local certificate authority..."
mkcert -install

# Generate certificates for localhost
echo "Generating certificates for localhost..."
cd certificates
mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost 127.0.0.1 ::1

echo ""
echo "✅ Certificates successfully created in the 'certificates' directory"
echo "   - Certificate: $(pwd)/localhost.pem"
echo "   - Private key: $(pwd)/localhost-key.pem"
echo ""
echo "These certificates have been automatically trusted on your system."
echo "You can now use them in your Vite configuration."