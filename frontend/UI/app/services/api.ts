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
};

// Orders API
export const OrdersAPI = {
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
    return httpClient.get<any[]>('/railway-stations');
  },

  async getById(stationId: string) {
    return httpClient.get<any>(`/railway-stations/${stationId}`);
  },

  async create(stationData: any) {
    return httpClient.post<any>('/railway-stations', stationData);
  },

  async update(stationId: string, updateData: any) {
    return httpClient.put<any>(`/railway-stations/${stationId}`, updateData);
  },

  async delete(stationId: string) {
    return httpClient.delete<any>(`/railway-stations/${stationId}`);
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
    return httpClient.get<any[]>('/train-schedules');
  },

  async getById(scheduleId: string) {
    return httpClient.get<any>(`/train-schedules/${scheduleId}`);
  },

  async create(scheduleData: any) {
    return httpClient.post<any>('/train-schedules', scheduleData);
  },

  async update(scheduleId: string, updateData: any) {
    return httpClient.put<any>(`/train-schedules/${scheduleId}`, updateData);
  },

  async delete(scheduleId: string) {
    return httpClient.delete<any>(`/train-schedules/${scheduleId}`);
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
    return httpClient.get<any[]>('/truck-schedules');
  },

  async getById(scheduleId: string) {
    return httpClient.get<any>(`/truck-schedules/${scheduleId}`);
  },

  async create(scheduleData: any) {
    return httpClient.post<any>('/truck-schedules', scheduleData);
  },

  async update(scheduleId: string, updateData: any) {
    return httpClient.put<any>(`/truck-schedules/${scheduleId}`, updateData);
  },

  async delete(scheduleId: string) {
    return httpClient.delete<any>(`/truck-schedules/${scheduleId}`);
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
  // Rail allocations
  rail: {
    async getAll() {
      return httpClient.get<any[]>('/allocations/rail');
    },

    async getById(allocationId: string) {
      return httpClient.get<any>(`/allocations/rail/${allocationId}`);
    },

    async create(allocationData: any) {
      return httpClient.post<any>('/allocations/rail', allocationData);
    },

    async update(allocationId: string, updateData: any) {
      return httpClient.put<any>(`/allocations/rail/${allocationId}`, updateData);
    },

    async delete(allocationId: string) {
      return httpClient.delete<any>(`/allocations/rail/${allocationId}`);
    },
  },

  // Truck allocations
  truck: {
    async getAll() {
      return httpClient.get<any[]>('/allocations/truck');
    },

    async getById(allocationId: string) {
      return httpClient.get<any>(`/allocations/truck/${allocationId}`);
    },

    async create(allocationData: any) {
      return httpClient.post<any>('/allocations/truck', allocationData);
    },

    async update(allocationId: string, updateData: any) {
      return httpClient.put<any>(`/allocations/truck/${allocationId}`, updateData);
    },

    async delete(allocationId: string) {
      return httpClient.delete<any>(`/allocations/truck/${allocationId}`);
    },
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
