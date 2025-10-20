import * as React from "react";
import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Loader2, Package } from "lucide-react";
import { TruckSchedulesAPI, TrucksAPI, RoutesAPI, DriversAPI, AssistantsAPI } from "~/services/api";
import { AssignOrdersToTruckDialog } from "./AssignOrdersToTruckDialog";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
import DashboardLayout from "../dashboard/DashboardLayout";

// TypeScript interfaces for API data
interface TruckSchedule {
  schedule_id: string;
  truck_id: string;
  route_id: string;
  driver_id: string;
  assistant_id: string;
  date: string;
  start_time: string;
  end_time: string;
  allocated_capacity: number;
  available_capacity: number;
}

interface Truck {
  truck_id: string;
  license_plate: string;
  capacity: number;
  status: string;
}

interface Route {
  route_id: string;
  route_description: string;
  max_time_hours: number;
}

interface Driver {
  driver_id: string;
  driver_name: string;
  contact_number: string;
}

interface Assistant {
  assistant_id: string;
  assistant_name: string;
  contact_number: string;
}

export default function LastMileDelivery() {
  const [schedules, setSchedules] = useState<TruckSchedule[]>([]);
  const [trucks, setTrucks] = useState<Map<string, Truck>>(new Map());
  const [routes, setRoutes] = useState<Map<string, Route>>(new Map());
  const [drivers, setDrivers] = useState<Map<string, string>>(new Map());
  const [assistants, setAssistants] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>("all");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>("all");

  // Dialog state for assigning orders
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<TruckSchedule | null>(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedulesData, trucksData, routesData, driversData, assistantsData] = await Promise.all([
        TruckSchedulesAPI.getAll(),
        TrucksAPI.getAll(),
        RoutesAPI.getAll(),
        DriversAPI.getAll(),
        AssistantsAPI.getAll()
      ]);
      
      setSchedules(schedulesData);
      
      // Create lookup maps
      const truckMap = new Map<string, Truck>();
      trucksData.forEach((truck: Truck) => {
        truckMap.set(truck.truck_id, truck);
      });
      setTrucks(truckMap);
      
      const routeMap = new Map<string, Route>();
      routesData.forEach((route: Route) => {
        routeMap.set(route.route_id, route);
      });
      setRoutes(routeMap);
      
      const driverMap = new Map<string, string>();
      driversData.forEach((driver: Driver) => {
        driverMap.set(driver.driver_id, driver.driver_name);
      });
      setDrivers(driverMap);
      
      const assistantMap = new Map<string, string>();
      assistantsData.forEach((assistant: Assistant) => {
        assistantMap.set(assistant.assistant_id, assistant.assistant_name);
      });
      setAssistants(assistantMap);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching truck schedules:", err);
      setError("Failed to load truck schedules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to format delivery time
  const formatDeliveryTime = (maxHours: number) => {
    const hours = Math.floor(maxHours);
    const minutes = Math.round((maxHours - hours) * 60);
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Schedule Trucks</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Areas Covered Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Areas Covered:</span>
              <Select value={selectedAreaFilter} onValueChange={setSelectedAreaFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="nugegoda">Nugegoda</SelectItem>
                  <SelectItem value="maharagama">Maharagama</SelectItem>
                  <SelectItem value="kottawa">Kottawa</SelectItem>
                  <SelectItem value="karapitiya">Karapitiya</SelectItem>
                  <SelectItem value="weligama">Weligama</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Maximum Delivery Time Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Maximum Delivery Time:</span>
              <Select value={selectedTimeFilter} onValueChange={setSelectedTimeFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Times</SelectItem>
                  <SelectItem value="1hr">Under 1 hr</SelectItem>
                  <SelectItem value="2hr">Under 2 hrs</SelectItem>
                  <SelectItem value="3hr">Under 3 hrs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Schedule Button */}
            <Button className="bg-primary-navy hover:bg-primary-navy/90 text-white whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading schedules...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <p className="text-gray-600">No truck schedules found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Schedule ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Route</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Time</TableHead>
                    <TableHead className="font-semibold text-gray-700">Truck</TableHead>
                    <TableHead className="font-semibold text-gray-700">Driver</TableHead>
                    <TableHead className="font-semibold text-gray-700">Assistant</TableHead>
                    <TableHead className="font-semibold text-gray-700">Available Capacity</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => {
                    const truck = trucks.get(schedule.truck_id);
                    const route = routes.get(schedule.route_id);
                    const driverName = drivers.get(schedule.driver_id);
                    const assistantName = assistants.get(schedule.assistant_id);
                    
                    return (
                      <TableRow key={schedule.schedule_id} className="hover:bg-gray-50">
                        {/* Schedule ID */}
                        <TableCell className="font-medium text-gray-900">
                          {schedule.schedule_id}
                        </TableCell>

                        {/* Route */}
                        <TableCell>
                          <div className="text-sm text-gray-700">
                            {route?.route_description || schedule.route_id}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <div className="text-sm text-gray-700">
                            {schedule.date}
                          </div>
                        </TableCell>

                        {/* Time */}
                        <TableCell>
                          <div className="text-sm text-gray-700">
                            {schedule.start_time} - {schedule.end_time}
                          </div>
                        </TableCell>

                        {/* Truck */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              {truck?.license_plate || schedule.truck_id}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="hover:bg-gray-100 rounded p-1 transition-colors">
                                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Change Truck</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>

                        {/* Driver */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              {driverName || schedule.driver_id}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="hover:bg-gray-100 rounded p-1 transition-colors">
                                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Change Driver</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>

                        {/* Assistant */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              {assistantName || schedule.assistant_id}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="hover:bg-gray-100 rounded p-1 transition-colors">
                                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Change Assistant</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>

                        {/* Available Capacity */}
                        <TableCell>
                          <div className="text-sm text-gray-700">
                            {schedule.available_capacity}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <Button 
                            className="bg-primary-navy hover:bg-primary-navy/90 text-white text-sm px-4"
                            size="sm"
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setDialogOpen(true);
                            }}
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Assign Orders
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Assign Orders Dialog */}
      <AssignOrdersToTruckDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schedule={selectedSchedule}
        onSuccess={() => {
          // Refresh schedules after successful assignment
          fetchData();
        }}
      />
    </DashboardLayout>
  );
}
