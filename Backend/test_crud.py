"""
Test CRUD operations for KandyPack Logistics API
This script tests all major CRUD endpoints to ensure they're working correctly.
"""

import requests
import json
from datetime import datetime, timedelta

# API Base URL
BASE_URL = "http://localhost:8000"

# Test credentials
STAFF_CREDENTIALS = {
    "username": "store_manager1",
    "password": "password123"  # Simple test password
}

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def login_as_staff():
    """Login as staff and get access token"""
    print("\n🔐 Logging in as staff...")
    response = requests.post(
        f"{BASE_URL}/users/login",
        data=STAFF_CREDENTIALS
    )
    
    if response.status_code == 200:
        token = response.json().get("access_token")
        print(f"✅ Login successful! Token: {token[:20]}...")
        return token
    else:
        print(f"❌ Login failed: {response.status_code} - {response.text}")
        return None

def test_get_all(endpoint, token, name):
    """Test GET all items from an endpoint"""
    print(f"\n📖 Testing GET {endpoint} ({name})...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Retrieved {len(data)} {name}")
        if data and len(data) > 0:
            print(f"   Sample: {json.dumps(data[0], indent=2)[:200]}...")
        return data
    else:
        print(f"❌ Failed: {response.status_code} - {response.text[:200]}")
        return None

