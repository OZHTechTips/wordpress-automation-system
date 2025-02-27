#!/bin/bash

# This script installs the requirements for the WordPress Server API
# Run with sudo: sudo ./install-requirements.sh

# Exit on error
set -e

echo "Installing requirements for WordPress Server API..."

# Update package lists
apt-get update

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get install -y nginx
fi

# Install PHP and required extensions
echo "Installing PHP and extensions..."
apt-get install -y php-fpm php-mysql php-curl php-gd php-intl php-mbstring php-soap php-xml php-xmlrpc php-zip

# Install MySQL/MariaDB if not already installed
if ! command -v mysql &> /dev/null; then
    echo "Installing MariaDB..."
    apt-get install -y mariadb-server
    
    # Secure MySQL installation
    echo "Securing MariaDB installation..."
    mysql_secure_installation
fi

# Install WP-CLI
if ! command -v wp &> /dev/null; then
    echo "Installing WP-CLI..."
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    mv wp-cli.phar /usr/local/bin/wp
fi

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
    apt-get install -y nodejs
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p /var/www/html

# Set proper permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

echo "Installation complete!"
echo "Next steps:"
echo "1. Configure your .env file"
echo "2. Set up a wildcard DNS record for your domain"
echo "3. Start the WordPress Server API with 'npm start'"