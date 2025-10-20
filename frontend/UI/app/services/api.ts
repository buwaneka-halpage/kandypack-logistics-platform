// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token management
export const TokenService = {
  getToken(): string | null {
    return localStorage.getItem('kandypack_token');
  },

  setToken(token: string): void {
    localStorage.setItem('kandypack_token', token);
  },

  removeToken(): void {
    localStorage.removeItem('kandypack_token');
  },

  getUser(): any {
    const userStr = localStorage.getItem('kandypack_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: any): void {
    localStorage.setItem('kandypack_user', JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem('kandypack_user');
  },

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
};

// HTTP client with JWT handling
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = TokenService.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data?.detail || data?.message || 'An error occurred',
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error occurred');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async postFormData<T>(endpoint: string, data: FormData): Promise<T> {
    const token = TokenService.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: data,
    };

    try {
      const response = await fetch(url, config);
      const responseData = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          responseData?.detail || 'An error occurred',
          responseData
        );
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error occurred');
    }
  }
}

// Create HTTP client instance
export const httpClient = new HttpClient(API_BASE_URL);

// Authentication API
export const AuthAPI = {
  // Staff/User login
  async loginStaff(username: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return httpClient.postFormData<{
      access_token: string;
      token_type: string;
      user_id: string;
      user_name: string;
      role: string;
      warehouse_id?: string;  // Optional: for warehouse-scoped roles
      warehouse_name?: string; // Optional: for display
    }>('/users/login', formData as any);
  },

  // Customer login
  async loginCustomer(username: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return httpClient.postFormData<{
      access_token: string;
      token_type: string;
      customer_id: string;
      customer_user_name: string;
      role: string;
    }>('/customers/login', formData as any);
  },

  // Customer signup
  async signupCustomer(signupData: {
    customer_user_name: string;
    customer_name: string;
    phone_number: string;
    address: string;
    password: string;
  }) {
    return httpClient.post<{
      message: string;
      access_token: string;
      token_type: string;
      customer_id: string;
      customer_user_name: string;
      role: string;
    }>('/customers/signup', signupData);
  },
};

// Orders API
export const OrdersAPI = {
  // Get customer's own orders (for logged-in customers)
  async getMyOrders() {
    return httpClient.get<any[]>('/orders/my-orders');
  },

  // Create order with items for customers
  async createWithItems(orderData: {
    deliver_address: string;
    deliver_city_id: string;
    order_date: string;
    items: Array<{
      product_type_id: string;
      quantity: number;
      unit_price: number;
    }>;
  }) {
    return httpClient.post<any>('/orders/create-with-items', orderData);
  },

  async getAll(params?: { status?: string; customer_id?: string; warehouse_id?: string }) {
    return httpClient.get<any[]>('/orders', params);
  },

  async getById(orderId: string) {
    return httpClient.get<any>(`/orders/${orderId}`);
  },

  async create(orderData: any) {
    return httpClient.post<any>('/orders', orderData);
  },

  async update(orderId: string, updateData: any) {
    return httpClient.put<any>(`/orders/${orderId}`, updateData);
  },

  async delete(orderId: string) {
    return httpClient.delete<any>(`/orders/${orderId}`);
  },

  // Assign order to warehouse (Management/SystemAdmin only)
  async assignToWarehouse(orderId: string, warehouseId: string) {
    return httpClient.post<any>(`/orders/${orderId}/assign-warehouse`, { 
      warehouse_id: warehouseId 
    });
  },

  // Get orders by warehouse (for warehouse staff)
  async getByWarehouse(warehouseId: string, params?: { status?: string }) {
    return httpClient.get<any[]>(`/warehouses/${warehouseId}/orders`, params);
  },
};

