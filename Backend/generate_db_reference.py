"""
Script to generate a markdown file with all database tables and their data
"""
import sys
from app.core.database import Session_local
from app.core.model import *
from sqlalchemy import inspect
from datetime import datetime

def table_to_markdown(table_name, columns, rows):
    """Convert table data to markdown format"""
    md = f"\n## {table_name}\n\n"
    
    if not rows:
        md += "*No data available*\n"
        return md
    
    # Create header
    md += "| " + " | ".join(columns) + " |\n"
    md += "| " + " | ".join(["---"] * len(columns)) + " |\n"
    
    # Add rows
    for row in rows:
        values = []
        for col in columns:
            val = getattr(row, col, "")
            if val is None:
                val = "NULL"
            elif isinstance(val, datetime):
                val = val.strftime("%Y-%m-%d %H:%M:%S")
            else:
                val = str(val)
            # Escape pipe characters
            val = val.replace("|", "\\|")
            values.append(val)
        md += "| " + " | ".join(values) + " |\n"
    
    md += f"\n**Total Records:** {len(rows)}\n"
    return md

def main():
    db = Session_local()
    
    try:
        md_content = "# KandyPack Logistics Platform - Database Reference\n\n"
        md_content += f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        md_content += "This document contains all tables and their current data from the database.\n\n"
        md_content += "---\n\n"
        md_content += "# Table of Contents\n\n"
        
        tables_to_export = [
            ("Cities", Cities),
            ("Customers", Customers),
            ("Products", Products),
            ("Stores", Stores),
            ("Trains", Trains),
            ("Railway Stations", RailwayStations),
            ("Train Schedules", TrainSchedules),
            ("Trucks", Trucks),
            ("Routes", Routes),
            ("Route Orders", RouteOrders),
            ("Users", Users),
            ("Drivers", Drivers),
            ("Assistants", Assistants),
            ("Orders", Orders),
            ("Order Items", OrderItems),
            ("Rail Allocations", RailAllocations),
            ("Truck Allocations", TruckAllocations),
            ("Truck Schedules", TruckSchedules),
        ]
        
        # Generate table of contents
        for table_name, _ in tables_to_export:
            md_content += f"- [{table_name}](#{table_name.lower().replace(' ', '-')})\n"
        
        md_content += "\n---\n"
        
        # Generate table data
        for table_name, model in tables_to_export:
            print(f"Exporting {table_name}...")
            
            # Get column names
            mapper = inspect(model)
            columns = [col.key for col in mapper.columns]
            
            # Query all rows
            rows = db.query(model).all()
            
            # Convert to markdown
            md_content += table_to_markdown(table_name, columns, rows)
        
        # Write to file
        output_file = "DATABASE_REFERENCE.md"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(md_content)
        
        print(f"\n✅ Database reference generated successfully: {output_file}")
        print(f"Total tables exported: {len(tables_to_export)}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
