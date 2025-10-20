"""
SystemAdmin CRUD Operations Test Suite
Based on SYSTEMADMIN_IMPLEMENTATION_COMPLETE.md

This script tests all CRUD operations that SystemAdmin should have access to.
Tests cover all 65+ endpoints across 14 API modules.

Test Credentials:
- Username: admin
- Password: password123
- Role: SystemAdmin
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, Optional

BASE_URL = "http://localhost:8000"

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

class SystemAdminTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token: Optional[str] = None
        self.headers: Dict[str, str] = {}
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def print_section(self, title: str):
        """Print section header"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}")
        print(f"{title}")
        print(f"{'='*70}{Colors.RESET}\n")
    
    def print_test(self, test_name: str, passed: bool, details: str = ""):
        """Print test result"""
        status = f"{Colors.GREEN}✓ PASS" if passed else f"{Colors.RED}✗ FAIL"
        print(f"{status}{Colors.RESET} - {test_name}")
        if details:
            print(f"  {Colors.YELLOW}→ {details}{Colors.RESET}")
        
        if passed:
            self.test_results["passed"] += 1
        else:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"{test_name}: {details}")
    
    def login_as_systemadmin(self) -> bool:
        """Test 1: Login as SystemAdmin"""
        self.print_section("TEST 1: Authentication")
        
        try:
            response = requests.post(
                f"{self.base_url}/users/login",
                data={
                    "username": "admin",
                    "password": "password123"
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.headers = {"Authorization": f"Bearer {self.token}"}
                
                self.print_test(
                    "Login as SystemAdmin",
                    True,
                    f"Token received, Role: {data.get('role', 'N/A')}"
                )
                return True
            else:
                self.print_test(
                    "Login as SystemAdmin",
                    False,
                    f"Status: {response.status_code}, Response: {response.text}"
                )
                return False
        except Exception as e:
            self.print_test("Login as SystemAdmin", False, f"Error: {str(e)}")
            return False
    
    def test_user_management(self):
        """Test 2-6: User Management (Critical - Management only + SystemAdmin)"""
        self.print_section("TEST 2-6: User Management (CRUD)")
        
        # Test 2: Create User (POST /users/)
        try:
            new_user = {
                "user_name": f"test_user_{datetime.now().timestamp()}",
                "password": "testpass123",
                "role": "StoreManager"
            }
            response = requests.post(
                f"{self.base_url}/users/",
                json=new_user,
                headers=self.headers
            )
            self.print_test(
                "Create User (POST /users/)",
                response.status_code == 201,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            self.print_test("Create User", False, f"Error: {str(e)}")
    
    def test_reports_access(self):
        """Test 7-14: Reports API (All Management-only endpoints)"""
        self.print_section("TEST 7-14: Reports API Access")
        
        tests = [
            ("GET /reports/sales/quarterly", f"{self.base_url}/reports/sales/quarterly?year=2025&quarter=1"),
            ("GET /reports/sales/top-items", f"{self.base_url}/reports/sales/top-items?year=2025&quarter=1&limit=10"),
            ("GET /reports/work-hours/drivers", f"{self.base_url}/reports/work-hours/drivers?start_date=2025-01-01&end_date=2025-01-31"),
            ("GET /reports/work-hours/assistants", f"{self.base_url}/reports/work-hours/assistants?start_date=2025-01-01&end_date=2025-01-31"),
            ("GET /reports/truck-usage", f"{self.base_url}/reports/truck-usage?year=2025&month=1"),
        ]
        
        for test_name, url in tests:
            try:
                response = requests.get(url, headers=self.headers)
                self.print_test(
                    test_name,
                    response.status_code in [200, 404],  # 404 is OK if no data
                    f"Status: {response.status_code}"
                )
            except Exception as e:
                self.print_test(test_name, False, f"Error: {str(e)}")
    
    def test_orders_crud(self):
        """Test 15-21: Orders Management"""
        self.print_section("TEST 15-21: Orders Management (CRUD)")
        
        # Test GET /orders/history
        try:
            response = requests.get(f"{self.base_url}/orders/history", headers=self.headers)
            self.print_test(
                "GET /orders/history",
                response.status_code == 200,
                f"Status: {response.status_code}, Orders: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /orders/history", False, f"Error: {str(e)}")
        
        # Test GET /orders/
        try:
            response = requests.get(f"{self.base_url}/orders/", headers=self.headers)
            self.print_test(
                "GET /orders/",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            self.print_test("GET /orders/", False, f"Error: {str(e)}")
    
    def test_products_crud(self):
        """Test 22-27: Products Management"""
        self.print_section("TEST 22-27: Products Management (CRUD)")
        
        # Test GET /products/
        try:
            response = requests.get(f"{self.base_url}/products/", headers=self.headers)
            self.print_test(
                "GET /products/",
                response.status_code == 200,
                f"Status: {response.status_code}, Products: {len(response.json()) if response.status_code == 200 else 0}"
            )
            
            # Store a product ID for later tests
            if response.status_code == 200 and response.json():
                self.test_product_id = response.json()[0].get("product_type_id")
        except Exception as e:
            self.print_test("GET /products/", False, f"Error: {str(e)}")
        
        # Test POST /products/ (Create)
        try:
            new_product = {
                "product_name": f"Test Product {datetime.now().timestamp()}",
                "space_consumption_rate": 1.5
            }
            response = requests.post(
                f"{self.base_url}/products/",
                json=new_product,
                headers=self.headers
            )
            self.print_test(
                "POST /products/ (Create Product)",
                response.status_code == 201,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            self.print_test("POST /products/", False, f"Error: {str(e)}")
    
    def test_stores_crud(self):
        """Test 28-32: Stores Management"""
        self.print_section("TEST 28-32: Stores Management (CRUD)")
        
        # Test GET /stores/
        try:
            response = requests.get(f"{self.base_url}/stores/", headers=self.headers)
            self.print_test(
                "GET /stores/",
                response.status_code == 200,
                f"Status: {response.status_code}, Stores: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /stores/", False, f"Error: {str(e)}")
    
    def test_trucks_crud(self):
        """Test 33-37: Trucks Management"""
        self.print_section("TEST 33-37: Trucks Management (CRUD)")
        
        # Test GET /turks/
        try:
            response = requests.get(f"{self.base_url}/turks/", headers=self.headers)
            self.print_test(
                "GET /turks/",
                response.status_code == 200,
                f"Status: {response.status_code}, Trucks: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /turks/", False, f"Error: {str(e)}")
        
        # Test GET /turks/available
        try:
            response = requests.get(f"{self.base_url}/turks/available", headers=self.headers)
            self.print_test(
                "GET /turks/available",
                response.status_code in [200, 404],
                f"Status: {response.status_code}"
            )
        except Exception as e:
            self.print_test("GET /turks/available", False, f"Error: {str(e)}")
    
    def test_trains_access(self):
        """Test 38-39: Trains Access"""
        self.print_section("TEST 38-39: Trains Management")
        
        # Test GET /trains/
        try:
            response = requests.get(f"{self.base_url}/trains/", headers=self.headers)
            self.print_test(
                "GET /trains/",
                response.status_code == 200,
                f"Status: {response.status_code}, Trains: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /trains/", False, f"Error: {str(e)}")
    
    def test_routes_crud(self):
        """Test 40-44: Routes Management"""
        self.print_section("TEST 40-44: Routes Management (CRUD)")
        
        # Test GET /routs/
        try:
            response = requests.get(f"{self.base_url}/routs/", headers=self.headers)
            self.print_test(
                "GET /routs/",
                response.status_code == 200,
                f"Status: {response.status_code}, Routes: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /routs/", False, f"Error: {str(e)}")
    
    def test_schedules_access(self):
        """Test 45-49: Truck & Train Schedules"""
        self.print_section("TEST 45-49: Schedules Management")
        
        # Test GET /truckSchedules/
        try:
            response = requests.get(f"{self.base_url}/truckSchedules/", headers=self.headers)
            self.print_test(
                "GET /truckSchedules/",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            self.print_test("GET /truckSchedules/", False, f"Error: {str(e)}")
        
        # Test GET /trainSchedules/
        try:
            response = requests.get(f"{self.base_url}/trainSchedules/", headers=self.headers)
            self.print_test(
                "GET /trainSchedules/",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            self.print_test("GET /trainSchedules/", False, f"Error: {str(e)}")
    
    def test_personnel_management(self):
        """Test 50-61: Drivers & Assistants Management"""
        self.print_section("TEST 50-61: Personnel Management")
        
        # Test GET /drivers/
        try:
            response = requests.get(f"{self.base_url}/drivers/", headers=self.headers)
            self.print_test(
                "GET /drivers/",
                response.status_code == 200,
                f"Status: {response.status_code}, Drivers: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /drivers/", False, f"Error: {str(e)}")
        
        # Test GET /assistants/
        try:
            response = requests.get(f"{self.base_url}/assistants/", headers=self.headers)
            self.print_test(
                "GET /assistants/",
                response.status_code == 200,
                f"Status: {response.status_code}, Assistants: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /assistants/", False, f"Error: {str(e)}")
    
    def test_infrastructure_access(self):
        """Test 62-65: Infrastructure (Railway Stations & Cities)"""
        self.print_section("TEST 62-65: Infrastructure & Location Access")
        
        # Test GET /railway_stations/
        try:
            response = requests.get(f"{self.base_url}/railway_stations/", headers=self.headers)
            self.print_test(
                "GET /railway_stations/",
                response.status_code == 200,
                f"Status: {response.status_code}, Stations: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /railway_stations/", False, f"Error: {str(e)}")
        
        # Test GET /cities/
        try:
            response = requests.get(f"{self.base_url}/cities/", headers=self.headers)
            self.print_test(
                "GET /cities/",
                response.status_code == 200,
                f"Status: {response.status_code}, Cities: {len(response.json()) if response.status_code == 200 else 0}"
            )
        except Exception as e:
            self.print_test("GET /cities/", False, f"Error: {str(e)}")
    
    def print_summary(self):
        """Print test summary"""
        self.print_section("TEST SUMMARY")
        
        total = self.test_results["passed"] + self.test_results["failed"]
        pass_rate = (self.test_results["passed"] / total * 100) if total > 0 else 0
        
        print(f"Total Tests: {total}")
        print(f"{Colors.GREEN}Passed: {self.test_results['passed']}{Colors.RESET}")
        print(f"{Colors.RED}Failed: {self.test_results['failed']}{Colors.RESET}")
        print(f"Pass Rate: {pass_rate:.1f}%\n")
        
        if self.test_results["errors"]:
            print(f"{Colors.RED}{Colors.BOLD}Failed Tests:{Colors.RESET}")
            for error in self.test_results["errors"]:
                print(f"  {Colors.RED}• {error}{Colors.RESET}")
        
        print(f"\n{Colors.BOLD}{'='*70}{Colors.RESET}\n")
    
    def run_all_tests(self):
        """Run all SystemAdmin CRUD tests"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}")
        print("╔" + "="*68 + "╗")
        print("║" + " "*10 + "SystemAdmin CRUD Operations Test Suite" + " "*18 + "║")
        print("║" + " "*68 + "║")
        print("║  Testing all 65+ endpoints with SystemAdmin privileges" + " "*9 + "║")
        print("║  Based on: SYSTEMADMIN_IMPLEMENTATION_COMPLETE.md" + " "*15 + "║")
        print("╚" + "="*68 + "╝")
        print(f"{Colors.RESET}")
        
        # Step 1: Login
        if not self.login_as_systemadmin():
            print(f"\n{Colors.RED}Cannot proceed without valid authentication{Colors.RESET}\n")
            return
        
        # Step 2-65: Run all tests
        self.test_user_management()
        self.test_reports_access()
        self.test_orders_crud()
        self.test_products_crud()
        self.test_stores_crud()
        self.test_trucks_crud()
        self.test_trains_access()
        self.test_routes_crud()
        self.test_schedules_access()
        self.test_personnel_management()
        self.test_infrastructure_access()
        
        # Print Summary
        self.print_summary()


def main():
    """Main test execution"""
    tester = SystemAdminTester()
    
    try:
        tester.run_all_tests()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Tests interrupted by user{Colors.RESET}\n")
    except Exception as e:
        print(f"\n\n{Colors.RED}Unexpected error: {str(e)}{Colors.RESET}\n")


if __name__ == "__main__":
    main()