// Users API (Staff Management)
export const UsersAPI = {
  async getAll() {
    return httpClient.get<any[]>('/users');
  },

  async getStoreManagers() {
    return httpClient.get<any[]>('/users/store-managers/list');
  },

  async getById(userId: string) {
    return httpClient.get<any>(`/users/${userId}`);
  },

  async create(userData: any) {
    return httpClient.post<any>('/users', userData);
  },

  async update(userId: string, updateData: any) {
    return httpClient.put<any>(`/users/${userId}`, updateData);
  },

  async delete(userId: string) {
    return httpClient.delete<any>(`/users/${userId}`);
  },
};

// Customers API
export const CustomersAPI = {
  async getAll() {
    return httpClient.get<any[]>('/customers');
  },

  async getById(customerId: string) {
    return httpClient.get<any>(`/customers/${customerId}`);
  },

  async create(customerData: any) {
    return httpClient.post<any>('/customers', customerData);
  },

  async update(customerId: string, updateData: any) {
    return httpClient.put<any>(`/customers/${customerId}`, updateData);
  },

  async delete(customerId: string) {
    return httpClient.delete<any>(`/customers/${customerId}`);
  },
};

// Cities API
export const CitiesAPI = {
  // Get cities list for customers (for delivery address selection)
  async getList() {
    return httpClient.get<any[]>('/cities/list');
  },

  async getAll() {
    return httpClient.get<any[]>('/cities');
  },

  async getById(cityId: string) {
    return httpClient.get<any>(`/cities/${cityId}`);
  },

  async create(cityData: any) {
    return httpClient.post<any>('/cities', cityData);
  },

  async update(cityId: string, updateData: any) {
    return httpClient.put<any>(`/cities/${cityId}`, updateData);
  },

  async delete(cityId: string) {
    return httpClient.delete<any>(`/cities/${cityId}`);
  },
};

// Railway Stations API
export const RailwayStationsAPI = {
  async getAll() {
    return httpClient.get<any[]>('/railway_stations');
  },

  async getById(stationId: string) {
    return httpClient.get<any>(`/railway_stations/${stationId}`);
  },

  async create(stationData: any) {
    return httpClient.post<any>('/railway_stations', stationData);
  },

  async update(stationId: string, updateData: any) {
    return httpClient.put<any>(`/railway_stations/${stationId}`, updateData);
  },

  async delete(stationId: string) {
    return httpClient.delete<any>(`/railway_stations/${stationId}`);
  },
};

// Stores API
export const StoresAPI = {
  async getAll() {
    return httpClient.get<any[]>('/stores');
  },

  async getById(storeId: string) {
    return httpClient.get<any>(`/stores/${storeId}`);
  },

  async create(storeData: any) {
    return httpClient.post<any>('/stores', storeData);
  },

  async update(storeId: string, updateData: any) {
    return httpClient.put<any>(`/stores/${storeId}`, updateData);
  },

  async delete(storeId: string) {
    return httpClient.delete<any>(`/stores/${storeId}`);
  },
};

// Products API
export const ProductsAPI = {
  // Get products catalog for customers (no staff permissions required)
  async getCatalog() {
    return httpClient.get<any[]>('/products/catalog');
  },

  async getAll() {
    return httpClient.get<any[]>('/products');
  },

  async getById(productId: string) {
    return httpClient.get<any>(`/products/${productId}`);
  },

  async create(productData: any) {
    return httpClient.post<any>('/products', productData);
  },

  async update(productId: string, updateData: any) {
    return httpClient.put<any>(`/products/${productId}`, updateData);
  },

  async delete(productId: string) {
    return httpClient.delete<any>(`/products/${productId}`);
  },
};

// Routes API
export const RoutesAPI = {
  async getAll() {
    return httpClient.get<any[]>('/routes');
  },

  async getById(routeId: string) {
    return httpClient.get<any>(`/routes/${routeId}`);
  },

  async create(routeData: any) {
    return httpClient.post<any>('/routes', routeData);
  },

  async update(routeId: string, updateData: any) {
    return httpClient.put<any>(`/routes/${routeId}`, updateData);
  },

  async delete(routeId: string) {
    return httpClient.delete<any>(`/routes/${routeId}`);
  },
};

