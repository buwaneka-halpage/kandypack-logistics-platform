from app.core.database import engine

def _call_proc(proc_name, params=()):
    conn = engine.raw_connection()
    try:
        cur = conn.cursor()
        cur.callproc(proc_name, params)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description] if cur.description else []
        cur.close()
        conn.commit()
    finally:
        conn.close()
    return [dict(zip(cols, r)) for r in rows]

def quarterly_sales(year, quarter):
    return _call_proc("sp_quarterly_sales", (year, quarter))

def top_items_by_quarter(year, quarter, limit=20):
    return _call_proc("sp_top_items_by_quarter", (year, quarter, limit))

def sales_by_city(start_date, end_date):
    return _call_proc("sp_sales_by_city", (start_date, end_date))

def sales_by_route(start_date, end_date): 
    return _call_proc("sp_sales_by_route", (start_date, end_date))

def driver_work_hours(start_date, end_date):
    return _call_proc("sp_driver_work_hours", (start_date, end_date))

def assistant_work_hours(start_date, end_date):
    return _call_proc("sp_assistant_work_hours", (start_date, end_date))

def truck_usage_month(year, month):
    return _call_proc("sp_truck_usage_month", (year, month))

def customer_order_history(customer_id, start_date, end_date):
    return _call_proc("sp_customer_order_history", (customer_id, start_date, end_date))