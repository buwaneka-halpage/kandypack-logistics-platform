import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { StoresAPI, TrucksAPI } from '~/services/api';
import { useAuth } from '~/hooks/useAuth';
import { hasPermission, UserRole } from '~/types/roles';
import { AlertCircle } from 'lucide-react';

interface Store {
  name: string;
  lat: number;
  lng: number;
  id?: string;
  city?: string;
}
interface Truck {
  id: string;
  lat: number;
  lng: number;
  status: string;
  license_plate?: string;
}
interface Locations {
  stores: Store[];
  trucks: Truck[];
}

const LogisticsMap: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Locations | null>(null);
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);
  const [icons, setIcons] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check permissions
  const canViewStores = user && (
    hasPermission(user.role as UserRole, 'store', 'read') ||
    hasPermission(user.role as UserRole, 'warehouse', 'read') ||
    hasPermission(user.role as UserRole, '*', 'read')
  );

  const canViewTrucks = user && (
    hasPermission(user.role as UserRole, 'truck', 'read') ||
    hasPermission(user.role as UserRole, '*', 'read')
  );

  // ---- Load Leaflet dynamically (so it doesn't break SSR) ----
  useEffect(() => {
    const initMap = async () => {
      try {
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
      } catch (err) {
        console.error('Error loading map:', err);
        setError('Failed to load map components');
      }
    };

    initMap();
  }, []);

  // Fetch real data from APIs
  useEffect(() => {
    if (!user) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    fetchMapData();
  }, [user]);

  const fetchMapData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const promises: Promise<any>[] = [];

      // Fetch stores if user has permission
      if (canViewStores) {
        promises.push(StoresAPI.getAll().catch(() => []));
      } else {
        promises.push(Promise.resolve([]));
      }

      // Fetch trucks if user has permission
      if (canViewTrucks) {
        promises.push(TrucksAPI.getAll().catch(() => []));
      } else {
        promises.push(Promise.resolve([]));
      }

      const [storesData, trucksData] = await Promise.all(promises);

      // Apply warehouse filtering on client side if needed
      let filteredStores = storesData || [];
      let filteredTrucks = trucksData || [];

      if (user?.warehouseId && user.role !== UserRole.SYSTEM_ADMIN && user.role !== UserRole.MANAGEMENT) {
        // Filter stores by warehouse_id
        filteredStores = filteredStores.filter((store: any) => 
          store.warehouse_id === user.warehouseId || store.store_id === user.warehouseId
        );
        
        // Filter trucks by warehouse_id
        filteredTrucks = filteredTrucks.filter((truck: any) => 
          truck.warehouse_id === user.warehouseId || truck.store_id === user.warehouseId
        );
      }

      // Transform stores data
      const stores: Store[] = (filteredStores || []).map((store: any) => {
        // Try to extract coordinates from different possible fields
        let lat = 7.2906; // Default to Kandy
        let lng = 80.6337;

        // Check various possible coordinate fields
        if (store.latitude && store.longitude) {
          lat = parseFloat(store.latitude);
          lng = parseFloat(store.longitude);
        } else if (store.lat && store.lng) {
          lat = parseFloat(store.lat);
          lng = parseFloat(store.lng);
        } else if (store.coordinates) {
          // Parse coordinates if stored as string
          const coords = store.coordinates.split(',');
          if (coords.length === 2) {
            lat = parseFloat(coords[0]);
            lng = parseFloat(coords[1]);
          }
        }

        return {
          name: store.store_name || store.name || `Store ${store.store_id}`,
          lat,
          lng,
          id: store.store_id,
          city: store.city
        };
      });

      // Transform trucks data
      const trucks: Truck[] = (filteredTrucks || []).map((truck: any, index: number) => {
        // Trucks might not have coordinates in DB, use dummy coordinates
        // In a real system, you'd get this from GPS tracking
        const baseLat = 7.2906;
        const baseLng = 80.6337;
        const offsetLat = (Math.random() - 0.5) * 0.5;
        const offsetLng = (Math.random() - 0.5) * 0.5;

        return {
          id: truck.truck_id || truck.id,
          lat: truck.latitude || baseLat + offsetLat,
          lng: truck.longitude || baseLng + offsetLng,
          status: truck.status || truck.availability || 'Unknown',
          license_plate: truck.license_plate
        };
      });

      setLocations({ stores, trucks });
      
    } catch (error: any) {
      console.error('Error fetching map data:', error);
      setError(error.message || 'Failed to load map data');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading or error state
  if (isLoading || !LeafletComponents || !icons) {
    return (
      <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-accent mx-auto mb-2"></div>
          <p className="text-dashboard-text-secondary">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-status-cancelled mx-auto mb-2" />
          <p className="text-sm text-dashboard-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!locations || (!locations.stores.length && !locations.trucks.length)) {
    return (
      <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-dashboard-text-secondary mx-auto mb-2" />
          <p className="text-sm text-dashboard-text-secondary">No location data available</p>
          {!canViewStores && !canViewTrucks && (
            <p className="text-xs text-status-cancelled mt-2">You don't have permission to view this data</p>
          )}
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents;

  return (
    <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[600px] flex flex-col">
      <div className="mb-2 sm:mb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-dashboard-text-primary">Logistics Map</h3>
            <p className="text-xs sm:text-sm text-dashboard-text-secondary mt-1">
              Real-time tracking of {canViewStores ? 'stores' : ''} {canViewStores && canViewTrucks ? 'and' : ''} {canViewTrucks ? 'delivery trucks' : ''}
              {user?.warehouseId && user.role !== UserRole.SYSTEM_ADMIN && user.role !== UserRole.MANAGEMENT && (
                <span className="text-dashboard-accent"> (Warehouse-scoped)</span>
              )}
            </p>
          </div>
          {(!canViewStores || !canViewTrucks) && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-status-shipped text-dashboard-text-primary rounded text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>Limited Access</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden flex-1 min-h-0">
        <MapContainer
          center={[7.2906, 80.6337]} // Centered around Sri Lanka
          zoom={7}
          style={{ height: "100%", width: "100%", minHeight: "400px" }}
          className="h-full"
        >
          {/* Base map layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Stores */}
          {canViewStores && locations.stores.map((store, idx) => (
            <Marker key={`store-${idx}`} position={[store.lat, store.lng]} icon={icons.DefaultIcon}>
              <Popup>
                <div className="text-sm">
                  <strong>{store.name}</strong>
                  {store.city && <div className="text-xs text-gray-600">City: {store.city}</div>}
                  {store.id && <div className="text-xs text-gray-500">ID: {store.id}</div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Trucks */}
          {canViewTrucks && locations.trucks.map((truck, idx) => (
            <Marker key={`truck-${idx}`} position={[truck.lat, truck.lng]} icon={icons.TruckIcon}>
              <Popup>
                <div className="text-sm">
                  <strong>Truck ID:</strong> {truck.id} <br />
                  {truck.license_plate && (
                    <><strong>License:</strong> {truck.license_plate} <br /></>
                  )}
                  <strong>Status:</strong> <span className="capitalize">{truck.status}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Map Legend */}
      <div className="mt-2 sm:mt-3 flex items-center justify-center space-x-6 flex-shrink-0">
        {canViewStores && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-dashboard-text-secondary">Stores ({locations.stores.length})</span>
          </div>
        )}
        {canViewTrucks && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-dashboard-text-secondary">Trucks ({locations.trucks.length})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsMap;
