#!/bin/bash

# This script sets up a wildcard SSL certificate using Let's Encrypt and Certbot
# Run with sudo: sudo ./setup-wildcard-ssl.sh yourdomain.com

# Exit on error
set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 yourdomain.com"
    exit 1
fi

DOMAIN=$1

# Install Certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Get wildcard certificate
echo "Getting wildcard SSL certificate for *.$DOMAIN..."
echo "Note: You will need to create DNS TXT records to verify domain ownership."
echo "Make sure your DNS provider supports API access for automatic verification."

certbot certonly --manual --preferred-challenges=dns --email admin@$DOMAIN --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -d $DOMAIN -d "*.$DOMAIN"

echo "Certificate obtained!"
echo "Now you need to configure Nginx to use this certificate for all subdomains."
echo "Add the following to your Nginx server blocks:"
echo ""
echo "ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;"
echo "ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;"
echo ""
echo "Don't forget to set up auto-renewal with a cron job:"
echo "0 3 * * * certbot renew --quiet"