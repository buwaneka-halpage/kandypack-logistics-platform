DROP PROCEDURE IF EXISTS sp_sales_by_route;
-- DELIMITER $$
CREATE PROCEDURE sp_sales_by_route(
  IN in_start_date DATE,
  IN in_end_date DATE
)
BEGIN
  SELECT
    r.route_id,
    r.store_id,
    r.start_city_id,
    r.end_city_id,
    COUNT(DISTINCT ro.order_id) AS order_count,
    COALESCE(SUM(o.full_price),0) AS sales_value
  FROM route_orders ro
  JOIN routes r ON r.route_id = ro.route_id
  JOIN orders o ON o.order_id = ro.order_id
  WHERE o.order_date BETWEEN in_start_date AND in_end_date
  GROUP BY r.route_id, r.store_id, r.start_city_id, r.end_city_id
  ORDER BY sales_value DESC;
END 
-- $$
-- DELIMITER ;