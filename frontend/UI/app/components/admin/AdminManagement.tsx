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

// Sample data for admins
const adminData = [
  {
    adminId: "A000001",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000002",
    fullName: "Amal Fernando",
    role: "Driver",
    contact: "0712345678",
  },
  {
    adminId: "A000003",
    fullName: "Amal Fernando",
    role: "Driver Assistant",
    contact: "0712345678",
  },
  {
    adminId: "A000004",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000005",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000006",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000007",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000008",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000009",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000010",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000011",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
  {
    adminId: "A000012",
    fullName: "Amal Fernando",
    role: "System Admin",
    contact: "0712345678",
  },
];

export default function AdminManagement() {
  const [selectedNameFilter, setSelectedNameFilter] = useState<string>("all");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Admins</h1>
          
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
                  <SelectItem value="silva">Kamal Silva</SelectItem>
                  <SelectItem value="perera">Nimal Perera</SelectItem>
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
                  <SelectItem value="system-admin">System Admin</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="driver-assistant">Driver Assistant</SelectItem>
                  <SelectItem value="store-manager">Store Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Admin Button */}
            <Button className="bg-primary-navy hover:bg-primary-navy/90 text-white whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Admin ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Full name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role</TableHead>
                  <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminData.map((admin, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {/* Admin ID */}
                    <TableCell className="font-medium text-gray-900">
                      {admin.adminId}
                    </TableCell>

                    {/* Full Name */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {admin.fullName}
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{admin.role}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hover:bg-gray-100 rounded p-1 transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem>View Permissions</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {admin.contact}
                      </div>
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hover:bg-gray-100 rounded p-1 transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Admin</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem>View Activity Log</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Deactivate Admin</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
