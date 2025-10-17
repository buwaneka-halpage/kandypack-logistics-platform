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

// Sample data for stores
const storeData = [
  {
    storeId: "M00001",
    city: "Colombo",
    storeManager: "S G Herath",
    contact: "0112345678",
    totalCapacity: 400,
    availableCapacity: 300,
  },
  {
    storeId: "M00002",
    city: "Kandy",
    storeManager: "S G Herath",
    contact: "0112345678",
    totalCapacity: 300,
    availableCapacity: 300,
  },
  {
    storeId: "M00003",
    city: "Negombo",
    storeManager: "S G Herath",
    contact: "0112345678",
    totalCapacity: 400,
    availableCapacity: 300,
  },
  {
    storeId: "M00004",
    city: "Jaffna",
    storeManager: "S G Herath",
    contact: "0112345678",
    totalCapacity: 400,
    availableCapacity: 300,
  },
  {
    storeId: "M00005",
    city: "Matara",
    storeManager: "S G Herath",
    contact: "0112345678",
    totalCapacity: 400,
    availableCapacity: 300,
  },
  {
    storeId: "M00006",
    city: "Galle",
    storeManager: "S G Herath",
    contact: "0112345678",
    totalCapacity: 400,
    availableCapacity: 300,
  },
  {
    storeId: "M00007",
    city: "Trincomalee",
    storeManager: "S G Herath",
    contact: "0112345678",
    totalCapacity: 400,
    availableCapacity: 300,
  },
  {
    storeId: "M00008",
    city: "Colombo",
    storeManager: "S G Herath",
    contact: "0112345678",
    totalCapacity: 400,
    availableCapacity: 300,
  },
];

export default function StoreManagement() {
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("all");
  const [selectedManagerFilter, setSelectedManagerFilter] = useState<string>("all");

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Stores</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* City Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">City:</span>
              <Select value={selectedCityFilter} onValueChange={setSelectedCityFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="colombo">Colombo</SelectItem>
                  <SelectItem value="kandy">Kandy</SelectItem>
                  <SelectItem value="negombo">Negombo</SelectItem>
                  <SelectItem value="jaffna">Jaffna</SelectItem>
                  <SelectItem value="matara">Matara</SelectItem>
                  <SelectItem value="galle">Galle</SelectItem>
                  <SelectItem value="trincomalee">Trincomalee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Store Manager Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Store Manager:</span>
              <Select value={selectedManagerFilter} onValueChange={setSelectedManagerFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Managers</SelectItem>
                  <SelectItem value="herath">S G Herath</SelectItem>
                  <SelectItem value="silva">R Silva</SelectItem>
                  <SelectItem value="fernando">M Fernando</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Store Button */}
            <Button className="bg-primary-navy hover:bg-primary-navy/90 text-white whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Store
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Store ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">City</TableHead>
                  <TableHead className="font-semibold text-gray-700">Store Manager</TableHead>
                  <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Capacity</TableHead>
                  <TableHead className="font-semibold text-gray-700">Available Capacity</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeData.map((store, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {/* Store ID */}
                    <TableCell className="font-medium text-gray-900">
                      {store.storeId}
                    </TableCell>

                    {/* City */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {store.city}
                      </div>
                    </TableCell>

                    {/* Store Manager */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {store.storeManager}
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {store.contact}
                      </div>
                    </TableCell>

                    {/* Total Capacity */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {store.totalCapacity}
                      </div>
                    </TableCell>

                    {/* Available Capacity */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {store.availableCapacity}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hover:bg-gray-100 rounded p-1 transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Store</DropdownMenuItem>
                            <DropdownMenuItem>View Inventory</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete Store</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                          className="bg-primary-navy hover:bg-primary-navy/90 text-white text-sm px-4"
                          size="sm"
                        >
                          Manage Capacity
                        </Button>
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
