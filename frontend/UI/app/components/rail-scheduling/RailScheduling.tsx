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

// Sample train schedule data
const scheduleData = [
  {
    id: "SO000001",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000002",
    route: "Kandy - Galle",
    departureTime: "6:30",
    arrivalTime: "14:40",
    allocatedCapacity: 50,
    availableCapacity: 100,
  },
  {
    id: "SO000003",
    route: "Kandy - Matara",
    departureTime: "8:15",
    arrivalTime: "15:30",
    allocatedCapacity: 0,
    availableCapacity: 90,
  },
  {
    id: "SO000004",
    route: "Kandy - Jaffna",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000005",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000006",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000007",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000008",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000009",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000010",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000011",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
  {
    id: "SO000012",
    route: "Kandy - Colombo",
    departureTime: "8:15",
    arrivalTime: "13:15",
    allocatedCapacity: 40,
    availableCapacity: 80,
  },
];

export function RailScheduling() {
  const [routeFilter, setRouteFilter] = useState<string>("all");
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string>("all");
  const [arrivalTimeFilter, setArrivalTimeFilter] = useState<string>("all");

  // Filter schedules based on selected filters
  const filteredSchedules = scheduleData.filter((schedule) => {
    if (routeFilter !== "all" && !schedule.route.toLowerCase().includes(routeFilter.toLowerCase())) {
      return false;
    }
    if (departureTimeFilter !== "all" && schedule.departureTime !== departureTimeFilter) {
      return false;
    }
    if (arrivalTimeFilter !== "all" && schedule.arrivalTime !== arrivalTimeFilter) {
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
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Schedule ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Route</TableHead>
                <TableHead className="font-semibold text-gray-700">Departure Time</TableHead>
                <TableHead className="font-semibold text-gray-700">Arrival Time</TableHead>
                <TableHead className="font-semibold text-gray-700">Allocated Capacity</TableHead>
                <TableHead className="font-semibold text-gray-700">Available Capacity</TableHead>
                <TableHead className="font-semibold text-gray-700 w-[150px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{schedule.id}</TableCell>
                  <TableCell className="text-gray-700">{schedule.route}</TableCell>
                  <TableCell className="text-gray-700">{schedule.departureTime}</TableCell>
                  <TableCell className="text-gray-700">{schedule.arrivalTime}</TableCell>
                  <TableCell className="text-gray-700">{schedule.allocatedCapacity}</TableCell>
                  <TableCell className="text-gray-700">{schedule.availableCapacity}</TableCell>
                  <TableCell>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Assign Orders
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {filteredSchedules.length} of {scheduleData.length} schedules
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RailScheduling;
