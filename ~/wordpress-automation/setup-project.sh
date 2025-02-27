#!/bin/bash

# This script sets up the WordPress Automation System project
# It builds the frontend and configures Nginx

# Exit on error
set -e

echo "Setting up WordPress Automation System..."

# Navigate to project directory
cd ~/wordpress-automation

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the frontend
echo "Building the frontend..."
npm run build

# Update Nginx configuration
echo "Updating Nginx configuration..."
sudo cp nginx-site-config.conf /etc/nginx/sites-available/automation.virseh.se.conf
sudo ln -sf /etc/nginx/sites-available/automation.virseh.se.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Set proper permissions
echo "Setting permissions..."
sudo chown -R $USER:$USER ~/wordpress-automation

echo "Setup complete! You can now access your site at http://automation.virseh.se"
echo "To start the backend server, run: cd ~/wordpress-automation && npm start"