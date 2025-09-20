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

  useEffect(() => {
    // Only run in browser
    (async () => {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup } = await import(
        "react-leaflet"
      );

      const markerIcon2x = (
        await import("leaflet/dist/images/marker-icon-2x.png")
      ).default;
      const markerIcon = (await import("leaflet/dist/images/marker-icon.png"))
        .default;
      const markerShadow = (
        await import("leaflet/dist/images/marker-shadow.png")
      ).default;

      const DefaultIcon = L.Icon.Default.extend({
        options: {
          iconRetinaUrl: markerIcon2x,
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
        },
      });

      L.Marker.prototype.options.icon = new DefaultIcon();
      setLeafletComponents({ MapContainer, TileLayer, Marker, Popup });
    })();

    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data: Locations) => setLocations(data))
      .catch((err) => console.error(err));
  }, []);

  if (!LeafletComponents || !locations) return <p>Loading map...</p>;

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents;

  return (
    <MapContainer
      center={[7.2906, 80.6337]}
      zoom={7}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {locations.stores.map((store, idx) => (
        <Marker key={idx} position={[store.lat, store.lng]}>
          <Popup>{store.name}</Popup>
        </Marker>
      ))}
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
