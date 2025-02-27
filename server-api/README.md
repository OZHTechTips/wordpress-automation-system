# WordPress Server API

This is a server-side API for creating and managing WordPress sites on your own server. It works with the WordPress Automation System to automate the creation of WordPress sites with custom subdomains.

## Prerequisites

- A Linux server with:
  - Node.js (v14+)
  - Nginx
  - PHP (8.0+ recommended)
  - MySQL/MariaDB
  - WP-CLI (WordPress Command Line Interface)
- Root access or sudo privileges

## Installation

1. Clone this repository to your server:

```bash
git clone https://github.com/yourusername/wordpress-server-api.git
cd wordpress-server-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Edit the `.env` file with your server configuration:

```
# WordPress Server API Configuration
WP_SERVER_PORT=3001
WP_SERVER_API_KEY=your_secure_api_key_here

# Domain Configuration
BASE_DOMAIN=yourdomain.com

# Server Paths
WP_SITES_DIR=/var/www/html
NGINX_SITES_DIR=/etc/nginx/sites-available
NGINX_ENABLED_DIR=/etc/nginx/sites-enabled

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
```

5. Make sure WP-CLI is installed and available globally:

```bash
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp
```

6. Start the server:

```bash
npm start
```

For production use, consider using a process manager like PM2:

```bash
npm install -g pm2
pm2 start wp-server.js --name wordpress-api
pm2 save
pm2 startup
```

## DNS Configuration

For this system to work, you need to set up a wildcard DNS record for your domain:

```
*.yourdomain.com  A  YOUR_SERVER_IP
```

This allows any subdomain of your domain to point to your server.

## API Endpoints

### Create a WordPress Site

```
POST /create-wordpress
```

Request body:
```json
{
  "subdomain": "myblog",
  "siteName": "My Blog",
  "adminUser": "admin",
  "adminPassword": "secure_password",
  "adminEmail": "admin@example.com"
}
```

### Add a Domain to a WordPress Site

```
POST /add-domain
```

Request body:
```json
{
  "siteId": "myblog",
  "domain": "example.com"
}
```

### Delete a WordPress Site

```
DELETE /delete-wordpress/:siteId
```

### Get WordPress Site Status

```
GET /status/:siteId
```

### List All WordPress Sites

```
GET /list-sites
```

## Security Considerations

- This API uses a simple API key for authentication. For production use, consider implementing more robust authentication.
- The API should be run behind a reverse proxy with HTTPS enabled.
- Restrict access to the API to only trusted IPs.
- Regularly update WordPress installations and plugins.