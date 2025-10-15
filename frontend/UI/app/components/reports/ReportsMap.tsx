import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface SalesLocation {
  name: string;
  lat: number;
  lng: number;
  sales: number;
}

const ReportsMap: React.FC = () => {
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);
  const [icons, setIcons] = useState<any>(null);

  // Sales data for different locations in Sri Lanka
  const salesLocations: SalesLocation[] = [
    { name: "Colombo", lat: 6.9271, lng: 79.8612, sales: 45000 },
    { name: "Kandy", lat: 7.2906, lng: 80.6337, sales: 25000 },
    { name: "Galle", lat: 6.0535, lng: 80.2210, sales: 18000 },
    { name: "Jaffna", lat: 9.6615, lng: 80.0255, sales: 12000 },
    { name: "Matara", lat: 5.9549, lng: 80.5550, sales: 15000 },
  ];

  // Load Leaflet dynamically to avoid SSR issues
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup, Circle } = await import(
        "react-leaflet"
      );

      // Create custom red marker icon for sales locations
      const RedMarkerIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      setLeafletComponents({ MapContainer, TileLayer, Marker, Popup, Circle });
      setIcons({ RedMarkerIcon });
    })();
  }, []);

  // Show loading state
  if (!LeafletComponents || !icons) return <div className="flex items-center justify-center h-full"><p className="text-sm text-gray-500">Loading map...</p></div>;

  const { MapContainer, TileLayer, Marker, Popup, Circle } = LeafletComponents;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[7.8731, 80.7718]} // Centered on Sri Lanka
        zoom={7}
        style={{ height: "100%", width: "100%", minHeight: "200px" }}
        scrollWheelZoom={false}
        className="h-full rounded-lg"
      >
        {/* Base map layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Sales location markers and circles */}
        {salesLocations.map((location, idx) => (
          <React.Fragment key={`location-${idx}`}>
            {/* Marker */}
            <Marker 
              position={[location.lat, location.lng]} 
              icon={icons.RedMarkerIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-primary-navy">{location.name}</strong><br />
                  <span className="text-gray-600">Sales: LKR {location.sales.toLocaleString()}</span>
                </div>
              </Popup>
            </Marker>
            
            {/* Circle showing sales volume */}
            <Circle
              center={[location.lat, location.lng]}
              radius={location.sales * 2}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.2,
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default ReportsMap;
