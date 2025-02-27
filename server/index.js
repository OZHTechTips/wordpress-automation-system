import express from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API Routes
app.post('/api/generate-content', async (req, res) => {
  try {
    const { topics, numArticles } = req.body;
    
    if (!topics || !numArticles) {
      return res.status(400).json({ error: 'Topics and number of articles are required' });
    }
    
    // Example OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional content writer specializing in creating engaging blog posts."
        },
        {
          role: "user",
          content: `Generate ${numArticles} article titles about the following topics: ${topics}`
        }
      ],
    });
    
    const titles = completion.choices[0].message.content.split('\n')
      .filter(line => line.trim() !== '')
      .map((title, index) => ({
        id: index + 1,
        title: title.replace(/^\d+\.\s*/, ''), // Remove numbering if present
        status: 'generated'
      }));
    
    res.json({ articles: titles });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.post('/api/wordpress/connect', async (req, res) => {
  try {
    const { url, username, password } = req.body;
    
    // In a real app, you would validate the WordPress credentials here
    // For now, we'll just return a success message
    
    res.json({ 
      success: true, 
      message: 'Successfully connected to WordPress site',
      siteInfo: {
        name: url.replace(/(^\w+:|^)\/\//, '').split('/')[0],
        url: url,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error connecting to WordPress:', error);
    res.status(500).json({ error: 'Failed to connect to WordPress site' });
  }
});

// Create a new WordPress site with a subdomain
app.post('/api/wordpress/create-subdomain', async (req, res) => {
  try {
    const { name, subdomain } = req.body;
    
    // Check if we have the required server configuration
    if (!process.env.WP_SERVER_API_URL || !process.env.WP_SERVER_API_KEY) {
      return res.status(400).json({ 
        error: 'WordPress server configuration is missing. Please add your server details in the Settings page.' 
      });
    }
    
    // Format the subdomain (lowercase, no spaces, etc.)
    const formattedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    try {
      // Call your server's API to create a new WordPress installation
      // This is a placeholder - you'll need to implement the actual API on your server
      const serverResponse = await axios.post(
        `${process.env.WP_SERVER_API_URL}/create-wordpress`,
        {
          subdomain: formattedSubdomain,
          siteName: name,
          adminUser: process.env.DEFAULT_WP_USERNAME || 'admin',
          adminPassword: process.env.DEFAULT_WP_PASSWORD || 'password',
          adminEmail: process.env.DEFAULT_WP_EMAIL || 'admin@example.com'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WP_SERVER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract site information from server response
      const { site_id, url, admin_url } = serverResponse.data;
      
      res.json({
        success: true,
        message: 'WordPress site created successfully with custom subdomain',
        siteInfo: {
          id: site_id,
          name: name,
          url: url,
          adminUrl: admin_url,
          status: 'active',
          articles: 0
        }
      });
    } catch (serverError) {
      console.error('Error creating WordPress site:', serverError.response?.data || serverError.message);
      return res.status(500).json({ 
        error: 'Failed to create WordPress site on your server. Please check your server configuration and try again.' 
      });
    }
  } catch (error) {
    console.error('Error creating WordPress site:', error);
    res.status(500).json({ error: 'Failed to create WordPress site' });
  }
});

// Add a new domain to an existing WordPress site
app.post('/api/wordpress/add-domain', async (req, res) => {
  try {
    const { siteId, newDomain } = req.body;
    
    // Check if we have the required server configuration
    if (!process.env.WP_SERVER_API_URL || !process.env.WP_SERVER_API_KEY) {
      return res.status(400).json({ 
        error: 'WordPress server configuration is missing. Please add your server details in the Settings page.' 
      });
    }
    
    try {
      // Call your server's API to add a new domain to an existing WordPress site
      const serverResponse = await axios.post(
        `${process.env.WP_SERVER_API_URL}/add-domain`,
        {
          siteId: siteId,
          domain: newDomain
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WP_SERVER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      res.json({
        success: true,
        message: 'Domain added successfully to WordPress site',
        siteInfo: serverResponse.data
      });
    } catch (serverError) {
      console.error('Error adding domain:', serverError.response?.data || serverError.message);
      return res.status(500).json({ 
        error: 'Failed to add domain to WordPress site. Please check your server configuration and try again.' 
      });
    }
  } catch (error) {
    console.error('Error adding domain to WordPress site:', error);
    res.status(500).json({ error: 'Failed to add domain to WordPress site' });
  }
});

// Save settings
app.post('/api/settings/save', (req, res) => {
  try {
    const settings = req.body;
    
    // Update environment variables
    if (settings.openaiApiKey) {
      process.env.OPENAI_API_KEY = settings.openaiApiKey;
    }
    
    if (settings.wpServerApiUrl) {
      process.env.WP_SERVER_API_URL = settings.wpServerApiUrl;
    }
    
    if (settings.wpServerApiKey) {
      process.env.WP_SERVER_API_KEY = settings.wpServerApiKey;
    }
    
    if (settings.baseDomain) {
      process.env.BASE_DOMAIN = settings.baseDomain;
    }
    
    if (settings.defaultWpUsername) {
      process.env.DEFAULT_WP_USERNAME = settings.defaultWpUsername;
    }
    
    if (settings.defaultWpPassword) {
      process.env.DEFAULT_WP_PASSWORD = settings.defaultWpPassword;
    }
    
    if (settings.defaultWpEmail) {
      process.env.DEFAULT_WP_EMAIL = settings.defaultWpEmail;
    }
    
    // In a production app, you would securely store these settings
    // For this demo, we'll just acknowledge the save
    
    res.json({
      success: true,
      message: 'Settings saved successfully'
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});