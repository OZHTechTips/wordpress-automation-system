import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { Website } from '../types';

export const WebsiteManager = () => {
  // State for websites
  const [websites, setWebsites] = useState<Website[]>([
    { id: 1, name: 'Travel Blog', url: 'https://travel-blog-42.com', status: 'active', articles: 42 },
    { id: 2, name: 'Tech News Daily', url: 'https://tech-news-daily.com', status: 'active', articles: 78 },
    { id: 3, name: 'Food Recipes 101', url: 'https://food-recipes-101.com', status: 'maintenance', articles: 105 },
    { id: 4, name: 'Fitness Tips', url: 'https://fitness-tips.com', status: 'active', articles: 63 },
    { id: 5, name: 'Home Decor Ideas', url: 'https://home-decor-ideas.com', status: 'inactive', articles: 29 },
  ]);

  const [showNewWebsiteModal, setShowNewWebsiteModal] = useState(false);
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [newWebsite, setNewWebsite] = useState({ 
    name: '', 
    subdomain: '',
  });
  const [newDomain, setNewDomain] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverConfigMissing, setServerConfigMissing] = useState(false);
  const [baseDomain, setBaseDomain] = useState('');

  useEffect(() => {
    // Fetch the base domain from settings
    const fetchBaseDomain = async () => {
      try {
        const response = await fetch('/api/settings/get');
        if (response.ok) {
          const data = await response.json();
          if (data.settings && data.settings.baseDomain) {
            setBaseDomain(data.settings.baseDomain);
          }
        }
      } catch (error) {
        console.error('Error fetching base domain:', error);
      }
    };

    fetchBaseDomain();
  }, []);

  const handleAddWebsite = async () => {
    setError(null);
    setIsCreating(true);
    
    try {
      // Call the API to create a new WordPress site with a subdomain
      const response = await fetch('/api/wordpress/create-subdomain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newWebsite.name,
          subdomain: newWebsite.subdomain,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWebsites([...websites, { 
          id: websites.length + 1,
          ...data.siteInfo
        }]);
        
        setNewWebsite({ 
          name: '', 
          subdomain: '',
        });
        
        setShowNewWebsiteModal(false);
      } else {
        console.error('Failed to create website:', data.error);
        setError(data.error);
        
        // Check if the error is related to missing server configuration
        if (data.error && data.error.includes('WordPress server configuration is missing')) {
          setServerConfigMissing(true);
        }
      }
    } catch (error) {
      console.error('Error creating website:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddDomain = async () => {
    if (!selectedWebsite) return;
    
    setError(null);
    setIsCreating(true);
    
    try {
      // Call the API to add a new domain to an existing WordPress site
      const response = await fetch('/api/wordpress/add-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId: selectedWebsite.id,
          newDomain: newDomain,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWebsites(websites.map(website => 
          website.id === selectedWebsite.id ? { ...website, ...data.siteInfo } : website
        ));
        
        setNewDomain('');
        setSelectedWebsite(null);
        setShowAddDomainModal(false);
      } else {
        console.error('Failed to add domain:', data.error);
        setError(data.error);
      }
    } catch (error) {
      console.error('Error adding domain:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteWebsite = (id: number) => {
    // In a real app, you would call your API to delete the WordPress site
    setWebsites(websites.filter(website => website.id !== id));
  };

  const openAddDomainModal = (website: Website) => {
    setSelectedWebsite(website);
    setShowAddDomainModal(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Website Manager</h1>
        <button 
          onClick={() => setShowNewWebsiteModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Website
        </button>
      </div>

      {serverConfigMissing && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Server Configuration Missing:</strong> Please add your WordPress server details in the Settings page to create websites.
              </p>
              <a 
                href="/settings"
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Go to Settings
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Articles
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {websites.map((website) => (
              <tr key={website.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{website.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{website.url}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${website.status === 'active' ? 'bg-green-100 text-green-800' : 
                      website.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                      website.status === 'setting-up' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {website.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {website.articles}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    {website.adminUrl && (
                      <a href={website.adminUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" title="WordPress Admin">
                        <Edit className="h-5 w-5" />
                      </a>
                    )}
                    {!website.adminUrl && (
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => openAddDomainModal(website)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Add Domain"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteWebsite(website.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Website Modal */}
      {showNewWebsiteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add New WordPress Website</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Website Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="My Blog"
                value={newWebsite.name}
                onChange={(e) => setNewWebsite({...newWebsite, name: e.target.value})}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subdomain">
                Subdomain
              </label>
              <div className="flex items-center">
                <input
                  className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="subdomain"
                  type="text"
                  placeholder="myblog"
                  value={newWebsite.subdomain}
                  onChange={(e) => setNewWebsite({...newWebsite, subdomain: e.target.value})}
                />
                <span className="bg-gray-100 py-2 px-3 text-gray-700 border border-l-0 rounded-r">
                  .{baseDomain || 'yourdomain.com'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This will create a WordPress site at {newWebsite.subdomain || 'subdomain'}.{baseDomain || 'yourdomain.com'}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setShowNewWebsiteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                type="button"
                onClick={handleAddWebsite}
                disabled={!newWebsite.name || !newWebsite.subdomain || isCreating}
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Website
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Domain Modal */}
      {showAddDomainModal && selectedWebsite && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add Domain to {selectedWebsite.name}</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newDomain">
                New Domain
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="newDomain"
                type="text"
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the full domain name without http:// or https://
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setSelectedWebsite(null);
                  setShowAddDomainModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                type="button"
                onClick={handleAddDomain}
                disabled={!newDomain || isCreating}
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Domain
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};