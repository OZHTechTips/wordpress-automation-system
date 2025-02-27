import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export const Settings = () => {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    wpServerApiUrl: '',
    wpServerApiKey: '',
    baseDomain: '',
    defaultWpUsername: 'admin',
    defaultWpPassword: '',
    defaultWpEmail: '',
    contentSettings: {
      minWordCount: 800,
      maxWordCount: 1500,
      includeImages: true,
      includeTags: true,
      includeCategories: true,
    },
    schedulingSettings: {
      publishImmediately: false,
      publishInterval: 'daily', // daily, weekly, custom
      customInterval: 6, // hours
      maxArticlesPerDay: 5,
    },
  });

  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    type: 'success' | 'error' | null;
  }>({
    message: '',
    type: null,
  });

  useEffect(() => {
    // Load settings from the server when component mounts
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/get');
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setSettings({
        ...settings,
        [section]: {
          ...settings[section as keyof typeof settings],
          [key]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleSave = async () => {
    setSaveStatus({ message: 'Saving...', type: null });
    
    try {
      // Save settings to the server
      const response = await fetch('/api/settings/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSaveStatus({ message: 'Settings saved successfully!', type: 'success' });
      } else {
        setSaveStatus({ message: `Failed to save settings: ${data.error}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({ message: 'An error occurred while saving settings.', type: 'error' });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </button>
      </div>
      
      {saveStatus.message && (
        <div className={`mb-6 p-4 rounded ${
          saveStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          saveStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {saveStatus.message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">API Configuration</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              name="openaiApiKey"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={settings.openaiApiKey}
              onChange={handleChange}
              placeholder="sk-..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Your OpenAI API key is required to generate content using ChatGPT.
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-b">
          <h2 className="text-xl font-semibold">Server Configuration</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WordPress Server API URL
            </label>
            <input
              type="text"
              name="wpServerApiUrl"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={settings.wpServerApiUrl}
              onChange={handleChange}
              placeholder="https://your-server-api.example.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              The URL of your WordPress server API that handles site creation and management.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WordPress Server API Key
            </label>
            <input
              type="password"
              name="wpServerApiKey"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={settings.wpServerApiKey}
              onChange={handleChange}
              placeholder="Your server API key"
            />
            <p className="mt-1 text-sm text-gray-500">
              The API key used to authenticate with your WordPress server API.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Domain
            </label>
            <input
              type="text"
              name="baseDomain"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={settings.baseDomain}
              onChange={handleChange}
              placeholder="yourdomain.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              Your main domain where WordPress subdomains will be created (e.g., yourdomain.com).
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-b">
          <h2 className="text-xl font-semibold">WordPress Defaults</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default WordPress Username
              </label>
              <input
                type="text"
                name="defaultWpUsername"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={settings.defaultWpUsername}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default WordPress Password
              </label>
              <input
                type="password"
                name="defaultWpPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={settings.defaultWpPassword}
                onChange={handleChange}
                placeholder="Secure password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default WordPress Email
              </label>
              <input
                type="email"
                name="defaultWpEmail"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={settings.defaultWpEmail}
                onChange={handleChange}
                placeholder="admin@example.com"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-b">
          <h2 className="text-xl font-semibold">Content Settings</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Word Count
              </label>
              <input
                type="number"
                name="contentSettings.minWordCount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={settings.contentSettings.minWordCount}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Word Count
              </label>
              <input
                type="number"
                name="contentSettings.maxWordCount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={settings.contentSettings.maxWordCount}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeImages"
                name="contentSettings.includeImages"
                checked={settings.contentSettings.includeImages}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeImages" className="ml-2 block text-sm text-gray-700">
                Include Images
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeTags"
                name="contentSettings.includeTags"
                checked={settings.contentSettings.includeTags}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeTags" className="ml-2 block text-sm text-gray-700">
                Include Tags
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeCategories"
                name="contentSettings.includeCategories"
                checked={settings.contentSettings.includeCategories}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeCategories" className="ml-2 block text-sm text-gray-700">
                Include Categories
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-b">
          <h2 className="text-xl font-semibold">Scheduling Settings</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="publishImmediately"
              name="schedulingSettings.publishImmediately"
              checked={settings.schedulingSettings.publishImmediately}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="publishImmediately" className="ml-2 block text-sm text-gray-700">
              Publish Immediately After Generation
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publish Interval
              </label>
              <select
                name="schedulingSettings.publishInterval"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={settings.schedulingSettings.publishInterval}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom Hours</option>
              </select>
            </div>
            
            {settings.schedulingSettings.publishInterval === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Interval (hours)
                </label>
                <input
                  type="number"
                  name="schedulingSettings.customInterval"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={settings.schedulingSettings.customInterval}
                  onChange={handleChange}
                  min="1"
                  max="168"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Articles Per Day
              </label>
              <input
                type="number"
                name="schedulingSettings.maxArticlesPerDay"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={settings.schedulingSettings.maxArticlesPerDay}
                onChange={handleChange}
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};