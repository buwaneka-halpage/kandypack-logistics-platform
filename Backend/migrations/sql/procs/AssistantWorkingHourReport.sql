DROP PROCEDURE IF EXISTS sp_assistant_work_hours;
-- DELIMITER $$
CREATE PROCEDURE sp_assistant_work_hours(
  IN in_start_date DATE,
  IN in_end_date DATE
)
BEGIN
  SELECT
    a.assistant_id,
    a.name,
    COALESCE(SUM(ts.duration),0) AS total_duration,
    COUNT(ts.schedule_id) AS schedule_count
  FROM truck_schedules ts
  JOIN assistants a ON a.assistant_id = ts.assistant_id
  WHERE ts.scheduled_date BETWEEN in_start_date AND in_end_date
  GROUP BY a.assistant_id, a.name
  ORDER BY total_duration DESC;
END 
-- $$
-- DELIMITER ;