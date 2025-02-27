import React from 'react';
import { BarChart, PieChart, LineChart, Activity } from 'lucide-react';

export const Analytics = () => {
  // Mock data - in a real app, this would come from your API
  const topPerformingWebsites = [
    { id: 1, name: 'Travel Blog', articles: 42, views: 12500, engagement: 8.7 },
    { id: 2, name: 'Tech News Daily', articles: 78, views: 28900, engagement: 7.2 },
    { id: 3, name: 'Food Recipes 101', articles: 105, views: 35200, engagement: 9.1 },
    { id: 4, name: 'Fitness Tips', articles: 63, views: 18700, engagement: 6.8 },
    { id: 5, name: 'Home Decor Ideas', articles: 29, views: 9800, engagement: 5.4 },
  ];

  const contentStats = {
    totalArticles: 3542,
    averageWordCount: 1250,
    averageImagesPerArticle: 3.2,
    topPerformingTopics: ['Technology', 'Travel', 'Food', 'Health', 'Finance'],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center">
            <BarChart className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Website Performance</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Website performance chart would be displayed here</p>
              {/* In a real app, you would integrate a charting library like Chart.js or Recharts */}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center">
            <PieChart className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Content Distribution</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Content distribution chart would be displayed here</p>
              {/* In a real app, you would integrate a charting library like Chart.js or Recharts */}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Content Stats</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Articles</p>
              <p className="text-2xl font-semibold">{contentStats.totalArticles}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Word Count</p>
              <p className="text-2xl font-semibold">{contentStats.averageWordCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Images Per Article</p>
              <p className="text-2xl font-semibold">{contentStats.averageImagesPerArticle}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <LineChart className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold">Top Performing Topics</h3>
          </div>
          <ul className="space-y-2">
            {contentStats.topPerformingTopics.map((topic, index) => (
              <li key={index} className="flex items-center">
                <span className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-800 rounded-full text-xs font-medium mr-2">
                  {index + 1}
                </span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BarChart className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold">Content Growth</h3>
          </div>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Content growth chart would be displayed here</p>
            {/* In a real app, you would integrate a charting library like Chart.js or Recharts */}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Top Performing Websites</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPerformingWebsites.map((website) => (
                <tr key={website.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{website.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{website.articles}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{website.views.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(website.engagement / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{website.engagement}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};