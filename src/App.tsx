import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { WebsiteManager } from './pages/WebsiteManager';
import { ContentGenerator } from './pages/ContentGenerator';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/websites" element={<WebsiteManager />} />
            <Route path="/content" element={<ContentGenerator />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;