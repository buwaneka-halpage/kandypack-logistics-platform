/**
 * Type definitions for Rail Allocation System with Capacity Tracking
 */

export interface TrainSchedule {
  schedule_id: string;
  train_id: string;
  source_station_id: string;
  destination_station_id: string;
  scheduled_date: string;
  departure_time: string;
  arrival_time: string;
  cargo_capacity: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface RailAllocation {
  allocation_id: string;
  order_id: string;
  schedule_id: string;
  shipment_date: string;
  allocated_space: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  allocation_type: 'Rail';
}

export interface TruckAllocation {
  allocation_id: string;
  order_id: string;
  schedule_id: string;
  shipment_date: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  allocation_type: 'Truck';
}

export type Allocation = RailAllocation | TruckAllocation;

export interface ScheduleCapacityInfo {
  schedule_id: string;
  cargo_capacity: number;
  allocated_space: number;
  available_space: number;
  utilization_percentage: number;
  is_full: boolean;
}

export interface AllocatedOrder {
  allocation_id: string;
  order_id: string;
  customer_id: string;
  deliver_city_id: string;
  full_price: number;
  allocated_space: number;
  shipment_date: string;
  status: string;
}

export interface ScheduleAllocatedOrders {
  schedule_id: string;
  total_allocations: number;
  allocations: AllocatedOrder[];
}

export interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  deliver_address: string;
  status: 'PLACED' | 'SCHEDULED_RAIL' | 'IN_WAREHOUSE' | 'SCHEDULED_ROAD' | 'DELIVERED' | 'FAILED';
  deliver_city_id: string;
  full_price: number;
  warehouse_id?: string;
}

export interface OrderItem {
  item_id: string;
  order_id: string;
  store_id: string;
  product_type_id: string;
  quantity: number;
  item_price: number;
}

export interface Product {
  product_type_id: string;
  product_name: string;
  space_consumption_rate: number;
}

export interface OrderWithSpace extends Order {
  calculated_space: number;
  items?: OrderItem[];
}

export interface Train {
  train_id: string;
  train_name: string;
  capacity: number;
}

export interface RailwayStation {
  station_id: string;
  station_name: string;
  city_id: string;
}

export interface City {
  city_id: string;
  city_name: string;
  province: string;
}

export interface Customer {
  customer_id: string;
  customer_user_name: string;
  customer_name: string;
  phone_number: string;
  address: string;
}

// API Request types
export interface CreateAllocationRequest {
  order_id: string;
  schedule_id: string;
  allocation_type: 'Rail' | 'Truck';
  shipment_date: string;
}

export interface CreateAllocationResponse {
  allocation_id: string;
  order_id: string;
  schedule_id: string;
  shipment_date: string;
  allocated_space?: number;  // Only for Rail allocations
  status: string;
  allocation_type: 'Rail' | 'Truck';
}