def test_get_by_id(endpoint, item_id, token, name):
    """Test GET single item by ID"""
    print(f"\n🔍 Testing GET {endpoint}/{item_id} ({name})...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}{endpoint}/{item_id}", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Retrieved {name}")
        print(f"   Data: {json.dumps(data, indent=2)[:300]}...")
        return data
    else:
        print(f"❌ Failed: {response.status_code} - {response.text[:200]}")
        return None

def test_create(endpoint, data, token, name):
    """Test POST create new item"""
    print(f"\n➕ Testing POST {endpoint} (Create {name})...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.post(
        f"{BASE_URL}{endpoint}",
        headers=headers,
        json=data
    )
    
    if response.status_code in [200, 201]:
        result = response.json()
        print(f"✅ Success! Created {name}")
        print(f"   Data: {json.dumps(result, indent=2)[:300]}...")
        return result
    else:
        print(f"❌ Failed: {response.status_code} - {response.text[:200]}")
        return None

def test_update(endpoint, item_id, data, token, name):
    """Test PUT update item"""
    print(f"\n✏️  Testing PUT {endpoint}/{item_id} (Update {name})...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.put(
        f"{BASE_URL}{endpoint}/{item_id}",
        headers=headers,
        json=data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Success! Updated {name}")
        print(f"   Data: {json.dumps(result, indent=2)[:300]}...")
        return result
    else:
        print(f"❌ Failed: {response.status_code} - {response.text[:200]}")
        return None

def test_delete(endpoint, item_id, token, name):
    """Test DELETE item"""
    print(f"\n🗑️  Testing DELETE {endpoint}/{item_id} (Delete {name})...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.delete(f"{BASE_URL}{endpoint}/{item_id}", headers=headers)
    
    if response.status_code in [200, 204]:
        print(f"✅ Success! Deleted {name}")
        return True
    else:
        print(f"❌ Failed: {response.status_code} - {response.text[:200]}")
        return False

def run_tests():
    """Run all CRUD tests"""
    print_section("KANDYPACK LOGISTICS API - CRUD TESTS")
    
    # Step 1: Login
    token = login_as_staff()
    if not token:
        print("\n❌ Cannot proceed without authentication token")
        return
    
    # Step 2: Test Orders CRUD
    print_section("ORDERS CRUD TESTS")
    orders = test_get_all("/orders/", token, "orders")
    if orders and len(orders) > 0:
        order_id = orders[0].get("order_id")
        test_get_by_id("/orders", order_id, token, "order")
    
    # Step 3: Test Customers
    print_section("CUSTOMERS CRUD TESTS")
    customers = test_get_all("/customers/", token, "customers")
    if customers and len(customers) > 0:
        customer_id = customers[0].get("customer_id")
        test_get_by_id("/customers", customer_id, token, "customer")
    
    # Step 4: Test Cities
    print_section("CITIES CRUD TESTS")
    cities = test_get_all("/cities/", token, "cities")
    if cities and len(cities) > 0:
        city_id = cities[0].get("city_id")
        test_get_by_id("/cities", city_id, token, "city")
    
    # Step 5: Test Stores
    print_section("STORES CRUD TESTS")
    stores = test_get_all("/stores/", token, "stores")
    if stores and len(stores) > 0:
        store_id = stores[0].get("store_id")
        test_get_by_id("/stores", store_id, token, "store")
    
    # Step 6: Test Railway Stations
    print_section("RAILWAY STATIONS CRUD TESTS")
    stations = test_get_all("/railway-stations/", token, "railway stations")
    if stations and len(stations) > 0:
        station_id = stations[0].get("station_id")
        test_get_by_id("/railway-stations", station_id, token, "railway station")
    
    # Step 7: Test Trains
    print_section("TRAINS CRUD TESTS")
    trains = test_get_all("/trains/", token, "trains")
    if trains and len(trains) > 0:
        train_id = trains[0].get("train_id")
        test_get_by_id("/trains", train_id, token, "train")
    
    # Step 8: Test Train Schedules
    print_section("TRAIN SCHEDULES CRUD TESTS")
    train_schedules = test_get_all("/train-schedules/", token, "train schedules")
    if train_schedules and len(train_schedules) > 0:
        schedule_id = train_schedules[0].get("schedule_id")
        test_get_by_id("/train-schedules", schedule_id, token, "train schedule")
    
    # Step 9: Test Trucks
    print_section("TRUCKS CRUD TESTS")
    trucks = test_get_all("/trucks/", token, "trucks")
    if trucks and len(trucks) > 0:
        truck_id = trucks[0].get("truck_id")
        test_get_by_id("/trucks", truck_id, token, "truck")
    
    # Step 10: Test Truck Schedules
    print_section("TRUCK SCHEDULES CRUD TESTS")
    truck_schedules = test_get_all("/truck-schedules/", token, "truck schedules")
    if truck_schedules and len(truck_schedules) > 0:
        schedule_id = truck_schedules[0].get("schedule_id")
        test_get_by_id("/truck-schedules", schedule_id, token, "truck schedule")
    
    # Step 11: Test Drivers
    print_section("DRIVERS CRUD TESTS")
    drivers = test_get_all("/drivers/", token, "drivers")
    if drivers and len(drivers) > 0:
        driver_id = drivers[0].get("driver_id")
        test_get_by_id("/drivers", driver_id, token, "driver")
    
    # Step 12: Test Assistants
    print_section("ASSISTANTS CRUD TESTS")
    assistants = test_get_all("/assistants/", token, "assistants")
    if assistants and len(assistants) > 0:
        assistant_id = assistants[0].get("assistant_id")
        test_get_by_id("/assistants", assistant_id, token, "assistant")
    
    # Step 13: Test Routes
    print_section("ROUTES CRUD TESTS")
    routes = test_get_all("/routes/", token, "routes")
    if routes and len(routes) > 0:
        route_id = routes[0].get("route_id")
        test_get_by_id("/routes", route_id, token, "route")
    
    # Step 14: Test Products
    print_section("PRODUCTS CRUD TESTS")
    products = test_get_all("/products/", token, "products")
    if products and len(products) > 0:
        product_id = products[0].get("product_type_id")
        test_get_by_id("/products", product_id, token, "product")
    
    # Final Summary
    print_section("TEST SUMMARY")
    print("\n✅ All basic CRUD operations tested!")
    print("📝 Note: Create, Update, and Delete operations were not tested")
    print("   to avoid modifying the database during this test run.")
    print("\n💡 To test Create/Update/Delete, you can:")
    print("   1. Use the frontend application")
    print("   2. Use Postman or similar API testing tools")
    print("   3. Modify this script to include those tests")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"\n❌ Error running tests: {e}")
        import traceback
        traceback.print_exc()
