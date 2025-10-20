import * as React from "react";
import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Loader2, AlertCircle } from "lucide-react";

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
import AddAdminDialog from "./AddAdminDialog";
import EditAdminDialog from "./EditAdminDialog";
import DeleteAdminDialog from "./DeleteAdminDialog";
import { UsersAPI } from "~/services/api";

interface User {
  user_id: string;
  user_name: string;
  role: string;
  created_at: string;
}

const ROLE_DISPLAY_MAP: Record<string, string> = {
  SystemAdmin: "System Admin",
  Management: "Management",
  StoreManager: "Store Manager",
  Driver: "Driver",
  Assistant: "Driver Assistant",
  WarehouseStaff: "Warehouse Staff",
};

export default function AdminManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedNameFilter, setSelectedNameFilter] = useState<string>("all");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await UsersAPI.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters when filter values or users change
  useEffect(() => {
    let filtered = [...users];

    // Filter by name
    if (selectedNameFilter !== "all") {
      filtered = filtered.filter((user) =>
        user.user_name.toLowerCase().includes(selectedNameFilter.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRoleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRoleFilter);
    }

    setFilteredUsers(filtered);
  }, [selectedNameFilter, selectedRoleFilter, users]);

  // Get unique usernames for filter
  const uniqueUsernames = Array.from(new Set(users.map((u) => u.user_name)));

  // Handle dialog actions
  const handleAddSuccess = () => {
    fetchUsers();
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchUsers();
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    fetchUsers();
  };

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
                  {uniqueUsernames.map((name) => (
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
                <SelectTrigger className="w-[160px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="SystemAdmin">System Admin</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="StoreManager">Store Manager</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="Assistant">Driver Assistant</SelectItem>
                  <SelectItem value="WarehouseStaff">Warehouse Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Admin Button */}
            <Button 
              className="bg-primary-navy hover:bg-primary-navy/90 text-white whitespace-nowrap"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Error Loading Users</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
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
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm mt-1">
                {selectedNameFilter !== "all" || selectedRoleFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Click 'Add Admin' to create your first user"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">User ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Username</TableHead>
                    <TableHead className="font-semibold text-gray-700">Role</TableHead>
                    <TableHead className="font-semibold text-gray-700">Created At</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id} className="hover:bg-gray-50">
                      {/* User ID */}
                      <TableCell className="font-mono text-xs text-gray-600">
                        {user.user_id.substring(0, 8)}...
                      </TableCell>

                      {/* Username */}
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {user.user_name}
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {ROLE_DISPLAY_MAP[user.role] || user.role}
                        </span>
                      </TableCell>

                      {/* Created At */}
                      <TableCell>
                        <div className="text-sm text-gray-700">
                          {new Date(user.created_at).toLocaleDateString()}
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
                              <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                Edit Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteClick(user)}
                              >
                                Delete Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddAdminDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleAddSuccess}
      />
      <EditAdminDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
        user={selectedUser}
      />
      <DeleteAdminDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
        user={selectedUser}
      />
    </DashboardLayout>
  );
}
