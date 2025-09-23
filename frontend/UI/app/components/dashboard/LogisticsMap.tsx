import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

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
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);
  const [icons, setIcons] = useState<any>(null);

  // ---- Load Leaflet dynamically (so it doesn't break SSR) ----
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup } = await import(
        "react-leaflet"
      );

      // Fix default Leaflet marker icons by creating custom icons
      const DefaultIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const TruckIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Set default icon for all markers
      L.Marker.prototype.options.icon = DefaultIcon;

      setLeafletComponents({ MapContainer, TileLayer, Marker, Popup });
      setIcons({ DefaultIcon, TruckIcon });
    })();

    // ---- TEMP: Dummy data while backend is not ready ----
    const dummyData: Locations = {
      stores: [
        { name: "Kandy Store", lat: 7.2906, lng: 80.6337 },
        { name: "Colombo Store", lat: 6.9271, lng: 79.8612 },
      ],
      trucks: [
        { id: "T1", lat: 7.3, lng: 80.65, status: "In Transit" },
        { id: "T2", lat: 7.25, lng: 80.6, status: "Idle" },
      ],
    };

    setLocations(dummyData);

    // Uncomment later when backend is ready
    /*
    fetch("http://your-fastapi-backend-url/api/locations")
      .then((res) => res.json())
      .then((data: Locations) => setLocations(data))
      .catch((err) => console.error(err));
    */
  }, []);

  // Show loading state
  if (!LeafletComponents || !locations || !icons) return <p>Loading map...</p>;

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents;

  return (
    <MapContainer
      center={[7.2906, 80.6337]} // Centered around Sri Lanka
      zoom={7}
      style={{ height: "500px", width: "100%" }}
    >
      {/* Base map layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Stores */}
      {locations.stores.map((store, idx) => (
        <Marker key={`store-${idx}`} position={[store.lat, store.lng]} icon={icons.DefaultIcon}>
          <Popup>{store.name}</Popup>
        </Marker>
      ))}

      {/* Trucks */}
      {locations.trucks.map((truck, idx) => (
        <Marker key={`truck-${idx}`} position={[truck.lat, truck.lng]} icon={icons.TruckIcon}>
          <Popup>
            <strong>Truck ID:</strong> {truck.id} <br />
            <strong>Status:</strong> {truck.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LogisticsMap;
