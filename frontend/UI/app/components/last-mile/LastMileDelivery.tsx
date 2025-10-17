import * as React from "react";
import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

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

// Sample data for schedule trucks
const scheduleData = [
  {
    routeId: "R000001",
    areasCovered: ["Nugegoda", "Maharagama", "Kottawa"],
    deliveryTime: "1 hr 50 min",
    truck: "XY 1234",
    driver: "S Fernando",
    assistant: "A Kumaraski",
    capacity: 30,
  },
  {
    routeId: "R000002",
    areasCovered: ["Karapitiya", "Weligama", "Pinadduwa"],
    deliveryTime: "2 hr 30 min",
    truck: "XY 1234",
    driver: "S Fernando",
    assistant: "A Kumaraski",
    capacity: 30,
  },
  {
    routeId: "R000003",
    areasCovered: ["Hakmana", "Dikwella", "Mirissa"],
    deliveryTime: "1 hr 50 min",
    truck: "XY 1234",
    driver: "S Fernando",
    assistant: "A Kumaraski",
    capacity: 30,
  },
  {
    routeId: "R000004",
    areasCovered: ["Nugegoda", "Maharagama", "Kottawa"],
    deliveryTime: "1 hr 50 min",
    truck: "XY 1234",
    driver: "S Fernando",
    assistant: "A Kumaraski",
    capacity: 30,
  },
  {
    routeId: "R000005",
    areasCovered: ["Nugegoda", "Maharagama", "Kottawa"],
    deliveryTime: "1 hr 50 min",
    truck: "XY 1234",
    driver: "S Fernando",
    assistant: "A Kumaraski",
    capacity: 30,
  },
  {
    routeId: "R000006",
    areasCovered: ["Nugegoda", "Maharagama", "Kottawa"],
    deliveryTime: "1 hr 50 min",
    truck: "XY 1234",
    driver: "S Fernando",
    assistant: "A Kumaraski",
    capacity: 30,
  },
  {
    routeId: "R000007",
    areasCovered: ["Nugegoda", "Maharagama", "Kottawa"],
    deliveryTime: "1 hr 50 min",
    truck: "XY 1234",
    driver: "S Fernando",
    assistant: "A Kumaraski",
    capacity: 30,
  },
  {
    routeId: "R000008",
    areasCovered: ["Nugegoda", "Maharagama", "Kottawa"],
    deliveryTime: "1 hr 50 min",
    truck: "XY 1234",
    driver: "S Fernando",
    assistant: "A Kumaraski",
    capacity: 30,
  },
];

export default function LastMileDelivery() {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>("all");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>("all");

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
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Route ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Areas Covered</TableHead>
                  <TableHead className="font-semibold text-gray-700">Delivery Time</TableHead>
                  <TableHead className="font-semibold text-gray-700">Truck</TableHead>
                  <TableHead className="font-semibold text-gray-700">Driver</TableHead>
                  <TableHead className="font-semibold text-gray-700">Assistant</TableHead>
                  <TableHead className="font-semibold text-gray-700">Available Capacity</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((schedule, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {/* Route ID */}
                    <TableCell className="font-medium text-gray-900">
                      {schedule.routeId}
                    </TableCell>

                    {/* Areas Covered */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {schedule.areasCovered.join(", ")}
                      </div>
                    </TableCell>

                    {/* Delivery Time */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {schedule.deliveryTime}
                      </div>
                    </TableCell>

                    {/* Truck */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{schedule.truck}</span>
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
                        <span className="text-sm text-gray-700">{schedule.driver}</span>
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
                        <span className="text-sm text-gray-700">{schedule.assistant}</span>
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
                        {schedule.capacity}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <Button 
                        className="bg-primary-navy hover:bg-primary-navy/90 text-white text-sm px-4"
                        size="sm"
                      >
                        Assign Orders
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
