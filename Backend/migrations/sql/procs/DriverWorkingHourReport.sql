DROP PROCEDURE IF EXISTS sp_driver_work_hours;
-- DELIMITER $$
CREATE PROCEDURE sp_driver_work_hours(
  IN in_start_date DATE,
  IN in_end_date DATE
)
BEGIN
  SELECT
    d.driver_id,
    d.name,
    COALESCE(SUM(ts.duration),0) AS total_duration,
    COUNT(ts.schedule_id) AS schedule_count
  FROM truck_schedules ts
  JOIN drivers d ON d.driver_id = ts.driver_id
  WHERE ts.scheduled_date BETWEEN in_start_date AND in_end_date
  GROUP BY d.driver_id, d.name
  ORDER BY total_duration DESC;
END 
-- $$
-- DELIMITER ;