DROP PROCEDURE IF EXISTS sp_top_items_by_quarter;
-- DELIMITER $$
CREATE PROCEDURE sp_top_items_by_quarter(
  IN in_year INT,
  IN in_quarter INT,
  IN in_limit INT
)
BEGIN
  DECLARE start_month INT;
  DECLARE end_month INT;
  SET start_month = (in_quarter - 1) * 3 + 1;
  SET end_month = start_month + 2;

  SELECT
    p.product_type_id,
    p.product_name,
    SUM(oi.quantity) AS total_quantity,
    COUNT(DISTINCT oi.order_id) AS order_count
  FROM order_items oi
  JOIN orders o ON o.order_id = oi.order_id
  JOIN products p ON p.product_type_id = oi.product_type_id
  WHERE YEAR(o.order_date) = in_year
    AND MONTH(o.order_date) BETWEEN start_month AND end_month
  GROUP BY p.product_type_id, p.product_name
  ORDER BY total_quantity DESC
  LIMIT in_limit;
END 
-- $$
-- DELIMITER ;