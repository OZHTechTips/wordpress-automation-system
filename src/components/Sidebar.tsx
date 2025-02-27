import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, FileText, BarChart2, Settings } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-full shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Globe className="mr-2 h-6 w-6 text-blue-600" />
          WP Automator
        </h1>
      </div>
      <nav className="mt-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/websites"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`
          }
        >
          <Globe className="h-5 w-5 mr-3" />
          Websites
        </NavLink>
        <NavLink
          to="/content"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`
          }
        >
          <FileText className="h-5 w-5 mr-3" />
          Content
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`
          }
        >
          <BarChart2 className="h-5 w-5 mr-3" />
          Analytics
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`
          }
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </NavLink>
      </nav>
    </div>
  );
};