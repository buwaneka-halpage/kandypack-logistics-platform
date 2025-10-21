import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Loader2, Pencil, Trash2, AlertCircle } from "lucide-react";
import { StoresAPI, RailwayStationsAPI, UsersAPI } from "~/services/api"; // Assuming APIs are in this file

// Import shadcn/ui components
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// Import dashboard layout
import DashboardLayout from "../dashboard/DashboardLayout";

// TypeScript interfaces
interface Store {
  store_id: string;
  name: string;
  telephone_number: string;
  address: string;
  contact_person: string;
  station_id: string;
  city_name: string;
  manager_name: string | null;
}

interface RailwayStation {
  station_id: string;
  station_name: string;
  city_id: string;
}

interface StoreManager {
  user_id: string;
  user_name: string;
  role: string;
}

interface StoreFormData {
  store_id: string;
  name: string;
  telephone_number: string;
  address: string;
  contact_person: string | null;
  station_id: string;
}

const EMPTY_FORM_DATA: StoreFormData = {
  store_id: "string",
  name: "",
  telephone_number: "",
  address: "",
  contact_person: "unassigned",
  station_id: "",
};

export function StoreManagement() {
  const [stores, setStores] = useState<Store[]>([]);
  const [stations, setStations] = useState<RailwayStation[]>([]);
  const [storeManagers, setStoreManagers] = useState<StoreManager[]>([]);
  const [stationMap, setStationMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // For delete loading

  // Fetch data from API
  async function fetchData() {
    try {
      setLoading(true);
      const [storesData, stationsData, managersData] = await Promise.all([
        StoresAPI.getAll(),
        RailwayStationsAPI.getAll(),
        UsersAPI.getStoreManagers(),
      ]);

      console.log("Fetched stores data:", storesData); // Debug log
      console.log("Store managers data:", managersData); // Debug log

      setStores(storesData);
      setStations(stationsData);
      setStoreManagers(managersData);

      // Create lookup map for stations
      const newStationMap = new Map<string, string>();
      stationsData.forEach((station: RailwayStation) => {
        newStationMap.set(station.station_id, station.station_name);
      });
      setStationMap(newStationMap);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handlers ---

  const handleAddNew = () => {
    setSelectedStore(null);
    setIsFormOpen(true);
  };

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setIsFormOpen(true);
  };

  const handleDelete = (store: Store) => {
    setStoreToDelete(store);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!storeToDelete) return;

    setIsSubmitting(true);
    try {
      await StoresAPI.delete(storeToDelete.store_id);
      setStores(stores.filter((s) => s.store_id !== storeToDelete.store_id));
      setIsDeleteAlertOpen(false);
      setStoreToDelete(null);
    } catch (err) {
      console.error("Error deleting store:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Callback for when the form dialog succeeds
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedStore(null);
    fetchData(); // Refetch all data to get the new/updated list
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Store
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border bg-white">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading stores...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8 text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-600">No stores found. Add one to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Store Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Store Manager</TableHead>
                  <TableHead className="font-semibold text-gray-700">Telephone</TableHead>
                  <TableHead className="font-semibold text-gray-700">Address</TableHead>
                  <TableHead className="font-semibold text-gray-700">Station</TableHead>
                  <TableHead className="font-semibold text-gray-700">City</TableHead>
                  <TableHead className="font-semibold text-gray-700 w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.store_id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{store.name}</TableCell>
                    <TableCell className="text-gray-700">
                      {store.manager_name ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {store.manager_name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-700">{store.telephone_number}</TableCell>
                    <TableCell className="text-gray-700">{store.address}</TableCell>
                    <TableCell className="text-gray-700">
                      {stationMap.get(store.station_id) || store.station_id}
                    </TableCell>
                    <TableCell className="text-gray-700">{store.city_name}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(store)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(store)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
            .map     </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add/Edit Store Dialog */}
      <StoreFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        store={selectedStore}
        stations={stations}
        storeManagers={storeManagers}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              store <strong>{storeToDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

// --- Helper Component: StoreFormDialog ---

interface StoreFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  store: Store | null;
  stations: RailwayStation[];
  storeManagers: StoreManager[];
}

function StoreFormDialog({
  isOpen,
  onClose,
  onSuccess,
  store,
  stations,
  storeManagers,
}: StoreFormDialogProps) {
  const [formData, setFormData] = useState<StoreFormData>(EMPTY_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Populate form when 'store' (for editing) changes
  useEffect(() => {
    if (store) {
      setFormData({
        store_id: "string",
        name: store.name,
        telephone_number: store.telephone_number,
        address: store.address,
        // Convert null to "unassigned" for the Select component
        contact_person: store.contact_person || "unassigned",
        station_id: store.station_id,
      });
    } else {
      setFormData(EMPTY_FORM_DATA); // Reset for 'Add New'
    }
    setFormError(null); // Reset error on open
  }, [store, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, station_id: value }));
  };

  const handleManagerChange = (value: string) => {
    // Convert "unassigned" back to null for the database
    setFormData((prev) => ({ 
      ...prev, 
      contact_person: value === "unassigned" ? null : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Prepare data for submission - convert "unassigned" to null
      const submitData = {
        ...formData,
        contact_person: formData.contact_person === "unassigned" ? null : formData.contact_person
      };

      console.log("Submitting store data:", submitData); // Debug log

      if (store) {
        // Update existing store
        const result = await StoresAPI.update(store.store_id, submitData);
        console.log("Update result:", result); // Debug log
      } else {
        // Create new store
        const result = await StoresAPI.create(submitData);
        console.log("Create result:", result); // Debug log
      }
      
      // Close dialog and refresh
      onClose();
      onSuccess(); // Notify parent to refetch
    } catch (err) {
      console.error("Error submitting form:", err);
      setFormError("Failed to save store. Please check the details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{store ? "Edit Store" : "Add New Store"}</DialogTitle>
          {store && (
            <DialogDescription>
              Make changes to the store details. Click save when you're done.
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact_person" className="text-right">
              Store Manager
            </Label>
            <Select
              value={formData.contact_person || "unassigned"}
              onValueChange={handleManagerChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select store manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">No manager assigned</SelectItem>
                {storeManagers.map((manager) => (
                  <SelectItem key={manager.user_id} value={manager.user_id}>
                    {manager.user_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telephone_number" className="text-right">
              Telephone
            </Label>
            <Input
              id="telephone_number"
              name="telephone_number"
              value={formData.telephone_number}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="station_id" className="text-right">
              Station
            </Label>
            <Select
              value={formData.station_id}
              onValueChange={handleStationChange}
              required
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.station_id} value={station.station_id}>
                    {station.station_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formError && (
            <p className="col-span-4 text-center text-sm text-red-600">
              {formError}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StoreManagement;