import React from 'react';
import { Globe, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export const Dashboard = () => {
  // Mock data - in a real app, this would come from your API
  const stats = {
    totalWebsites: 127,
    totalArticles: 3542,
    pendingTasks: 18,
    completedTasks: 245,
  };

  const recentActivities = [
    { id: 1, action: 'Website Created', site: 'travel-blog-42.com', time: '2 hours ago' },
    { id: 2, action: 'Content Generated', site: 'tech-news-daily.com', time: '3 hours ago' },
    { id: 3, action: 'Articles Published', site: 'food-recipes-101.com', time: '5 hours ago' },
    { id: 4, action: 'Website Updated', site: 'fitness-tips.com', time: '1 day ago' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Websites</h2>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalWebsites}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Articles</h2>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalArticles}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Pending Tasks</h2>
              <p className="text-2xl font-semibold text-gray-800">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Completed Tasks</h2>
              <p className="text-2xl font-semibold text-gray-800">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="py-4">
                  <div className="flex items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.site}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-1 gap-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
              Create New Website
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded">
              Generate Content
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded">
              Publish Articles
            </button>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded">
              Run Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};