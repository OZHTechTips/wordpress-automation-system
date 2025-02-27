import React from 'react';
import { TempDomainProvider } from '../types';
import { tempDomainProviders } from '../data/tempDomainProviders';
import { CheckCircle } from 'lucide-react';

interface TempDomainSelectorProps {
  selectedProvider: string;
  onSelect: (providerId: string) => void;
}

export const TempDomainSelector: React.FC<TempDomainSelectorProps> = ({ 
  selectedProvider, 
  onSelect 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      <h3 className="text-md font-medium text-gray-700">Select a temporary domain provider:</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tempDomainProviders.map((provider) => (
          <div 
            key={provider.id}
            onClick={() => onSelect(provider.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedProvider === provider.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-800">{provider.name}</h4>
              {selectedProvider === provider.id && (
                <CheckCircle className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">*.{provider.baseUrl}</p>
            <p className="text-xs text-gray-500 mt-2">Setup: {provider.setupTime}</p>
            <ul className="mt-2 space-y-1">
              {provider.features.map((feature, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};