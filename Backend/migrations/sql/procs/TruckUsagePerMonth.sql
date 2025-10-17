DROP PROCEDURE IF EXISTS sp_truck_usage_month;
-- DELIMITER $$
CREATE PROCEDURE sp_truck_usage_month(
  IN in_year INT,
  IN in_month INT
)
BEGIN
  SELECT
    t.truck_id,
    t.license_num,
    COUNT(ts.schedule_id) AS trips,
    COALESCE(SUM(ts.duration),0) AS total_duration,
    COUNT(DISTINCT ts.driver_id) AS unique_drivers,
    AVG(ts.duration) AS avg_duration
  FROM truck_schedules ts
  JOIN trucks t ON t.truck_id = ts.truck_id
  WHERE YEAR(ts.scheduled_date) = in_year
    AND MONTH(ts.scheduled_date) = in_month
  GROUP BY t.truck_id, t.license_num
  ORDER BY trips DESC;
END
--  $$
-- DELIMITER ;