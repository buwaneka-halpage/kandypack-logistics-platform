-- Additional Train Schedules for RailScheduling component
-- This adds more schedules matching the new schema with source/destination stations and cargo_capacity

-- More train schedules with various routes (Colombo - Kandy routes)
INSERT INTO train_schedules (schedule_id, train_id, source_station_id, destination_station_id, scheduled_date, departure_time, arrival_time, cargo_capacity, status) VALUES
-- Ella Odyssey (Colombo Fort → Kandy) - Capacity: 350 units
('ts-ella-1', 'train-ella-odyssey', 's1a2b3c4-d5e6-7890-abcd-1234567890', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-11-03', '14:30:00', '19:45:00', 350.0, 'PLANNED'),
('ts-ella-2', 'train-ella-odyssey', 's1a2b3c4-d5e6-7890-abcd-1234567890', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-11-10', '14:30:00', '19:45:00', 350.0, 'PLANNED'),

-- Muthu Kumari (Colombo Fort → Trincomalee) - Capacity: 400 units
('ts-muthu-1', 'train-muthu-kumari', 's1a2b3c4-d5e6-7890-abcd-1234567890', 's6a7b8c9-i0j1-2345-fab2-6789012345', '2025-11-04', '07:20:00', '15:35:00', 400.0, 'PLANNED'),
('ts-muthu-2', 'train-muthu-kumari', 's1a2b3c4-d5e6-7890-abcd-1234567890', 's6a7b8c9-i0j1-2345-fab2-6789012345', '2025-11-11', '07:20:00', '15:35:00', 400.0, 'PLANNED'),

-- Yal Devi (Colombo Fort → Jaffna) - Capacity: 450 units
('ts-yaldevi-2', 'train-yal-devi', 's1a2b3c4-d5e6-7890-abcd-1234567890', 's4a5b6c7-g8h9-0123-def0-4567890123', '2025-11-05', '09:00:00', '16:30:00', 450.0, 'PLANNED'),

-- Udarata Menike (Colombo Fort → Kandy) - Capacity: 500 units
('ts-udarata-2', 'train-udarata-menike', 's1a2b3c4-d5e6-7890-abcd-1234567890', 's3a4b5c6-f7g8-9012-cdef-3456789012', '2025-11-02', '08:00:00', '12:00:00', 500.0, 'PLANNED'),

-- Rajarata Rajini (Colombo Fort → Anuradhapura) - Capacity: 420 units  
('ts-rajarata-1', 'train-rajarata-rajini', 's1a2b3c4-d5e6-7890-abcd-1234567890', 's9a0b1c2-l3m4-5678-cde5-9012345678', '2025-11-03', '10:15:00', '15:45:00', 420.0, 'PLANNED');

-- Additional Truck Schedules for LastMileDelivery component
-- Create more routes first
INSERT INTO routes (route_id, store_id, start_city_id, end_city_id, distance) VALUES
('r4a5b6c7-d5e6-7890-abcd-4567890123', 'st1a2b3c4-d5e6-7890-abcd-1234567890', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 'c5d6e7f8-e9f0-1234-abc4-5678901234', 45),  -- Colombo to Negombo
('r5a6b7c8-d5e6-7890-abcd-5678901234', 'st1a2b3c4-d5e6-7890-abcd-1234567890', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 'c2d3e4f5-f6a7-8901-bcd1-2345678901', 35),  -- Colombo to Gampaha
('r6a7b8c9-d5e6-7890-abcd-6789012345', 'st1a2b3c4-d5e6-7890-abcd-1234567890', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 'c6d7e8f9-d0e1-2345-fab5-6789012345', 42),  -- Colombo to Kalutara
('r7a8b9c0-d5e6-7890-abcd-7890123456', 'st3c4d5e6-f7g8-9012-cdef-3456789012', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 'c3d4e5f6-e7f8-9012-abc2-3456789012', 78),  -- Kandy to Nuwara Eliya
('r8a9b0c1-d5e6-7890-abcd-8901234567', 'st3c4d5e6-f7g8-9012-cdef-3456789012', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 'c8d9e0f1-b2c3-4567-def7-8901234567', 140), -- Kandy to Matara
('r9a0b1c2-d5e6-7890-abcd-9012345678', 'st2b3c4d5-e6f7-8901-bcde-2345678901', 'c2d3e4f5-b6c7-8901-def1-2345678901', 'c8d9e0f1-b2c3-4567-def7-8901234567', 45);  -- Galle to Matara

-- Additional truck schedules
INSERT INTO truck_schedules (schedule_id, route_id, truck_id, driver_id, assistant_id, scheduled_date, departure_time, duration, status) VALUES
('tsu4a5b6c7-d5e6-7890-abcd-4567890123', 'r4a5b6c7-d5e6-7890-abcd-4567890123', 'tr1a2b3c4-d5e6-7890-abcd-1234567890', 'd1a2b3c4-d5e6-7890-abcd-1234567890', 'a1a2b3c4-d5e6-7890-abcd-1234567890', '2025-10-24', '08:00:00', 110, 'PLANNED'),
('tsu5a6b7c8-d5e6-7890-abcd-5678901234', 'r5a6b7c8-d5e6-7890-abcd-5678901234', 'tr2a3b4c5-e6f7-8901-bcde-2345678901', 'd2a3b4c5-e6f7-8901-bcde-2345678901', 'a2a3b4c5-e6f7-8901-bcde-2345678901', '2025-10-24', '09:00:00', 90, 'PLANNED'),
('tsu6a7b8c9-d5e6-7890-abcd-6789012345', 'r6a7b8c9-d5e6-7890-abcd-6789012345', 'tr3a4b5c6-f7g8-9012-cdef-3456789012', 'd3a4b5c6-f7g8-9012-cdef-3456789012', 'a3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-24', '10:00:00', 105, 'PLANNED'),
('tsu7a8b9c0-d5e6-7890-abcd-7890123456', 'r7a8b9c0-d5e6-7890-abcd-7890123456', 'tr1a2b3c4-d5e6-7890-abcd-1234567890', 'd1a2b3c4-d5e6-7890-abcd-1234567890', 'a1a2b3c4-d5e6-7890-abcd-1234567890', '2025-10-25', '07:30:00', 150, 'PLANNED'),
('tsu8a9b0c1-d5e6-7890-abcd-8901234567', 'r8a9b0c1-d5e6-7890-abcd-8901234567', 'tr2a3b4c5-e6f7-8901-bcde-2345678901', 'd2a3b4c5-e6f7-8901-bcde-2345678901', 'a2a3b4c5-e6f7-8901-bcde-2345678901', '2025-10-25', '06:00:00', 280, 'PLANNED'),
('tsu9a0b1c2-d5e6-7890-abcd-9012345678', 'r9a0b1c2-d5e6-7890-abcd-9012345678', 'tr3a4b5c6-f7g8-9012-cdef-3456789012', 'd3a4b5c6-f7g8-9012-cdef-3456789012', 'a3a4b5c6-f7g8-9012-cdef-3456789012', '2025-10-25', '11:00:00', 95, 'PLANNED');
