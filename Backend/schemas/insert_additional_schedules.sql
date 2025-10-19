-- Additional Train Schedules for RailScheduling component
-- This adds more schedules matching the dummy data pattern

-- More train schedules with various routes
INSERT INTO train_schedules (schedule_id, train_id, station_id, scheduled_date, departure_time, arrival_time, status) VALUES
-- Kandy - Colombo schedules
('ts4a5b6c7-d5e6-7890-abcd-4567890123', 't4a5b6c7-g8h9-0123-def0-4567890123', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-24', '08:15:00', '13:15:00', 'PLANNED'),
('ts5a6b7c8-d5e6-7890-abcd-5678901234', 't5a6b7c8-h9i0-1234-efa1-5678901234', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-25', '08:15:00', '13:15:00', 'PLANNED'),
('ts6a7b8c9-d5e6-7890-abcd-6789012345', 't6a7b8c9-i0j1-2345-fab2-6789012345', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-26', '08:15:00', '13:15:00', 'PLANNED'),
('ts7a8b9c0-d5e6-7890-abcd-7890123456', 't7a8b9c0-j1k2-3456-abc3-7890123456', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-27', '08:15:00', '13:15:00', 'PLANNED'),
('ts8a9b0c1-d5e6-7890-abcd-8901234567', 't8a9b0c1-k2l3-4567-bcd4-8901234567', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-28', '08:15:00', '13:15:00', 'PLANNED'),
('ts9a0b1c2-d5e6-7890-abcd-9012345678', 't9a0b1c2-l3m4-5678-cde5-9012345678', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-29', '08:15:00', '13:15:00', 'PLANNED'),
('ts10b1c2d3-d5e6-7890-abcd-0123456789', 't0a1b2c3-m4n5-6789-def6-0123456789', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-30', '08:15:00', '13:15:00', 'PLANNED'),

-- Kandy - Galle schedule
('ts11b2c3d4-e6f7-8901-bcde-1234567890', 't1a2b3c4-n5o6-7890-efa7-1234567890', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-24', '06:30:00', '14:40:00', 'PLANNED'),

-- Kandy - Matara schedule
('ts12b3c4d5-f7g8-9012-cdef-2345678901', 't2a3b4c5-o6p7-8901-abc8-2345678901', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-24', '08:15:00', '15:30:00', 'PLANNED'),

-- Kandy - Jaffna schedule
('ts13b4c5d6-g8h9-0123-def0-3456789012', 't3a4b5c6-p7q8-9012-bcd9-3456789012', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-24', '08:15:00', '13:15:00', 'PLANNED');

-- Additional Truck Schedules for LastMileDelivery component
-- Create more routes first
INSERT INTO routes (route_id, store_id, start_city_id, end_city_id, distance) VALUES
('r4a5b6c7-d5e6-7890-abcd-4567890123', 'st1a2b3c4-d5e6-7890-abcd-1234567890', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 'c5d6e7f8-e9f0-1234-abc4-5678901234', 45),  -- Colombo to Negombo
('r5a6b7c8-d5e6-7890-abcd-5678901234', 'st1a2b3c4-d5e6-7890-abcd-1234567890', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 'c2d3e4f5-f6a7-8901-bcd1-2345678901', 35),  -- Colombo to Gampaha
('r6a7b8c9-d5e6-7890-abcd-6789012345', 'st1a2b3c4-d5e6-7890-abcd-1234567890', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 'c6d7e8f9-d0e1-2345-fab5-6789012345', 42),  -- Colombo to Kalutara
('r7a8b9c0-d5e6-7890-abcd-7890123456', 'st3c4d5e6-f7g8-9012-cdef-3456789012', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 'c3d4e5f6-e7f8-9012-abc2-3456789012', 78),  -- Kandy to Nuwara Eliya
('r8a9b0c1-d5e6-7890-abcd-8901234567', 'st3c4d5e6-f7g8-9012-cdef-3456789012', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 'c8d9e0f1-b2c3-4567-def7-8901234567', 140), -- Kandy to Matara
('r9a0b1c2-d5e6-7890-abcd-9012345678', 'st2b3c4d5-e6f7-8901-bcde-2345678901', 'c2d3e4f5-b6c7-8901-def1-2345678901', 'c8d9e0f1-b2c3-4567-def7-8901234567', 45);  -- Galle to Matara

-- Additional truck schedules matching dummy data pattern
INSERT INTO truck_schedules (schedule_id, route_id, truck_id, driver_id, assistant_id, scheduled_date, departure_time, duration, status) VALUES
('tsu4a5b6c7-d5e6-7890-abcd-4567890123', 'r4a5b6c7-d5e6-7890-abcd-4567890123', 'tr1a2b3c4-d5e6-7890-abcd-1234567890', 'd1a2b3c4-d5e6-7890-abcd-1234567890', 'a1a2b3c4-d5e6-7890-abcd-1234567890', '2025-10-24', '08:00:00', 110, 'PLANNED'),
('tsu5a6b7c8-d5e6-7890-abcd-5678901234', 'r5a6b7c8-d5e6-7890-abcd-5678901234', 'tr2a3b4c5-e6f7-8901-bcde-2345678901', 'd2a3b4c5-e6f7-8901-bcde-2345678901', 'a2a3b4c5-e6f7-8901-bcde-2345678901', '2025-10-24', '09:00:00', 90, 'PLANNED'),
('tsu6a7b8c9-d5e6-7890-abcd-6789012345', 'r6a7b8c9-d5e6-7890-abcd-6789012345', 'tr3a4b5c6-f7g8-9012-cdef-3456789012', 'd3a4b5c6-f7g8-9012-cdef-3456789012', 'a3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-24', '10:00:00', 105, 'PLANNED'),
('tsu7a8b9c0-d5e6-7890-abcd-7890123456', 'r7a8b9c0-d5e6-7890-abcd-7890123456', 'tr1a2b3c4-d5e6-7890-abcd-1234567890', 'd1a2b3c4-d5e6-7890-abcd-1234567890', 'a1a2b3c4-d5e6-7890-abcd-1234567890', '2025-10-25', '07:30:00', 150, 'PLANNED'),
('tsu8a9b0c1-d5e6-7890-abcd-8901234567', 'r8a9b0c1-d5e6-7890-abcd-8901234567', 'tr2a3b4c5-e6f7-8901-bcde-2345678901', 'd2a3b4c5-e6f7-8901-bcde-2345678901', 'a2a3b4c5-e6f7-8901-bcde-2345678901', '2025-10-25', '06:00:00', 280, 'PLANNED'),
('tsu9a0b1c2-d5e6-7890-abcd-9012345678', 'r9a0b1c2-d5e6-7890-abcd-9012345678', 'tr3a4b5c6-f7g8-9012-cdef-3456789012', 'd3a4b5c6-f7g8-9012-cdef-3456789012', 'a3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-25', '11:00:00', 95, 'PLANNED');

-- Additional Orders with varied statuses (matching backend ENUM values)
INSERT INTO orders (order_id, customer_id, order_date, deliver_address, status, deliver_city_id, full_price) VALUES
('o4b5c6d7-e5f6-7890-abcd-4567890123', 'f6a7b8c9-d0e1-2345-fab2-6789012345', '2025-10-24 08:00:00', '45 Lake Rd, Negombo', 'PLACED', 'c5d6e7f8-e9f0-1234-abc4-5678901234', 3500.00),
('o5b6c7d8-e5f6-7890-abcd-5678901234', 'a7b8c9d0-e1f2-3456-abc3-7890123456', '2025-10-25 09:00:00', '67 Station Rd, Gampaha', 'IN_WAREHOUSE', 'c2d3e4f5-f6a7-8901-bcd1-2345678901', 2750.50),
('o6b7c8d9-e5f6-7890-abcd-6789012345', 'b8c9d0e1-f2a3-4567-bcd4-8901234567', '2025-10-26 10:00:00', '89 Temple Rd, Kalutara', 'SCHEDULED_ROAD', 'c6d7e8f9-d0e1-2345-fab5-6789012345', 4200.25),
('o7b8c9d0-e5f6-7890-abcd-7890123456', 'f6a7b8c9-d0e1-2345-fab2-6789012345', '2025-10-20 08:00:00', '12 Market St, Colombo', 'DELIVERED', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 1850.00),
('o8b9c0d1-e5f6-7890-abcd-8901234567', 'a7b8c9d0-e1f2-3456-abc3-7890123456', '2025-10-19 09:00:00', '34 Beach Rd, Galle', 'DELIVERED', 'c2d3e4f5-b6c7-8901-def1-2345678901', 2100.75);
