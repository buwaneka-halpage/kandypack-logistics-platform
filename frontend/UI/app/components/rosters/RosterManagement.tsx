import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Loader2, AlertCircle, Users } from "lucide-react";

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
import AssignRosterDialog from "./AssignRosterDialog";
import { DriversAPI, AssistantsAPI } from "~/services/api";

interface RosterMember {
  id: string;
  name: string;
  role: "Driver" | "Assistant";
  hoursWorked: number;
  maxHours: number;
  remainingHours: number;
  status: "available" | "near-limit" | "at-limit";
}

export default function RosterManagement() {
  const [rosters, setRosters] = useState<RosterMember[]>([]);
  const [filteredRosters, setFilteredRosters] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedNameFilter, setSelectedNameFilter] = useState<string>("all");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Fetch drivers and assistants
  const fetchRosters = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [driversData, assistantsData] = await Promise.all([
        DriversAPI.getAll(),
        AssistantsAPI.getAll(),
      ]);

      // Transform drivers data
      const driversRoster: RosterMember[] = driversData.map((driver: any) => {
        const hoursWorked = driver.weekly_working_hours || 0;
        const maxHours = 40; // Drivers max 40 hours
        const remainingHours = maxHours - hoursWorked;
        
        let status: "available" | "near-limit" | "at-limit" = "available";
        if (hoursWorked >= maxHours) status = "at-limit";
        else if (hoursWorked >= 35) status = "near-limit";

        return {
          id: driver.driver_id,
          name: driver.name,
          role: "Driver",
          hoursWorked,
          maxHours,
          remainingHours,
          status,
        };
      });

      // Transform assistants data
      const assistantsRoster: RosterMember[] = assistantsData.map((assistant: any) => {
        const hoursWorked = assistant.weekly_working_hours || 0;
        const maxHours = 60; // Assistants max 60 hours
        const remainingHours = maxHours - hoursWorked;
        
        let status: "available" | "near-limit" | "at-limit" = "available";
        if (hoursWorked >= maxHours) status = "at-limit";
        else if (hoursWorked >= 55) status = "near-limit";

        return {
          id: assistant.assistant_id,
          name: assistant.name,
          role: "Assistant",
          hoursWorked,
          maxHours,
          remainingHours,
          status,
        };
      });

      const allRosters = [...driversRoster, ...assistantsRoster];
      setRosters(allRosters);
      setFilteredRosters(allRosters);
    } catch (err: any) {
      setError(err.message || "Failed to load rosters");
      console.error("Error fetching rosters:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load rosters on mount
  useEffect(() => {
    fetchRosters();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...rosters];

    // Filter by name
    if (selectedNameFilter !== "all") {
      filtered = filtered.filter((roster) =>
        roster.name.toLowerCase().includes(selectedNameFilter.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRoleFilter !== "all") {
      filtered = filtered.filter(
        (roster) => roster.role.toLowerCase() === selectedRoleFilter.toLowerCase()
      );
    }

    setFilteredRosters(filtered);
  }, [selectedNameFilter, selectedRoleFilter, rosters]);

  // Get unique names for filter
  const uniqueNames = Array.from(new Set(rosters.map((r) => r.name)));

  // Handle assignment success
  const handleAssignSuccess = () => {
    fetchRosters();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "near-limit":
        return "bg-yellow-100 text-yellow-800";
      case "at-limit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "near-limit":
        return "Near Limit";
      case "at-limit":
        return "At Limit";
      default:
        return "Unknown";
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Rosters</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track driver and assistant availability and working hours
            </p>
          </div>
          
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
                  {uniqueNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
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

            {/* Assign Roster Button */}
            <Button 
              className="bg-primary-navy hover:bg-primary-navy/90 text-white whitespace-nowrap"
              onClick={() => setAssignDialogOpen(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Assign to Route
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Error Loading Rosters</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRosters}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading rosters...</span>
            </div>
          ) : filteredRosters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="h-12 w-12 mb-2 text-gray-400" />
              <p className="text-lg font-medium">No rosters found</p>
              <p className="text-sm mt-1">
                {selectedNameFilter !== "all" || selectedRoleFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No drivers or assistants available"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Role</TableHead>
                    <TableHead className="font-semibold text-gray-700">Hours Worked</TableHead>
                    <TableHead className="font-semibold text-gray-700">Max Hours</TableHead>
                    <TableHead className="font-semibold text-gray-700">Remaining Hours</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRosters.map((roster) => (
                    <TableRow key={roster.id} className="hover:bg-gray-50">
                      {/* Name */}
                      <TableCell className="font-medium text-gray-900">
                        {roster.name}
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          roster.role === "Driver"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {roster.role}
                        </span>
                      </TableCell>

                      {/* Hours Worked */}
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {roster.hoursWorked}h
                        </div>
                      </TableCell>

                      {/* Max Hours */}
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {roster.maxHours}h
                        </div>
                      </TableCell>

                      {/* Remaining Hours */}
                      <TableCell>
                        <div className={`text-sm font-medium ${
                          roster.remainingHours <= 5
                            ? "text-red-600"
                            : roster.remainingHours <= 10
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}>
                          {roster.remainingHours}h
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              roster.status === "at-limit"
                                ? "bg-red-600"
                                : roster.status === "near-limit"
                                ? "bg-yellow-600"
                                : "bg-green-600"
                            }`}
                            style={{
                              width: `${(roster.hoursWorked / roster.maxHours) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            roster.status
                          )}`}
                        >
                          {getStatusText(roster.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Business Rules Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Business Constraints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
            <div>
              <p className="font-medium">👨‍✈️ Drivers:</p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-xs">
                <li>Maximum 40 hours per week</li>
                <li>Cannot work consecutive routes</li>
                <li>No overlapping assignments</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">👨‍🔧 Assistants:</p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-xs">
                <li>Maximum 60 hours per week</li>
                <li>Can work max 2 consecutive routes</li>
                <li>No overlapping assignments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Dialog */}
      <AssignRosterDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onSuccess={handleAssignSuccess}
      />
    </DashboardLayout>
  );
}
