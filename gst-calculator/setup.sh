#!/bin/bash

###############################################################################
# GST Calculator Playwright Test Suite - Setup Script
# This script installs all dependencies and verifies the setup
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

###############################################################################
# MAIN SETUP
###############################################################################

print_header "GST Calculator Test Suite Setup"

# Step 1: Check Node.js
print_info "Step 1/6: Checking Node.js installation..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION is installed"
    
    # Check if version is >= 16
    MAJOR_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 16 ]; then
        print_error "Node.js version must be >= 16.0.0"
        print_info "Please upgrade Node.js: https://nodejs.org/"
        exit 1
    fi
else
    print_error "Node.js is not installed"
    print_info "Please install Node.js: https://nodejs.org/"
    exit 1
fi

# Step 2: Check npm
print_info "Step 2/6: Checking npm installation..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm $NPM_VERSION is installed"
else
    print_error "npm is not installed"
    exit 1
fi

# Step 3: Check Python
print_info "Step 3/6: Checking Python installation..."
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    print_success "$PYTHON_VERSION is installed"
elif command_exists python; then
    PYTHON_VERSION=$(python --version)
    print_success "$PYTHON_VERSION is installed"
else
    print_warning "Python is not installed (optional for local server)"
    print_info "Tests can still run if you start the server manually"
fi

# Step 4: Install npm dependencies
print_info "Step 4/6: Installing npm dependencies..."
if [ -f "package.json" ]; then
    npm install
    print_success "npm dependencies installed"
else
    print_error "package.json not found"
    exit 1
fi

# Step 5: Install Playwright browsers
print_info "Step 5/6: Installing Playwright browsers..."
npx playwright install --with-deps
print_success "Playwright browsers installed"

# Step 6: Verify installation
print_info "Step 6/6: Verifying installation..."

# Check if Playwright is installed
if [ -d "node_modules/@playwright/test" ]; then
    PLAYWRIGHT_VERSION=$(npx playwright --version)
    print_success "Playwright installed: $PLAYWRIGHT_VERSION"
else
    print_error "Playwright installation failed"
    exit 1
fi

# Create necessary directories
mkdir -p test-results
mkdir -p playwright-report
print_success "Created output directories"

###############################################################################
# SUMMARY
###############################################################################

print_header "Setup Complete! 🎉"

echo "You can now run tests with:"
echo ""
echo -e "  ${GREEN}npm test${NC}                  - Run all tests"
echo -e "  ${GREEN}npm run test:ui${NC}           - Interactive UI mode"
echo -e "  ${GREEN}npm run test:headed${NC}       - Run with visible browser"
echo -e "  ${GREEN}npm run test:debug${NC}        - Debug mode"
echo ""
echo "View reports with:"
echo ""
echo -e "  ${GREEN}npm run test:report${NC}       - Open HTML report"
echo ""
echo "For more commands, see:"
echo ""
echo -e "  ${BLUE}cat RUN-TESTS.md${NC}"
echo ""

###############################################################################
# QUICK TEST
###############################################################################

print_header "Run Quick Test?"
echo "Would you like to run a quick test to verify everything works?"
echo ""
read -p "Run quick test? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Running quick test..."
    echo ""
    
    # Run a single test
    if npx playwright test --project="Desktop Chrome" --grep "should load" --timeout=15000; then
        print_success "Quick test passed!"
        print_info "Your setup is working correctly"
    else
        print_warning "Quick test failed or was skipped"
        print_info "Check your HTML file and server configuration"
    fi
else
    print_info "Skipping quick test"
fi

print_header "All Done! 🚀"

echo "Happy testing!"
echo ""

