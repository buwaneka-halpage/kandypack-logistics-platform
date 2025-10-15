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

// Sample data for rosters
const rosterData = [
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Susil Perera",
    role: "Assistant",
    hoursWorked: 20,
    remainingHours: 40,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
  {
    name: "Amal Fernando",
    role: "Driver",
    hoursWorked: 12,
    remainingHours: 28,
  },
];

export default function RosterManagement() {
  const [selectedNameFilter, setSelectedNameFilter] = useState<string>("all");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Rosters</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Name Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Name:</span>
              <Select value={selectedNameFilter} onValueChange={setSelectedNameFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Names</SelectItem>
                  <SelectItem value="fernando">Amal Fernando</SelectItem>
                  <SelectItem value="perera">Susil Perera</SelectItem>
                  <SelectItem value="silva">Kamal Silva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Role:</span>
              <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
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
                  <TableHead className="font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role</TableHead>
                  <TableHead className="font-semibold text-gray-700">Hours Worked</TableHead>
                  <TableHead className="font-semibold text-gray-700">Remaining hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rosterData.map((roster, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {/* Name */}
                    <TableCell className="font-medium text-gray-900">
                      {roster.name}
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {roster.role}
                      </div>
                    </TableCell>

                    {/* Hours Worked */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {roster.hoursWorked}
                      </div>
                    </TableCell>

                    {/* Remaining Hours */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {roster.remainingHours}
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
