import express from 'express';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';

// Convert exec to Promise-based
const execPromise = util.promisify(exec);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.WP_SERVER_PORT || 3001;

// Middleware
app.use(express.json());

// Authentication middleware
const authenticateApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid API key' });
  }
  
  const apiKey = authHeader.split(' ')[1];
  
  if (apiKey !== process.env.WP_SERVER_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  next();
};

// Apply authentication middleware to all routes
app.use(authenticateApiKey);

// Configuration
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'yourdomain.com';
const WP_SITES_DIR = process.env.WP_SITES_DIR || '/var/www/html';
const NGINX_SITES_DIR = process.env.NGINX_SITES_DIR || '/etc/nginx/sites-available';
const NGINX_ENABLED_DIR = process.env.NGINX_ENABLED_DIR || '/etc/nginx/sites-enabled';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';

// Helper function to create a database
async function createDatabase(dbName) {
  const createDbCommand = `mysql -u${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} -h ${DB_HOST} -e "CREATE DATABASE IF NOT EXISTS \`${dbName}\`;"`;
  await execPromise(createDbCommand);
}

// Helper function to create Nginx configuration
async function createNginxConfig(subdomain, siteDir) {
  const domain = `${subdomain}.${BASE_DOMAIN}`;
  const configContent = `
server {
    listen 80;
    listen [::]:80;
    server_name ${domain};
    root ${siteDir};
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
    }

    location ~ /\\.ht {
        deny all;
    }
}
`;

  const configPath = path.join(NGINX_SITES_DIR, `${domain}.conf`);
  const enabledPath = path.join(NGINX_ENABLED_DIR, `${domain}.conf`);
  
  await fs.writeFile(configPath, configContent);
  
  // Create symlink to enable the site
  try {
    await fs.symlink(configPath, enabledPath);
  } catch (error) {
    // If symlink already exists, ignore the error
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  
  // Reload Nginx
  await execPromise('systemctl reload nginx');
}

// Helper function to install WordPress
async function installWordPress(subdomain, siteName, adminUser, adminPassword, adminEmail) {
  const domain = `${subdomain}.${BASE_DOMAIN}`;
  const dbName = `wp_${subdomain.replace(/-/g, '_')}`;
  const siteDir = path.join(WP_SITES_DIR, domain);
  
  // Create site directory
  await fs.mkdir(siteDir, { recursive: true });
  
  // Download WordPress
  await execPromise(`cd ${siteDir} && wp core download --allow-root`);
  
  // Create database
  await createDatabase(dbName);
  
  // Create wp-config.php
  await execPromise(`cd ${siteDir} && wp config create --dbname=${dbName} --dbuser=${DB_USER} --dbpass=${DB_PASSWORD} --dbhost=${DB_HOST} --allow-root`);
  
  // Install WordPress
  await execPromise(`cd ${siteDir} && wp core install --url=http://${domain} --title="${siteName}" --admin_user=${adminUser} --admin_password=${adminPassword} --admin_email=${adminEmail} --allow-root`);
  
  // Set proper permissions
  await execPromise(`chown -R www-data:www-data ${siteDir}`);
  
  // Create Nginx configuration
  await createNginxConfig(subdomain, siteDir);
  
  return {
    site_id: subdomain,
    url: `http://${domain}`,
    admin_url: `http://${domain}/wp-admin/`
  };
}

// API Routes

// Create a new WordPress site
app.post('/create-wordpress', async (req, res) => {
  try {
    const { subdomain, siteName, adminUser, adminPassword, adminEmail } = req.body;
    
    if (!subdomain || !siteName || !adminUser || !adminPassword || !adminEmail) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate subdomain format
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return res.status(400).json({ error: 'Invalid subdomain format. Use only lowercase letters, numbers, and hyphens.' });
    }
    
    const result = await installWordPress(subdomain, siteName, adminUser, adminPassword, adminEmail);
    
    res.json(result);
  } catch (error) {
    console.error('Error creating WordPress site:', error);
    res.status(500).json({ error: 'Failed to create WordPress site: ' + error.message });
  }
});

// Add a new domain to an existing WordPress site
app.post('/add-domain', async (req, res) => {
  try {
    const { siteId, domain } = req.body;
    
    if (!siteId || !domain) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate domain format
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }
    
    const subdomain = siteId;
    const originalDomain = `${subdomain}.${BASE_DOMAIN}`;
    const siteDir = path.join(WP_SITES_DIR, originalDomain);
    
    // Check if the site exists
    try {
      await fs.access(siteDir);
    } catch (error) {
      return res.status(404).json({ error: 'WordPress site not found' });
    }
    
    // Create Nginx configuration for the new domain
    const configContent = `
server {
    listen 80;
    listen [::]:80;
    server_name ${domain};
    root ${siteDir};
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
    }

    location ~ /\\.ht {
        deny all;
    }
}
`;

    const configPath = path.join(NGINX_SITES_DIR, `${domain}.conf`);
    const enabledPath = path.join(NGINX_ENABLED_DIR, `${domain}.conf`);
    
    await fs.writeFile(configPath, configContent);
    
    // Create symlink to enable the site
    try {
      await fs.symlink(configPath, enabledPath);
    } catch (error) {
      // If symlink already exists, ignore the error
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
    
    // Update WordPress site URL
    await execPromise(`cd ${siteDir} && wp option update siteurl "http://${domain}" --allow-root`);
    await execPromise(`cd ${siteDir} && wp option update home "http://${domain}" --allow-root`);
    
    // Reload Nginx
    await execPromise('systemctl reload nginx');
    
    res.json({
      id: siteId,
      url: `http://${domain}`,
      adminUrl: `http://${domain}/wp-admin/`,
      status: 'active'
    });
  } catch (error) {
    console.error('Error adding domain to WordPress site:', error);
    res.status(500).json({ error: 'Failed to add domain to WordPress site: ' + error.message });
  }
});

