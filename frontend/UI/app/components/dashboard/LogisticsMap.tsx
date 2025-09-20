import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icons in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.Icon.Default.extend({
  options: {
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  },
});

// Set the default icon globally for all markers
L.Marker.prototype.options.icon = new DefaultIcon();

// Define TypeScript types for stores and trucks
interface Store {
  name: string;
  lat: number;
  lng: number;
}

interface Truck {
  id: string;
  lat: number;
  lng: number;
  status: string;
}

interface Locations {
  stores: Store[];
  trucks: Truck[];
}

const LogisticsMap: React.FC = () => {
  const [locations, setLocations] = useState<Locations | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data: Locations) => setLocations(data))
      .catch((err) => console.error("Failed to fetch locations:", err));
  }, []);

  if (!locations) return <p>Loading map...</p>;

  return (
    <MapContainer
      center={[7.2906, 80.6337]}
      zoom={7}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Store Markers */}
      {locations.stores.map((store, idx) => (
        <Marker key={idx} position={[store.lat, store.lng]}>
          <Popup>{store.name}</Popup>
        </Marker>
      ))}

      {/* Truck Markers */}
      {locations.trucks.map((truck, idx) => (
        <Marker key={idx} position={[truck.lat, truck.lng]}>
          <Popup>
            Truck ID: {truck.id} <br />
            Status: {truck.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LogisticsMap;