// Trains API
export const TrainsAPI = {
  async getAll() {
    return httpClient.get<any[]>('/trains');
  },

  async getById(trainId: string) {
    return httpClient.get<any>(`/trains/${trainId}`);
  },

  async create(trainData: any) {
    return httpClient.post<any>('/trains', trainData);
  },

  async update(trainId: string, updateData: any) {
    return httpClient.put<any>(`/trains/${trainId}`, updateData);
  },

  async delete(trainId: string) {
    return httpClient.delete<any>(`/trains/${trainId}`);
  },
};

// Train Schedules API
export const TrainSchedulesAPI = {
  async getAll() {
    return httpClient.get<any[]>('/trainSchedules');
  },

  async getById(scheduleId: string) {
    return httpClient.get<any>(`/trainSchedules/${scheduleId}`);
  },

  async create(scheduleData: any) {
    return httpClient.post<any>('/trainSchedules', scheduleData);
  },

  async update(scheduleId: string, updateData: any) {
    return httpClient.put<any>(`/trainSchedules/${scheduleId}`, updateData);
  },

  async delete(scheduleId: string) {
    return httpClient.delete<any>(`/trainSchedules/${scheduleId}`);
  },
};

// Trucks API
export const TrucksAPI = {
  async getAll() {
    return httpClient.get<any[]>('/trucks');
  },

  async getById(truckId: string) {
    return httpClient.get<any>(`/trucks/${truckId}`);
  },

  async create(truckData: any) {
    return httpClient.post<any>('/trucks', truckData);
  },

  async update(truckId: string, updateData: any) {
    return httpClient.put<any>(`/trucks/${truckId}`, updateData);
  },

  async delete(truckId: string) {
    return httpClient.delete<any>(`/trucks/${truckId}`);
  },
};

// Truck Schedules API
export const TruckSchedulesAPI = {
  async getAll() {
    return httpClient.get<any[]>('/truckSchedules/');
  },

  async getById(scheduleId: string) {
    return httpClient.get<any>(`/truckSchedules/${scheduleId}`);
  },

  async create(scheduleData: any) {
    return httpClient.post<any>('/truckSchedules/', scheduleData);
  },

  async update(scheduleId: string, updateData: any) {
    return httpClient.put<any>(`/truckSchedules/${scheduleId}`, updateData);
  },

  async delete(scheduleId: string) {
    return httpClient.delete<any>(`/truckSchedules/${scheduleId}`);
  },
};

// Drivers API
export const DriversAPI = {
  async getAll() {
    return httpClient.get<any[]>('/drivers');
  },

  async getById(driverId: string) {
    return httpClient.get<any>(`/drivers/${driverId}`);
  },

  async create(driverData: any) {
    return httpClient.post<any>('/drivers', driverData);
  },

  async update(driverId: string, updateData: any) {
    return httpClient.put<any>(`/drivers/${driverId}`, updateData);
  },

  async delete(driverId: string) {
    return httpClient.delete<any>(`/drivers/${driverId}`);
  },
};

// Assistants API
export const AssistantsAPI = {
  async getAll() {
    return httpClient.get<any[]>('/assistants');
  },

  async getById(assistantId: string) {
    return httpClient.get<any>(`/assistants/${assistantId}`);
  },

  async create(assistantData: any) {
    return httpClient.post<any>('/assistants', assistantData);
  },

  async update(assistantId: string, updateData: any) {
    return httpClient.put<any>(`/assistants/${assistantId}`, updateData);
  },

  async delete(assistantId: string) {
    return httpClient.delete<any>(`/assistants/${assistantId}`);
  },
};

