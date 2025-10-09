import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'railway' | 'port';
}

const StoreLocationsMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('In Colombo');
  
  const locations: Location[] = [
    { id: 1, name: 'Dehiwala Railway Station', lat: 6.8561, lng: 79.8728, type: 'railway' },
    { id: 2, name: 'Baseline Road Railway', lat: 6.8456, lng: 79.8689, type: 'railway' },
    { id: 3, name: 'Kollupitiya Railway', lat: 6.9071, lng: 79.8458, type: 'railway' },
    { id: 4, name: 'Bambalapitiya Railway', lat: 6.8934, lng: 79.8567, type: 'railway' },
    { id: 5, name: 'Colombo Port', lat: 6.9654, lng: 79.8431, type: 'port' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Store Locations</h3>
        <div className="relative">
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <span>{selectedLocation}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
        {/* Map Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23f0f9ff'/%3E%3Cpath d='M100 50c20-10 40-5 60 5s40 25 60 15 40-20 60-10 40 15 60 10v200H100V50z' fill='%23e0f2fe'/%3E%3Cpath d='M0 100c25-15 50-10 75 0s50 20 75 10 50-15 75-5 50 10 75 5 50-10 75 0v100H0V100z' fill='%23bae6fd'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Location Pins */}
        {locations.map((location: Location, index: number) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 3) * 20}%`
            }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
              location.type === 'railway' ? 'bg-blue-500' : 'bg-dashboard-accent'
            } group-hover:scale-110 transition-transform`}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                {location.name}
              </div>
            </div>
          </div>
        ))}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Railway Stations</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-dashboard-accent"></div>
              <span>Ports</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Location Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">5</div>
          <div className="text-xs text-gray-600">Active Locations</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">2</div>
          <div className="text-xs text-gray-600">New This Month</div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocationsMap;