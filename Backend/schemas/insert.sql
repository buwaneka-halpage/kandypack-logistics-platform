-- Users
INSERT INTO users (user_id, user_name, password_hash, role, created_at) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'store_manager1', 'hashed_password_1', 'StoreManager', '2025-10-13 10:00:00'),
('b2c3d4e5-f6a7-8901-bcde-f2345678901', 'warehouse_staff1', 'hashed_password_2', 'WarehouseStaff', '2025-10-13 10:05:00'),
('c3d4e5f6-a7b8-9012-cdef-3456789012', 'management1', 'hashed_password_3', 'Management', '2025-10-13 10:10:00'),
('d4e5f6a7-b8c9-0123-def0-4567890123', 'driver1', 'hashed_password_4', 'Driver', '2025-10-13 10:15:00'),
('e5f6a7b8-c9d0-1234-efa1-5678901234', 'assistant1', 'hashed_password_5', 'Assistant', '2025-10-13 10:20:00');

-- Customers
INSERT INTO customers (customer_id, customer_name, phone_number, address) VALUES
('f6a7b8c9-d0e1-2345-fab2-6789012345', 'John Perera', '+94712345678', '123 Main St, Colombo'),
('a7b8c9d0-e1f2-3456-abc3-7890123456', 'Ama Silva', '+94712345679', '456 Beach Rd, Galle'),
('b8c9d0e1-f2a3-4567-bcd4-8901234567', 'Kamal Fernando', '+94712345680', '789 Hill St, Kandy');

-- Cities (25 cities in Sri Lanka)
INSERT INTO cities (city_id, city_name, province) VALUES
('c1d2e3f4-a5b6-7890-cdef-1234567890', 'Colombo', 'Western'),
('c2d3e4f5-b6c7-8901-def1-2345678901', 'Galle', 'Southern'),
('c3d4e5f6-c7d8-9012-efa2-3456789012', 'Kandy', 'Central'),
('c4d5e6f7-d8e9-0123-fab3-4567890123', 'Jaffna', 'Northern'),
('c5d6e7f8-e9f0-1234-abc4-5678901234', 'Negombo', 'Western'),
('c6d7e8f9-f0a1-2345-bcd5-6789012345', 'Trincomalee', 'Eastern'),
('c7d8e9f0-a1b2-3456-cde6-7890123456', 'Batticaloa', 'Eastern'),
('c8d9e0f1-b2c3-4567-def7-8901234567', 'Matara', 'Southern'),
('c9d0e1f2-c3d4-5678-efa8-9012345678', 'Anuradhapura', 'North Central'),
('c0d1e2f3-d4e5-6789-fab9-0123456789', 'Polonnaruwa', 'North Central'),
('c1d2e3f4-e5f6-7890-abc0-1234567890', 'Kurunegala', 'North Western'),
('c2d3e4f5-f6a7-8901-bcd1-2345678901', 'Gampaha', 'Western'),
('c3d4e5f6-a7b8-9012-cde2-3456789012', 'Ratnapura', 'Sabaragamuwa'),
('c4d5e6f7-b8c9-0123-def3-4567890123', 'Badulla', 'Uva'),
('c5d6e7f8-c9d0-1234-efa4-5678901234', 'Monaragala', 'Uva'),
('c6d7e8f9-d0e1-2345-fab5-6789012345', 'Kalutara', 'Western'),
('c7d8e9f0-e1f2-3456-abc6-7890123456', 'Puttalam', 'North Western'),
('c8d9e0f1-f2a3-4567-bcd7-8901234567', 'Hambantota', 'Southern'),
('c9d0e1f2-a3b4-5678-cde8-9012345678', 'Vavuniya', 'Northern'),
('c0d1e2f3-b4c5-6789-def9-0123456789', 'Mannar', 'Northern'),
('c1d2e3f4-c5d6-7890-efa0-1234567890', 'Dambulla', 'Central'),
('c2d3e4f5-d6e7-8901-fab1-2345678901', 'Ampara', 'Eastern'),
('c3d4e5f6-e7f8-9012-abc2-3456789012', 'Nuwara Eliya', 'Central'),
('c4d5e6f7-f8a9-0123-bcd3-4567890123', 'Kegalle', 'Sabaragamuwa'),
('c5d6e7f8-a9b0-1234-cde4-5678901234', 'Chilaw', 'North Western');

-- Railway Stations (25 stations for brevity; expand to 145 as needed)
INSERT INTO railway_stations (station_id, station_name, city_id) VALUES
('s1a2b3c4-d5e6-7890-abcd-1234567890', 'Colombo Fort', 'c1d2e3f4-a5b6-7890-cdef-1234567890'),
('s2a3b4c5-e6f7-8901-bcde-2345678901', 'Galle Station', 'c2d3e4f5-b6c7-8901-def1-2345678901'),
('s3a4b5c6-f7g8-9012-cdef-3456789012', 'Kandy Station', 'c3d4e5f6-c7d8-9012-efa2-3456789012'),
('s4a5b6c7-g8h9-0123-def0-4567890123', 'Jaffna Station', 'c4d5e6f7-d8e9-0123-fab3-4567890123'),
('s5a6b7c8-h9i0-1234-efa1-5678901234', 'Negombo Station', 'c5d6e7f8-e9f0-1234-abc4-5678901234'),
('s6a7b8c9-i0j1-2345-fab2-6789012345', 'Trincomalee Station', 'c6d7e8f9-f0a1-2345-bcd5-6789012345'),
('s7a8b9c0-j1k2-3456-abc3-7890123456', 'Batticaloa Station', 'c7d8e9f0-a1b2-3456-cde6-7890123456'),
('s8a9b0c1-k2l3-4567-bcd4-8901234567', 'Matara Station', 'c8d9e0f1-b2c3-4567-def7-8901234567'),
('s9a0b1c2-l3m4-5678-cde5-9012345678', 'Anuradhapura Station', 'c9d0e1f2-c3d4-5678-efa8-9012345678'),
('s0a1b2c3-m4n5-6789-def6-0123456789', 'Polonnaruwa Station', 'c0d1e2f3-d4e5-6789-fab9-0123456789'),
('s1a2b3c4-n5o6-7890-efa7-1234567890', 'Kurunegala Station', 'c1d2e3f4-e5f6-7890-abc0-1234567890'),
('s2a3b4c5-o6p7-8901-abc8-2345678901', 'Gampaha Station', 'c2d3e4f5-f6a7-8901-bcd1-2345678901'),
('s3a4b5c6-p7q8-9012-bcd9-3456789012', 'Ratnapura Station', 'c3d4e5f6-a7b8-9012-cde2-3456789012'),
('s4a5b6c7-q8r9-0123-cde0-4567890123', 'Badulla Station', 'c4d5e6f7-b8c9-0123-def3-4567890123'),
('s5a6b7c8-r9s0-1234-def1-5678901234', 'Monaragala Station', 'c5d6e7f8-c9d0-1234-efa4-5678901234'),
('s6a7b8c9-s0t1-2345-efa2-6789012345', 'Kalutara Station', 'c6d7e8f9-d0e1-2345-fab5-6789012345'),
('s7a8b9c0-t1u2-3456-fab3-7890123456', 'Puttalam Station', 'c7d8e9f0-e1f2-3456-abc6-7890123456'),
('s8a9b0c1-u2v3-4567-abc4-8901234567', 'Hambantota Station', 'c8d9e0f1-f2a3-4567-bcd7-8901234567'),
('s9a0b1c2-v3w4-5678-bcd5-9012345678', 'Vavuniya Station', 'c9d0e1f2-a3b4-5678-cde8-9012345678'),
('s0a1b2c3-w4x5-6789-cde6-0123456789', 'Mannar Station', 'c0d1e2f3-b4c5-6789-def9-0123456789'),
('s1a2b3c4-x5y6-7890-def7-1234567890', 'Dambulla Station', 'c1d2e3f4-c5d6-7890-efa0-1234567890'),
('s2a3b4c5-y6z7-8901-efa8-2345678901', 'Ampara Station', 'c2d3e4f5-d6e7-8901-fab1-2345678901'),
('s3a4b5c6-z7a8-9012-abc9-3456789012', 'Nuwara Eliya Station', 'c3d4e5f6-e7f8-9012-abc2-3456789012'),
('s4a5b6c7-a8b9-0123-bcd0-4567890123', 'Kegalle Station', 'c4d5e6f7-f8a9-0123-bcd3-4567890123'),
('s5a6b7c8-b9c0-1234-cde1-5678901234', 'Chilaw Station', 'c5d6e7f8-a9b0-1234-cde4-5678901234');

-- Stores (25 stores, one per city)
INSERT INTO stores (store_id, name, telephone_number, address, contact_person, station_id) VALUES
('st1a2b3c4-d5e6-7890-abcd-1234567890', 'Colombo Central Store', '+94112345670', '10 Station Rd, Colombo', 'Nimal Wijesinghe', 's1a2b3c4-d5e6-7890-abcd-1234567890'),
('st2b3c4d5-e6f7-8901-bcde-2345678901', 'Galle Store', '+94912345671', '20 Fort Rd, Galle', 'Sunil Perera', 's2a3b4c5-e6f7-8901-bcde-2345678901'),
('st3c4d5e6-f7g8-9012-cdef-3456789012', 'Kandy Store', '+94812345672', '30 Temple Rd, Kandy', 'Ruwan Jayasinghe', 's3a4b5c6-f7g8-9012-cdef-3456789012'),
('st4d5e6f7-g8h9-0123-def0-4567890123', 'Jaffna Store', '+94212345673', '40 Northern Blvd, Jaffna', 'Lanka Weerakoon', 's4a5b6c7-g8h9-0123-def0-4567890123'),
('st5e6f7g8-h9i0-1234-efa1-5678901234', 'Negombo Store', '+94312345674', '50 Coastal Rd, Negombo', 'Saman Kumara', 's5a6b7c8-h9i0-1234-efa1-5678901234'),
('st6f7g8h9-i0j1-2345-fab2-6789012345', 'Trincomalee Store', '+94262345675', '60 Harbor St, Trincomalee', 'Ama Silva', 's6a7b8c9-i0j1-2345-fab2-6789012345'),
('st7g8h9i0-j1k2-3456-abc3-7890123456', 'Batticaloa Store', '+94652345676', '70 Lagoon St, Batticaloa', 'Kamal Fernando', 's7a8b9c0-j1k2-3456-abc3-7890123456'),
('st8h9i0j1-k2l3-4567-bcd4-8901234567', 'Matara Store', '+94912345677', '80 Coastal Blvd, Matara', 'Ravi Fonseka', 's8a9b0c1-k2l3-4567-bcd4-8901234567'),
('st9i0j1k2-l3m4-5678-cde5-9012345678', 'Anuradhapura Store', '+94252345678', '90 Ancient City Ave, Anuradhapura', 'Nuwan Wijeratne', 's9a0b1c2-l3m4-5678-cde5-9012345678'),
('st0j1k2l3-m4n5-6789-def6-0123456789', 'Polonnaruwa Store', '+94272345679', '100 Ancient Rd, Polonnaruwa', 'Lakmal Perera', 's0a1b2c3-m4n5-6789-def6-0123456789'),
('st1k2l3m4-n5o6-7890-efa7-1234567890', 'Kurunegala Store', '+94372345680', '110 North Western Blvd, Kurunegala', 'Mohan Dissanayake', 's1a2b3c4-n5o6-7890-efa7-1234567890'),
('st2l3m4n5-o6p7-8901-abc8-2345678901', 'Gampaha Store', '+94332345681', '120 Junction Rd, Gampaha', 'Priya Raman', 's2a3b4c5-o6p7-8901-abc8-2345678901'),
('st3m4n5o6-p7q8-9012-bcd9-3456789012', 'Ratnapura Store', '+94452345682', '130 Gem Rd, Ratnapura', 'Thilak Senanayake', 's3a4b5c6-p7q8-9012-bcd9-3456789012'),
('st4n5o6p7-q8r9-0123-cde0-4567890123', 'Badulla Store', '+94552345683', '140 Hill Country Rd, Badulla', 'Gayan Wickramasinghe', 's4a5b6c7-q8r9-0123-cde0-4567890123'),
('st5o6p7q8-r9s0-1234-def1-5678901234', 'Monaragala Store', '+94552345684', '150 Uva Rd, Monaragala', 'Sita Rajapaksa', 's5a6b7c8-r9s0-1234-def1-5678901234'),
('st6p7q8r9-s0t1-2345-efa2-6789012345', 'Kalutara Store', '+94342345685', '160 Southern Hwy, Kalutara', 'Arun Kumaran', 's6a7b8c9-s0t1-2345-efa2-6789012345'),
('st7q8r9s0-t1u2-3456-fab3-7890123456', 'Puttalam Store', '+94322345686', '170 Lagoon Blvd, Puttalam', 'Dilshan Herath', 's7a8b9c0-t1u2-3456-fab3-7890123456'),
('st8r9s0t1-u2v3-4567-abc4-8901234567', 'Hambantota Store', '+94472345687', '180 Southern Hwy, Hambantota', 'Nisha Fernando', 's8a9b0c1-u2v3-4567-abc4-8901234567'),
('st9s0t1u2-v3w4-5678-bcd5-9012345678', 'Vavuniya Store', '+94242345688', '190 Transit Rd, Vavuniya', 'Rohan Silva', 's9a0b1c2-v3w4-5678-bcd5-9012345678'),
('st0t1u2v3-w4x5-6789-cde6-0123456789', 'Mannar Store', '+94232345689', '200 Island Rd, Mannar', 'Malini Jayawardena', 's0a1b2c3-w4x5-6789-cde6-0123456789'),
('st1u2v3w4-x5y6-7890-def7-1234567890', 'Dambulla Store', '+94662345690', '210 Cave Rd, Dambulla', 'Vijay Kumar', 's1a2b3c4-x5y6-7890-def7-1234567890'),
('st2v3w4x5-y6z7-8901-efa8-2345678901', 'Ampara Store', '+94632345691', '220 Eastern Rd, Ampara', 'Chandrika Bandara', 's2a3b4c5-y6z7-8901-efa8-2345678901'),
('st3w4x5y6-z7a8-9012-abc9-3456789012', 'Nuwara Eliya Store', '+94522345692', '230 Hill Station Rd, Nuwara Eliya', 'Suresh Pillai', 's3a4b5c6-z7a8-9012-abc9-3456789012'),
('st4x5y6z7-a8b9-0123-bcd0-4567890123', 'Kegalle Store', '+94352345693', '240 Central Rd, Kegalle', 'Geetha Alwis', 's4a5b6c7-a8b9-0123-bcd0-4567890123'),
('st5y6z7a8-b9c0-1234-cde1-5678901234', 'Chilaw Store', '+94322345694', '250 Coastal Rd, Chilaw', 'Kavindra De Silva', 's5a6b7c8-b9c0-1234-cde1-5678901234');

-- Orders (3 orders, dates 7+ days from Oct 13, 2025)
INSERT INTO orders (order_id, customer_id, order_date, deliver_address, status, deliver_city_id, full_price) VALUES
('o1b2c3d4-e5f6-7890-abcd-1234567890', 'f6a7b8c9-d0e1-2345-fab2-6789012345', '2025-10-21 08:00:00', '123 Main St, Colombo', 'PLACED', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 1500.50),
('o2b3c4d5-f6a7-8901-bcde-2345678901', 'a7b8c9d0-e1f2-3456-abc3-7890123456', '2025-10-22 09:00:00', '456 Beach Rd, Galle', 'PLACED', 'c2d3e4f5-b6c7-8901-def1-2345678901', 800.75),
('o3b4c5d6-a7b8-9012-cdef-3456789012', 'b8c9d0e1-f2a3-4567-bcd4-8901234567', '2025-10-23 10:00:00', '789 Hill St, Kandy', 'PLACED', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 2000.00);

-- Products
INSERT INTO products (product_type_id, product_name, space_consumption_rate) VALUES
('p1a2b3c4-d5e6-7890-abcd-1234567890', 'Rice', 0.5),
('p2a3b4c5-e6f7-8901-bcde-2345678901', 'Sugar', 0.3),
('p3a4b5c6-f7g8-9012-cdef-3456789012', 'Tea', 0.2);

