-- Users
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE customers (
    customer_id CHAR(36) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    address VARCHAR(200) NOT NULL,
    CONSTRAINT Valid_phone_number CHECK (phone_number REGEXP '^\\+?[0-9-]+$')
);

-- Cities
CREATE TABLE cities (
    city_id CHAR(36) PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL UNIQUE,
    province VARCHAR(100) NOT NULL
);

-- Railway Stations
CREATE TABLE railway_stations (
    station_id CHAR(36) PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    city_id CHAR(36) NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
);

-- Stores
CREATE TABLE stores (
    store_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    telephone_number VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    station_id CHAR(36) NOT NULL,
    FOREIGN KEY (station_id) REFERENCES railway_stations(station_id),
    CONSTRAINT valid_store_phone CHECK (telephone_number REGEXP '^\\+?[0-9\\-]+$')
);

-- Orders
CREATE TABLE orders (
    order_id CHAR(36) PRIMARY KEY,
    customer_id CHAR(36),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deliver_address VARCHAR(200) NOT NULL,
    status ENUM('PLACED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLACED',
    deliver_city_id CHAR(36) NOT NULL,
    full_price FLOAT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (deliver_city_id) REFERENCES cities(city_id),
    CONSTRAINT positive_price CHECK (full_price >= 0)
);

-- Products
CREATE TABLE products (
    product_type_id CHAR(36) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    space_consumption_rate FLOAT NOT NULL,
    CONSTRAINT positive_space_rate CHECK (space_consumption_rate > 0)
);

-- Order Items
CREATE TABLE order_items (
    item_id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    store_id CHAR(36) NOT NULL,
    product_type_id CHAR(36) NOT NULL,
    quantity INT NOT NULL,
    item_price FLOAT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
    FOREIGN KEY (product_type_id) REFERENCES products(product_type_id),
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_item_price CHECK (item_price >= 0)
);

-- Routes
CREATE TABLE routes (
    route_id CHAR(36) PRIMARY KEY NOT NULL,
    store_id CHAR(36) NOT NULL,
    start_city_id CHAR(36) NOT NULL,
    end_city_id CHAR(36) NOT NULL,
    distance INT NOT NULL,
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
    FOREIGN KEY (start_city_id) REFERENCES cities(city_id),
    FOREIGN KEY (end_city_id) REFERENCES cities(city_id),
    CONSTRAINT positive_distance CHECK (distance > 0)
);

-- Route Orders
CREATE TABLE route_orders (
    route_order_id CHAR(36) PRIMARY KEY,
    route_id CHAR(36) NOT NULL,
    order_id CHAR(36) NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT unique_route_order UNIQUE (route_id, order_id)
);

-- Trains
CREATE TABLE trains (
    train_id CHAR(36) PRIMARY KEY,
    train_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    CONSTRAINT positive_train_capacity CHECK (capacity > 0)
);

-- Train Schedules
CREATE TABLE train_schedules (
    schedule_id CHAR(36) PRIMARY KEY,
    train_id CHAR(36) NOT NULL,
    station_id CHAR(36) NOT NULL,
    scheduled_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    status ENUM('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
    FOREIGN KEY (train_id) REFERENCES trains(train_id),
    FOREIGN KEY (station_id) REFERENCES railway_stations(station_id)
);

-- Rail Allocations
CREATE TABLE rail_allocations (
    allocation_id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    schedule_id CHAR(36) NOT NULL,
    shipment_date DATE NOT NULL,
    status ENUM('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (schedule_id) REFERENCES train_schedules(schedule_id)
);

-- Drivers
CREATE TABLE drivers (
    driver_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    weekly_working_hours INT NOT NULL DEFAULT 0,
    user_id CHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT driver_hours_limit CHECK (weekly_working_hours >=0 AND weekly_working_hours <=40)
);

-- Assistants
CREATE TABLE assistants (
    assistant_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    weekly_working_hours INT NOT NULL DEFAULT 0,
    user_id CHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT assistant_hours_limit CHECK (weekly_working_hours >=0 AND weekly_working_hours <=60)
);

-- Trucks
CREATE TABLE trucks (
    truck_id CHAR(36) PRIMARY KEY,
    license_num VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT positive_truck_capacity CHECK (capacity > 0)
);

-- Truck Schedules
CREATE TABLE truck_schedules (
    schedule_id CHAR(36) PRIMARY KEY,
    route_id CHAR(36) NOT NULL,
    truck_id CHAR(36) NOT NULL,
    driver_id CHAR(36) NOT NULL,
    assistant_id CHAR(36) NOT NULL,
    scheduled_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    duration INT NOT NULL,
    status ENUM('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    FOREIGN KEY (truck_id) REFERENCES trucks(truck_id),
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id),
    FOREIGN KEY (assistant_id) REFERENCES assistants(assistant_id),
    CONSTRAINT positive_duration CHECK (duration > 0)
);

-- Truck Allocations
CREATE TABLE truck_allocations (
    allocation_id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    schedule_id CHAR(36) NOT NULL,
    shipment_date DATE NOT NULL,
    status ENUM('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (schedule_id) REFERENCES truck_schedules(schedule_id)
);
