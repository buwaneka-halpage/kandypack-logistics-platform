DROP PROCEDURE IF EXISTS sp_sales_by_city;
-- DELIMITER $$
CREATE PROCEDURE sp_sales_by_city(
  IN in_start_date DATE,
  IN in_end_date DATE
)
BEGIN
  SELECT
    c.city_id,
    c.city_name,
    COUNT(DISTINCT o.order_id) AS order_count,
    COALESCE(SUM(o.full_price),0) AS sales_value
  FROM orders o
  JOIN cities c ON c.city_id = o.deliver_city_id
  WHERE o.order_date BETWEEN in_start_date AND in_end_date
  GROUP BY c.city_id, c.city_name
  ORDER BY sales_value DESC;
END 
-- $$
-- DELIMITER ;