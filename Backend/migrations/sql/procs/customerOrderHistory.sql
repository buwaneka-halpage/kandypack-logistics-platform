DROP PROCEDURE IF EXISTS sp_customer_order_history;
-- DELIMITER $$
CREATE PROCEDURE sp_customer_order_history(
  IN in_customer_id VARCHAR(36),
  IN in_start_date DATE,
  IN in_end_date DATE
)
BEGIN
  SELECT
    o.order_id,
    o.order_date,
    o.full_price,
    o.deliver_address,
    o.deliver_city_id,
    o.status,
    oi.item_id,
    oi.product_type_id,
    oi.quantity,
    oi.item_price,
    ta.schedule_id AS truck_schedule_id,
    ta.shipment_date AS truck_shipment_date,
    ra.schedule_id AS rail_schedule_id,
    ra.shipment_date AS rail_shipment_date
  FROM orders o
  LEFT JOIN order_items oi ON oi.order_id = o.order_id
  LEFT JOIN truck_allocations ta ON ta.order_id = o.order_id
  LEFT JOIN rail_allocations ra ON ra.order_id = o.order_id
  WHERE o.customer_id = in_customer_id
    AND o.order_date BETWEEN in_start_date AND in_end_date
  ORDER BY o.order_date DESC, o.order_id;
END 
-- $$
-- DELIMITER ;