// Allocations API
export const AllocationsAPI = {
  // Get all allocations (both rail and truck)
  async getAll() {
    return httpClient.get<any[]>('/allocations');
  },

  async getById(allocationId: string) {
    return httpClient.get<any>(`/allocations/${allocationId}`);
  },

  async create(allocationData: {
    order_id: string;
    schedule_id: string;
    allocation_type: 'Rail' | 'Truck';
    shipment_date: string;
  }) {
    // Backend expects query parameters, not body
    const params = new URLSearchParams({
      order_id: allocationData.order_id,
      schedule_id: allocationData.schedule_id,
      allocation_type: allocationData.allocation_type,
      shipment_date: allocationData.shipment_date,
    });
    return httpClient.post<any>(`/allocations?${params.toString()}`);
  },

  async update(allocationId: string, updateData: any) {
    return httpClient.put<any>(`/allocations/${allocationId}`, updateData);
  },

  async delete(allocationId: string) {
    return httpClient.delete<any>(`/allocations/${allocationId}`);
  },

  // Get capacity information for a train schedule
  async getScheduleCapacity(scheduleId: string) {
    return httpClient.get<{
      schedule_id: string;
      cargo_capacity: number;
      allocated_space: number;
      available_space: number;
      utilization_percentage: number;
      is_full: boolean;
    }>(`/allocations/schedule/${scheduleId}/capacity`);
  },

  // Get all orders allocated to a specific schedule
  async getScheduleAllocatedOrders(scheduleId: string) {
    return httpClient.get<{
      schedule_id: string;
      total_allocations: number;
      allocations: Array<{
        allocation_id: string;
        order_id: string;
        customer_id: string;
        deliver_city_id: string;
        full_price: number;
        allocated_space: number;
        shipment_date: string;
        status: string;
      }>;
    }>(`/allocations/schedule/${scheduleId}/allocated-orders`);
  },
};

// Reports API (Management only)
export const ReportsAPI = {
  async quarterlySales(year: number, quarter: number) {
    return httpClient.get<any>('/reports/sales/quarterly', { year, quarter });
  },

  async topItems(year: number, quarter: number, limit: number = 20) {
    return httpClient.get<any[]>('/reports/sales/top-items', { year, quarter, limit });
  },

  async salesByCity(startDate: string, endDate: string) {
    return httpClient.get<any[]>('/reports/sales/by-city', {
      start_date: startDate,
      end_date: endDate,
    });
  },

  async salesByRoute(startDate: string, endDate: string) {
    return httpClient.get<any[]>('/reports/sales/by-route', {
      start_date: startDate,
      end_date: endDate,
    });
  },

  async driverHours(startDate: string, endDate: string) {
    return httpClient.get<any[]>('/reports/work-hours/drivers', {
      start_date: startDate,
      end_date: endDate,
    });
  },

  async assistantHours(startDate: string, endDate: string) {
    return httpClient.get<any[]>('/reports/work-hours/assistants', {
      start_date: startDate,
      end_date: endDate,
    });
  },

  async truckUsage(year: number, month: number) {
    return httpClient.get<any[]>('/reports/truck-usage', { year, month });
  },

  async customerOrders(customerId: string, startDate: string, endDate: string) {
    return httpClient.get<any[]>(`/reports/customers/${customerId}/orders`, {
      start_date: startDate,
      end_date: endDate,
    });
  },
};

// Export all APIs
export default {
  Auth: AuthAPI,
  Orders: OrdersAPI,
  Users: UsersAPI,
  Customers: CustomersAPI,
  Cities: CitiesAPI,
  RailwayStations: RailwayStationsAPI,
  Stores: StoresAPI,
  Products: ProductsAPI,
  Routes: RoutesAPI,
  Trains: TrainsAPI,
  TrainSchedules: TrainSchedulesAPI,
  Trucks: TrucksAPI,
  TruckSchedules: TruckSchedulesAPI,
  Drivers: DriversAPI,
  Assistants: AssistantsAPI,
  Allocations: AllocationsAPI,
  Reports: ReportsAPI,
};
