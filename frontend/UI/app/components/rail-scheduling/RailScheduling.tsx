import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { TrainSchedulesAPI, TrainsAPI, RailwayStationsAPI } from "~/services/api";

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

// Import dashboard layout
import DashboardLayout from "../dashboard/DashboardLayout";
// Import AssignOrdersDialog
import { AssignOrdersDialog } from "./AssignOrdersDialog";

// TypeScript interfaces for API data
interface TrainSchedule {
  schedule_id: string;
  train_id: string;
  source_station_id: string;  // Changed from source_station
  destination_station_id: string;  // Changed from destination_station
  scheduled_date: string;  // Changed from date
  departure_time: string;
  arrival_time: string;
  cargo_capacity: number;  // NEW: Cargo capacity in units
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";  // Fixed type
}

interface Train {
  train_id: string;
  train_name: string;
  capacity: number;
}

interface RailwayStation {
  station_id: string;
  station_name: string;
  city_id: string;  // Backend uses city_id, not city
}

export function RailScheduling() {
  const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
  const [trains, setTrains] = useState<Map<string, string>>(new Map());
  const [stations, setStations] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [routeFilter, setRouteFilter] = useState<string>("all");
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string>("all");
  const [arrivalTimeFilter, setArrivalTimeFilter] = useState<string>("all");

  // Dialog state for assign orders
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<TrainSchedule | null>(null);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [schedulesData, trainsData, stationsData] = await Promise.all([
          TrainSchedulesAPI.getAll(),
          TrainsAPI.getAll(),
          RailwayStationsAPI.getAll()
        ]);
        
        setSchedules(schedulesData);
        
        // Create lookup maps for trains and stations
        const trainMap = new Map<string, string>();
        trainsData.forEach((train: Train) => {
          trainMap.set(train.train_id, train.train_name);
        });
        setTrains(trainMap);
        
        const stationMap = new Map<string, string>();
        stationsData.forEach((station: RailwayStation) => {
          stationMap.set(station.station_id, station.station_name);
        });
        setStations(stationMap);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching train schedules:", err);
        setError("Failed to load train schedules. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Helper function to format route name
  const formatRoute = (sourceId: string, destId: string) => {
    const source = stations.get(sourceId) || sourceId;
    const dest = stations.get(destId) || destId;
    return `${source} - ${dest}`;
  };

  // Handler for assign orders button
  const handleAssignOrders = (schedule: TrainSchedule) => {
    setSelectedSchedule(schedule);
    setDialogOpen(true);
  };

  // Handler for when allocations are successfully created
  const handleAllocationSuccess = () => {
    // Optionally refresh schedules or show a notification
    console.log("Allocations created successfully");
  };

  // Filter schedules based on selected filters
  const filteredSchedules = schedules.filter((schedule) => {
    const route = formatRoute(schedule.source_station_id, schedule.destination_station_id);
    
    if (routeFilter !== "all" && !route.toLowerCase().includes(routeFilter.toLowerCase())) {
      return false;
    }
    if (departureTimeFilter !== "all" && schedule.departure_time !== departureTimeFilter) {
      return false;
    }
    if (arrivalTimeFilter !== "all" && schedule.arrival_time !== arrivalTimeFilter) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Schedule Train Trips</h1>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Route:</span>
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="colombo">Kandy - Colombo</SelectItem>
                <SelectItem value="galle">Kandy - Galle</SelectItem>
                <SelectItem value="matara">Kandy - Matara</SelectItem>
                <SelectItem value="jaffna">Kandy - Jaffna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Departure Time:</span>
            <Select value={departureTimeFilter} onValueChange={setDepartureTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="6:30">6:30</SelectItem>
                <SelectItem value="8:15">8:15</SelectItem>
                <SelectItem value="10:00">10:00</SelectItem>
                <SelectItem value="14:30">14:30</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Arrival Time:</span>
            <Select value={arrivalTimeFilter} onValueChange={setArrivalTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="13:15">13:15</SelectItem>
                <SelectItem value="14:40">14:40</SelectItem>
                <SelectItem value="15:30">15:30</SelectItem>
                <SelectItem value="18:00">18:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border bg-white">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading schedules...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-600">No schedules found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Train</TableHead>
                  <TableHead className="font-semibold text-gray-700">Route</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Departure</TableHead>
                  <TableHead className="font-semibold text-gray-700">Arrival</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 w-[150px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.schedule_id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {trains.get(schedule.train_id) || schedule.train_id}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatRoute(schedule.source_station_id, schedule.destination_station_id)}
                    </TableCell>
                    <TableCell className="text-gray-700">{schedule.scheduled_date}</TableCell>
                    <TableCell className="text-gray-700">{schedule.departure_time}</TableCell>
                    <TableCell className="text-gray-700">{schedule.arrival_time}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={schedule.status === 'PLANNED' ? 'default' : 
                                schedule.status === 'IN_PROGRESS' ? 'secondary' : 
                                schedule.status === 'COMPLETED' ? 'outline' : 'destructive'}
                      >
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                        size="sm"
                        onClick={() => handleAssignOrders(schedule)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Assign Orders
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Results count */}
        {!loading && !error && (
          <div className="text-sm text-gray-600">
            Showing {filteredSchedules.length} of {schedules.length} schedules
          </div>
        )}

        {/* Assign Orders Dialog */}
        {selectedSchedule && (
          <AssignOrdersDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            schedule={selectedSchedule}
            trainName={trains.get(selectedSchedule.train_id) || selectedSchedule.train_id}
            sourceStationName={stations.get(selectedSchedule.source_station_id) || selectedSchedule.source_station_id}
            destinationStationName={stations.get(selectedSchedule.destination_station_id) || selectedSchedule.destination_station_id}
            onSuccess={handleAllocationSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default RailScheduling;
