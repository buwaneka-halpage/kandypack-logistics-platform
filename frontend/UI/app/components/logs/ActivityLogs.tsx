import * as React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";

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
import DashboardLayout from "../dashboard/DashboardLayout";

// Sample data for activity logs
const activityLogsData = [
  {
    timestamp: "16/09/2025 21:47",
    id: "A000001",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
  {
    timestamp: "14/09/2025 04:03",
    id: "A000011",
    section: "Truck Scheduling",
    actionPerformed: "Added new truck schedule R000009",
  },
  {
    timestamp: "13/09/2025 21:34",
    id: "A000021",
    section: "Reports",
    actionPerformed: "Downloaded quarterly sales report",
  },
  {
    timestamp: "12/09/2025 09:47",
    id: "A000003",
    section: "Last-Mile Delivery",
    actionPerformed: "Assigned order 1000001 to route R000001",
  },
  {
    timestamp: "12/09/2025 06:47",
    id: "A000002",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
  {
    timestamp: "11/09/2025 21:23",
    id: "A000001",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
  {
    timestamp: "10/09/2025 21:22",
    id: "A000001",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
  {
    timestamp: "09/09/2025 21:12",
    id: "A000001",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
  {
    timestamp: "09/09/2025 21:34",
    id: "A000001",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
  {
    timestamp: "08/09/2025 21:47",
    id: "A000001",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
  {
    timestamp: "15/09/2025 21:47",
    id: "A000001",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
  {
    timestamp: "01/09/2025 21:47",
    id: "A000001",
    section: "Rail Scheduling",
    actionPerformed: "Allocated 10 units to S0000001",
  },
];

export default function ActivityLogs() {
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>("all");

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Date:</span>
              <Select value={selectedDateFilter} onValueChange={setSelectedDateFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Section Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Section:</span>
              <Select value={selectedSectionFilter} onValueChange={setSelectedSectionFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="rail">Rail Scheduling</SelectItem>
                  <SelectItem value="truck">Truck Scheduling</SelectItem>
                  <SelectItem value="last-mile">Last-Mile Delivery</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Roster Button */}
            <Button className="bg-primary-navy hover:bg-primary-navy/90 text-white whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Roster
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Timestamp</TableHead>
                  <TableHead className="font-semibold text-gray-700">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Section</TableHead>
                  <TableHead className="font-semibold text-gray-700">Action Performed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogsData.map((log, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {/* Timestamp */}
                    <TableCell className="font-medium text-gray-900">
                      {log.timestamp}
                    </TableCell>

                    {/* ID */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {log.id}
                      </div>
                    </TableCell>

                    {/* Section */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {log.section}
                      </div>
                    </TableCell>

                    {/* Action Performed */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {log.actionPerformed}
                      </div>
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