-- Order Items
INSERT INTO order_items (item_id, order_id, store_id, product_type_id, quantity, item_price) VALUES
('i1a2b3c4-d5e6-7890-abcd-1234567890', 'o1b2c3d4-e5f6-7890-abcd-1234567890', 'st1a2b3c4-d5e6-7890-abcd-1234567890', 'p1a2b3c4-d5e6-7890-abcd-1234567890', 100, 500.00),
('i2a3b4c5-e6f7-8901-bcde-2345678901', 'o2b3c4d5-f6a7-8901-bcde-2345678901', 'st2b3c4d5-e6f7-8901-bcde-2345678901', 'p2a3b4c5-e6f7-8901-bcde-2345678901', 50, 300.00),
('i3a4b5c6-f7g8-9012-cdef-3456789012', 'o3b4c5d6-a7b8-9012-cdef-3456789012', 'st3c4d5e6-f7g8-9012-cdef-3456789012', 'p3a4b5c6-f7g8-9012-cdef-3456789012', 200, 400.00);

-- Routes
INSERT INTO routes (route_id, store_id, start_city_id, end_city_id, distance) VALUES
('r1a2b3c4-d5e6-7890-abcd-1234567890', 'st1a2b3c4-d5e6-7890-abcd-1234567890', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 'c2d3e4f5-b6c7-8901-def1-2345678901', 120),
('r2a3b4c5-e6f7-8901-bcde-2345678901', 'st2b3c4d5-e6f7-8901-bcde-2345678901', 'c2d3e4f5-b6c7-8901-def1-2345678901', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 150),
('r3a4b5c6-f7g8-9012-cdef-3456789012', 'st3c4d5e6-f7g8-9012-cdef-3456789012', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 180);

-- Route Orders
INSERT INTO route_orders (route_order_id, route_id, order_id) VALUES
('ro1a2b3c4-d5e6-7890-abcd-1234567890', 'r1a2b3c4-d5e6-7890-abcd-1234567890', 'o1b2c3d4-e5f6-7890-abcd-1234567890'),
('ro2a3b4c5-e6f7-8901-bcde-2345678901', 'r2a3b4c5-e6f7-8901-bcde-2345678901', 'o2b3c4d5-f6a7-8901-bcde-2345678901'),
('ro3a4b5c6-f7g8-9012-cdef-3456789012', 'r3a4b5c6-f7g8-9012-cdef-3456789012', 'o3b4c5d6-a7b8-9012-cdef-3456789012');