// Delete a WordPress site
app.delete('/delete-wordpress/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    if (!siteId) {
      return res.status(400).json({ error: 'Missing site ID' });
    }
    
    const subdomain = siteId;
    const domain = `${subdomain}.${BASE_DOMAIN}`;
    const siteDir = path.join(WP_SITES_DIR, domain);
    const dbName = `wp_${subdomain.replace(/-/g, '_')}`;
    
    // Check if the site exists
    try {
      await fs.access(siteDir);
    } catch (error) {
      return res.status(404).json({ error: 'WordPress site not found' });
    }
    
    // Remove Nginx configuration
    const configPath = path.join(NGINX_SITES_DIR, `${domain}.conf`);
    const enabledPath = path.join(NGINX_ENABLED_DIR, `${domain}.conf`);
    
    try {
      await fs.unlink(enabledPath);
    } catch (error) {
      // Ignore if the symlink doesn't exist
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
    
    try {
      await fs.unlink(configPath);
    } catch (error) {
      // Ignore if the config doesn't exist
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
    
    // Drop the database
    const dropDbCommand = `mysql -u${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} -h ${DB_HOST} -e "DROP DATABASE IF EXISTS \`${dbName}\`;"`;
    await execPromise(dropDbCommand);
    
    // Remove the site directory
    await fs.rm(siteDir, { recursive: true, force: true });
    
    // Reload Nginx
    await execPromise('systemctl reload nginx');
    
    res.json({ success: true, message: 'WordPress site deleted successfully' });
  } catch (error) {
    console.error('Error deleting WordPress site:', error);
    res.status(500).json({ error: 'Failed to delete WordPress site: ' + error.message });
  }
});

// Get WordPress site status
app.get('/status/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    if (!siteId) {
      return res.status(400).json({ error: 'Missing site ID' });
    }
    
    const subdomain = siteId;
    const domain = `${subdomain}.${BASE_DOMAIN}`;
    const siteDir = path.join(WP_SITES_DIR, domain);
    
    // Check if the site exists
    try {
      await fs.access(siteDir);
      
      // Get site information
      const { stdout: siteUrl } = await execPromise(`cd ${siteDir} && wp option get siteurl --allow-root`);
      const { stdout: siteName } = await execPromise(`cd ${siteDir} && wp option get blogname --allow-root`);
      const { stdout: postCount } = await execPromise(`cd ${siteDir} && wp post list --post_type=post --format=count --allow-root`);
      
      res.json({
        id: siteId,
        name: siteName.trim(),
        url: siteUrl.trim(),
        adminUrl: `${siteUrl.trim()}/wp-admin/`,
        status: 'active',
        articles: parseInt(postCount.trim(), 10) || 0
      });
    } catch (error) {
      return res.status(404).json({ error: 'WordPress site not found' });
    }
  } catch (error) {
    console.error('Error getting WordPress site status:', error);
    res.status(500).json({ error: 'Failed to get WordPress site status: ' + error.message });
  }
});

// List all WordPress sites
app.get('/list-sites', async (req, res) => {
  try {
    // Get all directories in the sites directory
    const files = await fs.readdir(WP_SITES_DIR);
    
    // Filter for WordPress sites (directories that end with BASE_DOMAIN)
    const wpSites = files.filter(file => file.endsWith(BASE_DOMAIN));
    
    // Get information for each site
    const sites = await Promise.all(
      wpSites.map(async (domain) => {
        const siteDir = path.join(WP_SITES_DIR, domain);
        const subdomain = domain.replace(`.${BASE_DOMAIN}`, '');
        
        try {
          // Get site information
          const { stdout: siteUrl } = await execPromise(`cd ${siteDir} && wp option get siteurl --allow-root`);
          const { stdout: siteName } = await execPromise(`cd ${siteDir} && wp option get blogname --allow-root`);
          const { stdout: postCount } = await execPromise(`cd ${siteDir} && wp post list --post_type=post --format=count --allow-root`);
          
          return {
            id: subdomain,
            name: siteName.trim(),
            url: siteUrl.trim(),
            adminUrl: `${siteUrl.trim()}/wp-admin/`,
            status: 'active',
            articles: parseInt(postCount.trim(), 10) || 0
          };
        } catch (error) {
          // If we can't get information, just return basic info
          return {
            id: subdomain,
            name: subdomain,
            url: `http://${domain}`,
            status: 'unknown',
            articles: 0
          };
        }
      })
    );
    
    res.json({ sites });
  } catch (error) {
    console.error('Error listing WordPress sites:', error);
    res.status(500).json({ error: 'Failed to list WordPress sites: ' + error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`WordPress Server API running on port ${PORT}`);
});