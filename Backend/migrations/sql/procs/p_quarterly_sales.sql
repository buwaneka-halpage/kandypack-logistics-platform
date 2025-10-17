DROP PROCEDURE IF EXISTS sp_quarterly_sales;
-- DELIMITER $$
CREATE PROCEDURE sp_quarterly_sales(
  IN in_year INT,
  IN in_quarter INT
)
BEGIN
  DECLARE start_month INT;
  DECLARE end_month INT;
  SET start_month = (in_quarter - 1) * 3 + 1;
  SET end_month = start_month + 2;

  SELECT
    COUNT(DISTINCT o.order_id)   AS total_orders,
    COALESCE(SUM(o.full_price), 0) AS total_sales_value,
    COALESCE(SUM(oi.quantity), 0)  AS total_items_sold
  FROM orders o
  LEFT JOIN order_items oi ON oi.order_id = o.order_id
  WHERE YEAR(o.order_date) = in_year
    AND MONTH(o.order_date) BETWEEN start_month AND end_month;
END 