-- Trains (20 trains)
INSERT INTO trains (train_id, train_name, capacity) VALUES
('t1a2b3c4-d5e6-7890-abcd-1234567890', 'Udarata Menike', 1000),
('t2a3b4c5-e6f7-8901-bcde-2345678901', 'Podi Menike', 800),
('t3a4b5c6-f7g8-9012-cdef-3456789012', 'Yal Devi', 1200),
('t4a5b6c7-g8h9-0123-def0-4567890123', 'Rajarata Rejini', 900),
('t5a6b7c8-h9i0-1234-efa1-5678901234', 'Colombo Commuter', 600),
('t6a7b8c9-i0j1-2345-fab2-6789012345', 'Coastal Express', 700),
('t7a8b9c0-j1k2-3456-abc3-7890123456', 'Night Mail', 1100),
('t8a9b0c1-k2l3-4567-bcd4-8901234567', 'Intercity Express', 950),
('t9a0b1c2-l3m4-5678-cde5-9012345678', 'Senkadagala Menike', 850),
('t0a1b2c3-m4n5-6789-def6-0123456789', 'Galu Kumari', 750),
('t1a2b3c4-n5o6-7890-efa7-1234567890', 'Samudra Devi', 650),
('t2a3b4c5-o6p7-8901-abc8-2345678901', 'Deyata Kirula', 1000),
('t3a4b5c6-p7q8-9012-bcd9-3456789012', 'Sagarika', 800),
('t4a5b6c7-q8r9-0123-cde0-4567890123', 'Ruhunu Kumari', 900),
('t5a6b7c8-r9s0-1234-def1-5678901234', 'Muthu Kumari', 700),
('t6a7b8c9-s0t1-2345-efa2-6789012345', 'Ella Odyssey', 600),
('t7a8b9c0-t1u2-3456-fab3-7890123456', 'Viceroy Special', 1100),
('t8a9b0c1-u2v3-4567-abc4-8901234567', 'Lanka Express', 950),
('t9a0b1c2-v3w4-5678-bcd5-9012345678', 'Northern Line', 850),
('t0a1b2c3-w4x5-6789-cde6-0123456789', 'Coastal Line', 750);

-- Train Schedules (3 schedules, dates 7+ days from Oct 13, 2025)
INSERT INTO train_schedules (schedule_id, train_id, station_id, scheduled_date, departure_time, arrival_time, status) VALUES
('ts1a2b3c4-d5e6-7890-abcd-1234567890', 't1a2b3c4-d5e6-7890-abcd-1234567890', 's1a2b3c4-d5e6-7890-abcd-1234567890', '2025-10-21', '08:00:00', '12:00:00', 'PLANNED'),
('ts2a3b4c5-e6f7-8901-bcde-2345678901', 't2a3b4c5-e6f7-8901-bcde-2345678901', 's2a3b4c5-e6f7-8901-bcde-2345678901', '2025-10-22', '09:00:00', '13:00:00', 'PLANNED'),
('ts3a4b5c6-f7g8-9012-cdef-3456789012', 't3a4b5c6-f7g8-9012-cdef-3456789012', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-23', '10:00:00', '14:00:00', 'PLANNED');

-- Rail Allocations
INSERT INTO rail_allocations (allocation_id, order_id, schedule_id, shipment_date, status) VALUES
('ra1a2b3c4-d5e6-7890-abcd-1234567890', 'o1b2c3d4-e5f6-7890-abcd-1234567890', 'ts1a2b3c4-d5e6-7890-abcd-1234567890', '2025-10-21', 'PLANNED'),
('ra2a3b4c5-e6f7-8901-bcde-2345678901', 'o2b3c4d5-f6a7-8901-bcde-2345678901', 'ts2a3b4c5-e6f7-8901-bcde-2345678901', '2025-10-22', 'PLANNED'),
('ra3a4b5c6-f7g8-9012-cdef-3456789012', 'o3b4c5d6-a7b8-9012-cdef-3456789012', 'ts3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-23', 'PLANNED');

-- Drivers
INSERT INTO drivers (driver_id, name, weekly_working_hours, user_id) VALUES
('d1a2b3c4-d5e6-7890-abcd-1234567890', 'Saman Perera', 30, 'd4e5f6a7-b8c9-0123-def0-4567890123'),
('d2a3b4c5-e6f7-8901-bcde-2345678901', 'Nimal Silva', 35, 'd4e5f6a7-b8c9-0123-def0-4567890123'),
('d3a4b5c6-f7g8-9012-cdef-3456789012', 'Kamal Fernando', 25, 'd4e5f6a7-b8c9-0123-def0-4567890123');

-- Assistants
INSERT INTO assistants (assistant_id, name, weekly_working_hours, user_id) VALUES
('a1a2b3c4-d5e6-7890-abcd-1234567890', 'Ruwan Jayasinghe', 40, 'e5f6a7b8-c9d0-1234-efa1-5678901234'),
('a2a3b4c5-e6f7-8901-bcde-2345678901', 'Lanka Weerakoon', 45, 'e5f6a7b8-c9d0-1234-efa1-5678901234'),
('a3a4b5c6-f7g8-9012-cdef-3456789012', 'Ama Silva', 50, 'e5f6a7b8-c9d0-1234-efa1-5678901234');

-- Trucks
INSERT INTO trucks (truck_id, license_num, capacity, is_active) VALUES
('tr1a2b3c4-d5e6-7890-abcd-1234567890', 'WP-1234', 500, TRUE),
('tr2a3b4c5-e6f7-8901-bcde-2345678901', 'SP-5678', 600, TRUE),
('tr3a4b5c6-f7g8-9012-cdef-3456789012', 'CP-9012', 400, TRUE);

-- Truck Schedules (3 schedules, dates 7+ days from Oct 13, 2025)
INSERT INTO truck_schedules (schedule_id, route_id, truck_id, driver_id, assistant_id, scheduled_date, departure_time, duration, status) VALUES
('tsu1a2b3c4-d5e6-7890-abcd-1234567890', 'r1a2b3c4-d5e6-7890-abcd-1234567890', 'tr1a2b3c4-d5e6-7890-abcd-1234567890', 'd1a2b3c4-d5e6-7890-abcd-1234567890', 'a1a2b3c4-d5e6-7890-abcd-1234567890', '2025-10-21', '08:00:00', 240, 'PLANNED'),
('tsu2a3b4c5-e6f7-8901-bcde-2345678901', 'r2a3b4c5-e6f7-8901-bcde-2345678901', 'tr2a3b4c5-e6f7-8901-bcde-2345678901', 'd2a3b4c5-e6f7-8901-bcde-2345678901', 'a2a3b4c5-e6f7-8901-bcde-2345678901', '2025-10-22', '09:00:00', 300, 'PLANNED'),
('tsu3a4b5c6-f7g8-9012-cdef-3456789012', 'r3a4b5c6-f7g8-9012-cdef-3456789012', 'tr3a4b5c6-f7g8-9012-cdef-3456789012', 'd3a4b5c6-f7g8-9012-cdef-3456789012', 'a3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-23', '10:00:00', 360, 'PLANNED');

-- Truck Allocations
INSERT INTO truck_allocations (allocation_id, order_id, schedule_id, shipment_date, status) VALUES
('ta1a2b3c4-d5e6-7890-abcd-1234567890', 'o1b2c3d4-e5f6-7890-abcd-1234567890', 'tsu1a2b3c4-d5e6-7890-abcd-1234567890', '2025-10-21', 'PLANNED'),
('ta2a3b4c5-e6f7-8901-bcde-2345678901', 'o2b3c4d5-f6a7-8901-bcde-2345678901', 'tsu2a3b4c5-e6f7-8901-bcde-2345678901', '2025-10-22', 'PLANNED'),
('ta3a4b5c6-f7g8-9012-cdef-3456789012', 'o3b4c5d6-a7b8-9012-cdef-3456789012', 'tsu3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-23', 'PLANNED');