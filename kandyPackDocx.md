# Software Requirements

# Specification

## for

# KandyPack

### Version 1.

### August 07, 2025

### Prepared by:

### Group No: 18

### MUDALIARACHCHI N.S : 230415H

### SENPURA H.H.Y.B : 230602E

### Kamsan S: 230313T

### Dinapura H.H.S : 230151T

### Wettasinghe V. N : 230701G


## Table of Contents

**Table of Contents ii**

- 1. Introduction List of Figures ii
   - 1.1 Purpose
   - 1.2 Document Conventions
   - 1.3 Intended Audience
   - 1.4 Product Scope
   - 1.5 References
   - 1.6 Glossary
- 2. Overall Description
   - 2.1 Product Perspective
   - 2.2 System Environment
   - 2.3 Function Requirement Specification
   - 2 .3.1 Customer Use Case
   - Use case: Place Order
   - Use case: Cancel Order
   - Use case: Check status of the Last-Mile Road Update
   - Use case: Update Order
   - Use case: Change the delivery location/ Address
   - Use case: Review service
   - 2.3.2 Store Manager Use Case
   - Use case: Schedule Rail Cargo Trip
   - Use case: Schedule Last-Mile Road Delivery update
   - Use case: View Customer Order History
   - 2.3.3 Warehouse Staff Use Case
   - Use case: Manage Warehouse Inventory
   - 2.3.4 Management use case
   - Use case: Generate Sales and Utilization Reports
   - 2.3.5 Driver use case:
   - Use case: Deliver package
   - 2.3.6 Driver Assistant Use case:
   - Use case: Assign Drivers
   - Use case: Check the routes
   - Use case: Schedule Trucks
- 2.4 User Characteristics
   - 2.5 Non-Functional Requirements
- 3. Requirements Specifications
   - 3.1 External Interface Requirements
   - 3.2 Functional Requirements
   - 3.3 Detailed Non-Functional Requirements
   - 3 .3.1 Logical Structure of the Data
   - 3.3.2 Security


## 1. Introduction List of Figures ii

Figure 1 - System Environment
Figure 2 - Customer User Case Diagram
Figure 3 - Place Order User Case Diagram
Figure 4 - Cancel order User Case
Figure 5 - Check status of the last-Mile Road update User Case
Figure 6 - Update order user case
Figure 7 - Change the deliver Location/ Address
Figure 8 - Review Sections
Figure 9 - Store Manager User Case
Figure 10 - Schedule Rail Cargo Trip User Case
Figure 11 - Schedule Last-Mile Road Delivery update User Case
Figure 12 - View customer order History User Case
Figure 13 - WareHouse staff has following User Case
Figure 14 - Generate Sales and Utilization Reports has following User Case
Figure 15 - Deliver packages User Case
Figure 16 - Driver Assistant User Case
Figure 17 - Assign Drivers User Case
Figure 18 - Check Routes User Case
Figure 19 - Schedule Trucks User Case
Figure 20 - ERD Diagram


## 1. Introduction

### 1.1 Purpose

“Kandypack” is a modern logistics distribution platform which implements a robust, scalable and
efficient supply chain management that integrates both rail and road transportation elements. This
modernized solution aims to enhance Kandypack’s distribution operations by automating
shipment scheduling to reduce manual errors and inefficiencies, ensuring reliable order fulfilment
within transport and storage constraints. It will optimize resource utilization across cargo space,
fleets and personnel while adhering to regulatory limits. Additionally, it supports data-driven
decision making through timely reporting and provides a scalable foundation to accommodate
future growth in order volume and complexity.

### 1.2 Document Conventions

The Software Requirement Specification (SRS) document follows formatting conventions to
ensure clarity and professionalism, using Times font with bold headings and consistent
hierarchical numbering for sections. Emphasis is applied through bold for key terms and italics
for references. Standardized terminologies are defined in the dedicated glossary. Each
requirement is uniquely numbered and traceable. Visual aids like UML diagrams and tables are
captioned for clarity. References to external documents are clearly cited to support validation and
traceability.

### 1.3 Intended Audience

The Kandypack Supply Chain Distribution System is intended for internal users, including Store
Managers, Warehouse Staff, Management, Drivers, Driver Assistants, and System
Administrators. Each role interacts with the system based on its responsibilities, such as
scheduling, inventory updates, delivery tracking, and reporting. The system also indirectly
benefits customers through improved delivery accuracy and efficiency. It supports users with
different technical skills through intuitive interfaces and role-based access, and is scalable for
future expansions like customer portals.

### 1.4 Product Scope

The Kandypack Supply Chain Distribution System is designed for a diverse audience, including
management for decision making, developers for system design and implementation, warehouse
and logistics staff for operational support, IT support for maintenance and scalability and
stakeholders for evaluating system effectiveness.


### 1.5 References

```
SRS introduction in GeekForGeeks
Supply chain management and How It works
SRS template by IEEE format
Functional and Non Functional Requirements
Introduction to ERD Diagrams
IEEE. IEEE Std 830-1998 IEEE Recommended Practice for Software Requirements
```
### 1.6 Glossary

```
Term Definition
Kandypack A modern logistics distribution platform integrating rail
and road transportation in Sri Lanka
Software Requirements
Specification (SRS)
A document that completely describes all of the
functions of a proposed system and the constraints
under which it must operate. For example, this
document.
Order Management System The component of Kandypack that handles customer
order placement, updates, cancellations, and tracking
Last-Mile Delivery The final step in the delivery process, where a package
is transported from a warehouse to the customer
Rail Cargo Trip A scheduled shipment of goods via train, planned by
the Store Manager
Driver Assistant A user role responsible for assigning drivers, checking
routes, and scheduling trucks
Warehouse Inventory The stock of goods managed by the Warehouse Staff at
railway destination locations
Delivery Route The predefined path for delivering packages by truck
and driver
System Environment The configuration of users, interfaces, and
infrastructure that support the functioning of Kandypack
User Interface (UI) The interface through which a user interacts with the
Kandypack system
System Admin An authorized user who manages and configures the
Kandypack platform
```

Use Case A scenario describing how a user interacts with the
system to achieve a goal
Customer An end user who places an order through the
Kandypack platform
Store Manager A user role responsible for scheduling rail cargo trips,
scheduling last-mile road updates, and viewing
customer order history
Driver A user responsible for delivering goods to customers
and updating the delivery status
Driver Assistant A user role responsible for assigning drivers, checking
routes, and scheduling trucks
Route Management System A module that handles the assignment and verification
of delivery routes
Role-Based Access Control A security system that restricts access to the system
based on user roles
Data Integrity The process of ensuring accuracy and consistency of
stored data using constraints and validations
Crash Recovery A system mechanism for restoring operations and data
after a crash or failure
Scalability The ability of the system to handle increased workloads
without any degradation of performance
Non-Functional Requirements Requirements that define how a system performs a task
rather than what it does
Functional Requirements Specific behaviours or functions the system must
support
System Feature A major functionality provided by the system


## 2. Overall Description

### 2.1 Product Perspective

The Kandypack supply chain system is a new, self-contained, innovative software solution
designed to modernize and streamline the rail and road-based logistics operations in Sri Lanka.
This system replaces the company’s existing Excel-based processes (Which are manual and
prone to errors).
The Kandypack system integrates all the aspects of the supply chain from order placement to
final delivery into a database-driven platform. It encompassed order management, rail cargo
scheduling, warehouse inventory management, rail cargo scheduling, last-mile road delivery and
human resource scheduling with strong capabilities.

### 2.2 System Environment

Figure 1 - System Environment
The KandyPack system has six active actors and six cooperating systems. The system
admin, Customer, Store manager and assistant access the system through the internet. The
system admin and the customer access the order management system. The store manager has
direct access to the reporting and analytics system to get the analytical data and performance
reports. The driver assistant can assign each driver to a certain route. The Route Management
and Resource Management system efficiently handles the drivers. The customer interacts with
the system through the web interface.

### 2.3 Function Requirement Specification

This section outlines the use cases for each active user in the system separately.


### 2 .3.1 Customer Use Case

The Customer has following User Cases
Figure 2 - Customer User Case Diagram

### Use case: Place Order

**Diagram:**
Figure 3 - Place Order User Case Diagram
**Brief Description**
The customer can place order through the web based application
**Initial Step-By-Step Description**

1. The customer log in to the system and place the order section in the web application
2. The system represents a choice of Making an order


3. The customer gives order details and address information to the system
4. The system conforms the order after successfully placed
5. The Customer receives a conformational email regarding the order
6. The Customer can see the delivery status in the Delivery information section

### Use case: Cancel Order

**Diagram:**
Figure 4 - Cancel order User Case
**Brief Description**
After the order placed the customer can cancel the order within 12 hours
**Initial Step-By-Step Description**

1. After the order is successfully placed, the order section shows in the web application.
2. In the order section , the cancel section cancels the order by asking some reasons for
the cancellation

### Use case: Check status of the Last-Mile Road Update

```
Diagram:
Figure 5 - Check status of the last-Mile Road update User Case
Brief Description:
After the customer place the order customer can check the status of the delivery
Initial Step-By-Step Description
```
1. In the orders section the package tracking shows the last mile road update

### Use case: Update Order

**Diagram:**


Figure 6 - Update order user case
**Brief Description:**
After the order is placed successfully, the customer can change the order quantity and add a new
items before the delivery process (Before the warehouse departure)
**Initial Step-By-Step Description:**

1. In the order section, customers can update the order.

### Use case: Change the delivery location/ Address

**Diagram:**
Figure 7 - Change the deliver Location/ Address
**Brief Description:**
Same as the update order user case, customer can change the delivery address before the
warehouse departure

### Use case: Review service

```
Diagram:
Figure 8 - Review Sections
Brief Description:
After the customer gets the service, the customer can review the service they had.
Initial Step-By-Step Description:
```
1. After the delivery has done customer can review the service using the review section


### 2.3.2 Store Manager Use Case

The Store Manager User Case has following User Cases
Figure 9 - Store Manager User Case

### Use case: Schedule Rail Cargo Trip

```
Diagram:
Figure 10 - Schedule Rail Cargo Trip User Case
Brief Description:
The Store Manager schedules customer orders to railway cargo trips, ensuring optimal
allocation based on train capacity and product-specific space constraints
Initial Step-By-Step Description:
```
1. The Store Manager logs into the system with authorized credentials.


2. The Store Manager navigates to the "Rail Transport" section.
3. The system displays a list of pending customer orders eligible for rail transport (orders
placed at least 7 days in advance).
4. The Store Manager selects one or more orders for a specific destination (e.g., Colombo,
Galle).
5. The system calculates the total space required for selected orders based on product
types (e.g., 0.5 units per detergent box).
6. The system presents available railway cargo trips for the selected destination, showing
remaining capacity for each trip.
7. The Store Manager assigns orders to a trip, ensuring the total space does not exceed the
train’s capacity.
8. If capacity is insufficient, the system suggests the next available trip or prompts
splitting the order.
9. The Store Manager confirms the assignment, and the system updates the order status to
"Scheduled for Rail."
10. The system saves the schedule and generates a confirmation for the Store Manager.

### Use case: Schedule Last-Mile Road Delivery update

**Diagram:**
Figure 11 - Schedule Last-Mile Road Delivery update User Case
**Brief Description:**
The Store Manager schedules trucks, drivers, and assistants for last-mile road deliveries,
ensuring compliance with route assignments, vehicle limits, and personnel scheduling
rules.


**Initial Step-By-Step Description:**

1. The Store Manager logs into the system with authorized credentials.
2. The Store Manager navigates to the "Road Delivery" section.
3. The system displays goods in the warehouse ready for last-mile delivery, grouped by
destination area.
4. The Store Manager selects a delivery route covering the target area.
5. The system shows available trucks, drivers, and assistants, respecting constraints:
    Drivers cannot be assigned consecutive deliveries.
    Assistants are limited to two consecutive routes.
    Weekly hour limits (40 hours for drivers, 60 hours for assistants) are enforced.
6. The Store Manager assigns a truck, driver, and assistant to the selected route.
7. The system validates the assignment, checking for scheduling confl icts or violations of
working hour limits.
8. If conflicts arise, the system suggests alternative drivers, assistants, or routes.
9. The Store Manager confirms the delivery schedule, and the system updates the order
status to "Scheduled for Road Delivery."
10. The system saves the schedule and notifies the assigned personnel.

### Use case: View Customer Order History

**Diagram:**
Figure 12 - View customer order History User Case
**Brief Description:**


```
The Store Manager views a customer’s order history, including details of past orders and
their delivery statuses, to support customer inquiries or operational reviews.
Initial Step-By-Step Description:
```
1. The Store Manager logs into the system with authorized credentials.
2. The Store Manager navigates to the "Customer Management" section.
3. The Store Manager enters a customer’s ID or name to search for their order history.
4. The system retrieves and displays a list of the customer’s past orders, including:
    Order ID, date placed, items, quantities, and total value.
    Delivery status (e.g., placed, scheduled, delivered).
    Delivery details (e.g., route, date, destination).
5. The Store Manager filters the results by date range or order status, if needed.
6. The system allows the Store Manager to export the order history as a report or view
detailed logs for a specific order.
7.The Store Manager closes the view, and the system logs the access for audit purposes.

### 2.3.3 Warehouse Staff Use Case

The WareHouse inventory has following User Case
Figure 13 - WareHouse staff has following User Case
**Use Case:** WareHouse staff has following User Case
**Brief Description:**
The Warehouse Staff records and manages inventory at railway destination warehouses,
updating stock levels as goods are received from rail cargo trips or dispatched for road
delivery.
**Initial Step-By-Step Description:**

1. The Warehouse Staff logs into the system with authorized credentials.


```
2.The Warehouse Staff navigates to the "Warehouse Inventory" section.
```
3. The system displays the current inventory for the warehouse, including product types,
quantities, and storage locations.
4. Upon arrival of a rail cargo trip, the Warehouse Staff selects the corresponding trip
from a list of scheduled deliveries.
5. The system shows the expected goods (product types and quantities) for the selected
trip.
6. The Warehouse Staff verifies the received goods against the system’s records and
confirms quantities.
7.If discrepancies exist, the Warehouse Staff logs them in the system with notes for
resolution.
8. The system updates the warehouse inventory with the confirmed quantities.
9. When goods are prepared for road delivery, the Warehouse Staff marks the items as
dispatched, reducing inventory levels.
10. The system saves the inventory updates and logs the transaction for audit purposes.

### 2.3.4 Management use case

### Use case: Generate Sales and Utilization Reports

Figure 14 - Generate Sales and Utilization Reports has following User Case
**Brief Description** :
The Management generates reports to analyze sales performance, product popularity,
regional sales breakdowns, driver/assistant working hours, and truck usage to support
data-driven decision-making.
**Initial Step-By-Step Description** :

1. The Management logs into the system with authorized credentials.


```
2.The Management navigates to the "Reports and Analytics" section.
```
3. The system displays available report types, including quarterly sales, product
popularity, city/route-wise sales, driver/assistant hours, and truck usage.
4. The Management selects a report type (e.g., quarterly sales report) and specifies
parameters such as date range or quarter.
5. The system retrieves relevant data from the database, ensuring calculations respect
constraints like order statuses and delivery records.
6. The system generates the report, presenting details such as:
    Sales value and volume for the selected period.
    Most ordered items in a quarter.
    Sales breakdowns by city and delivery route.
    Driver and assistant working hours.
    Monthly truck usage statistics.
7. The Management reviews the report in the system interface, with options to filter or
sort data (e.g., by product or region).
8. The Management exports the report as a downloadable file (e.g., PDF or CSV) for
further analysis or sharing.
9. The system logs the report generation activity for audit purposes.
10. The Management closes the report view, and the system saves the session.

### 2.3.5 Driver use case:

Deliver packages has following user case
Figure 15 - Deliver packages User Case


```
Brief Description :
The Driver delivers packages to customers as part of a scheduled last-mile road delivery
route, ensuring timely and accurate delivery while updating delivery statuses in the
system.
Initial Step-By-Step Description :
1.The Driver logs into the system using authorized credentials (e.g., via a mobile app or
terminal).
```
2. The Driver navigates to the "Delivery Schedule" section to view assigned routes for the
day.
3. The system displays the assigned route details, including delivery locations, customer
orders, and expected delivery times.
4. The Driver confirms the loading of packages onto the assigned truck at the warehouse,
verifying the goods against the system’s delivery manifest.
5.The Driver begins the delivery route, following the predefined sequence of stops.
6. At each delivery location, the Driver delivers the packages to the customer and collects
any required confirmation (e.g., signature or acknowledgment).
7. The Driver updates the delivery status in the system for each order (e.g., "Delivered")
using the mobile app or terminal.
8. If a delivery issue occurs (e.g., customer unavailable), the Driver logs the issue in the
system with details for follow-up.
9. The system updates the order status and logs the Driver’s hours to ensure compliance
with the 40-hour weekly limit.
10.Upon completing the route, the Driver marks the route as finished in the system, which
logs the activity and notifies the Store Manager.

### 2.3.6 Driver Assistant Use case:

```
Driver Assistant has following user case
```

Figure 16 - Driver Assistant User Case

### Use case: Assign Drivers

**Diagram:**
Figure 17 - Assign Drivers User Case
**Brief Description** :
The Driver Assistant assigns drivers to scheduled delivery routes, ensuring compliance
with scheduling rules such as no consecutive deliveries and weekly hour limits.
**Initial Step-By-Step Description** :

1. The Driver Assistant logs into the system with authorized credentials.
2. The Driver Assistant navigates to the "Driver Assignment" section.
3. The system displays a list of scheduled delivery routes requiring driver assignments.


4. The Driver Assistant selects a route to assign a driver.
5. The system presents a list of available drivers, filtered to exclude those with:
    Consecutive delivery assignments.
    Exceeded weekly hour limits (40 hours).
6. The Driver Assistant selects a driver from the available list.
7. The system validates the assignment, checking for scheduling confl icts or violations of
working hour constraints.
8. If a conflict is detected, the system suggests alternative drivers.
9. The Driver Assistant confirms the assignment, and the system updates the route with
the assigned driver.
10. The system logs the assignment and notifies the driver of the schedule.

### Use case: Check the routes

```
Diagram:
Figure 18 - Check Routes User Case
Brief Description :
The Driver Assistant reviews assigned delivery routes to ensure they are correctly
scheduled, have no conflicts, and are ready for execution.
Initial Step-By-Step Description :
1.The Driver Assistant logs into the system with authorized credentials.
2.The Driver Assistant navigates to the "Route Management" section.
3.The system displays a list of scheduled delivery routes, including details such as route
area, assigned truck, driver, and assistant.
4.The Driver Assistant selects a route to review its details.
```

5. The system shows the route’s orders, delivery stops, and expected timelines, along with
assigned personnel and truck details.
6.The Driver Assistant verifies that the route complies with constraints:
    No overlapping assignments for drivers or assistants.
    Adherence to assistant’s limit of two consecutive routes.
    Truck compatibility with route requirements.
7. If issues are found (e.g., scheduling conflicts), the Driver Assistant flags them in the
system for resolution.
8. The system logs the review activity for audit purposes.
9. The Driver Assistant marks the route as verified or escalates issues to the Store
Manager.
10. The system saves the verification status and updates the route record.

### Use case: Schedule Trucks

```
Diagram:
Figure 19 - Schedule Trucks User Case
Brief Description :
The Driver Assistant schedules trucks for delivery routes, ensuring availability and
compliance with route-specific requirements and vehicle usage limits.
Initial Step-By-Step Description :
1.The Driver Assistant logs into the system with authorized credentials.
2.The Driver Assistant navigates to the "Truck Scheduling" section.
```

```
3.The system displays a list of delivery routes requiring truck assignments.
4.The Driver Assistant selects a route to schedule a truck.
5.The system shows available trucks, filtered by:
Availability (not assigned to overlapping routes).
Capacity compatibility with the route’s cargo requirements.
```
6. The Driver Assistant selects a truck from the available list.
7. The system validates the selection, ensuring no conflicts with other route schedules or
vehicle usage limits.
8.If a conflict arises, the system suggests alternative trucks or routes.
9.The Driver Assistant confirms the truck assignment, and the system updates the route
with the assigned truck.
10.The system logs the scheduling activity and notifies relevant personnel (e.g., driver,
warehouse staff).

## 2.4 User Characteristics

```
The Kandypack Supply Chain Distribution System serves five main user groups with
varying roles, responsibilities, and technical skills.
```
1. **Store Manager**
    ● **Role:** Manages logistics scheduling, order fulfillment, and customer order
       histories.
    ● **Proficiency:** Moderate to high; familiar with computer systems and reports.
    ● **Interaction:** Desktop/web interface for scheduling and tracking.
    ● **Training:** 1–2 hours.
    ● **Usage:** Daily.
2. **Warehouse Staff**
    ● **Role:** Handles inventory, cargo unloading, and delivery preparation.
    ● **Proficiency:** Basic to moderate; familiar with simple data entry.
    ● **Interaction:** Web/mobile interface for inventory updates and verification.


```
● Training: 1–2 hours.
● Usage: Daily.
```
3. **Management**
    ● **Role:** Reviews reports for strategic decisions (sales, utilization, etc.).
    ● **Proficiency:** Moderate; familiar with data analysis tools.
    ● **Interaction:** Web interface for report generation and export.
    ● **Training:** ~1 hour.
    ● **Usage:** Periodic (weekly/quarterly).
4. **Driver**
    ● **Role:** Executes last-mile deliveries, updates statuses, reports issues.
    ● **Proficiency:** Basic; mobile device familiarity.
    ● **Interaction:** Mobile app for routes, delivery status, and issue logging.
    ● **Training:** 30–60 minutes.
    ● **Usage:** Daily during deliveries.
5. **Driver Assistant
● Role:** Assigns drivers, manages routes, schedules trucks.
● **Proficiency:** Basic to moderate; uses web/mobile tools.
● **Interaction:** Interface for scheduling and conflict checks.
● **Training:** 1–2 hours.
● **Usage:** Daily


### 2.5 Non-Functional Requirements

```
The system shall ensure high performance , processing up to many concurrent orders
within a few seconds, generating reports in under 5 seconds, and reflecting inventory
updates in real time. It shall be scalable , supporting monthly orders and accommodating
a 50% increase in activity without additional hardware. The system shall maintain strong
usability , offering an intuitive interface requiring minimal training (1–2 hours) and
one-tap actions for mobile users. Reliability shall be guaranteed with 99.9% uptime,
crash recovery within 5 minutes, and no data loss through transaction logging and
backups. Robust security measures include role-based access control, encryption
(AES-256, TLS), and full user action logging. For maintainability , the system shall allow
configuration-based updates, modular design for future enhancements, and complete
documentation. It shall ensure compatibility with standard servers, modern
browsers,Relational Database Systems, and mobile apps for Android and iOS. The
system shall be available 24/7, with maintenance limited to 2 hours monthly during
low-usage periods. Finally, data integrity will be enforced through relational constraints,
indexing, validation, and clear user feedback on errors.
```
## 3. Requirements Specifications

### 3.1 External Interface Requirements

```
User Interface
Our team designed a demo user interface with all requirement details. To check the online
demo click the following link
Online demo
```
### 3.2 Functional Requirements

1. Order Management
    With the system, the users will be able to capture customer orders with customer ID,
    several items, their quantities, product codes, and delivery zones. It will be able to
    confirm that orders are placed at least a week in advance and cross check delivery
    addresses to confined routes. The system will monitor and update the status of all orders,
    including the order’s placement and delivery, and all the steps in between. The system
    will be able to authorize certain users, for example the Store Manager, to view and filter
    customer order histories with in-depth information on what items were ordered, their
    delivery status, relevant dates, and the order’s progress.


### 2. Rail Transport Management

```
The system will allow customers to book railway cargo trips starting from Kandy to other
cities including Colombo, Negombo, Galle, Matara, Jaffna, and Trincomalee. It will
allow cargo limits to be set per trip. Any excess quantities will be allocated to other
scheduled trips automatically. The system will also ensure that the total cargo does not
exceed the train's capacity by calculating space consumption based on product types (e.g.,
0.5 units per detergent box). Store Managers will also be able to confirm the schedules of
the rail trips and change the order status to "Scheduled for Rail Dispatch.”
```
### 3. Warehouse Operations

```
The system will monitor levels as well as the types and locations of products in the
warehouses that are adjacent to the railway stations. The warehouse personnel will be
able to verify the receipt of goods unloaded from rail cargo shipments, and the system
will update inventory for the received amounts. The system will also support the
recording of any discrepancies such as loss and damage during the unloading process
along with comments for investigation and resolution. In addition, the system will enable
staff to make changes to the inventory for items that are set for delivery by road transport.
```
### 4. Last-Mile Road Delivery

```
The system will allow for assigning trucks to specific delivery routes with area coverage
and delivery time limitations. It will allow assigning a driver and an assistant to each
scheduled truck, ensuring no conflicts. Through a mobile application, drivers will be able
to mark deliveries as “Delivered” or “Failed” and document any issues with failed
deliveries. In addition, the system will notify the Warehouse Staff and Store Managers in
real-time about any updates to the delivery status.
```
### 5. Human Resource Scheduling

```
The system will keep track of drivers' and assistants' schedules by following important
rules. For example, drivers can't be assigned to two delivery routes in a row, assistants can
only work two delivery routes in a row, and drivers can only work 40 hours a week and
assistants can only work 60 hours a week. It will keep scheduling problems from
happening by making sure that drivers, helpers, and trucks are not given routes or times
that overlap. The system will also let Driver Assistants assign people to routes, and it will
have built-in checks to make sure that all scheduling requirements are met.
```
### 6. Route Management

```
The system should keep a list of set delivery routes in a database. This should include the
areas covered, the expected delivery times, and the truck requirements. Driver Assistants
shall be able to view detailed route information, verify assigned trucks, drivers, assistants,
and order allocations. The system will also automatically flag any scheduling problems,
```

```
like conflicts or missing assignments, so that the Store Manager or Driver Assistant can
fix them.
```
### 7. Truck Scheduling

```
The system will let Driver Assistants plan delivery routes for trucks, making sure they are
available and able to carry the load. It will check truck assignments to make sure they
don't conflict with other routes and that the limits on how many vehicles can be used are
not broken. The system will also let Warehouse Staff know which trucks they need to get
ready for loading.
```
### 8. Reporting and Analytics

```
The system will generate comprehensive reports to support operational and management
needs. It will produce quarterly sales reports showing total sales value and volume,
highlight the most ordered items within a specified quarter, and provide detailed sales
breakdowns by city and delivery route for a given period. Additionally, it will generate
reports on driver and assistant working hours to ensure compliance with weekly limits, as
well as monthly analyses of truck usage, including utilization rates and route
assignments. Management will be able to filter and export these reports in formats such
as PDF or CSV.
```
### 9. System Integrity

```
The system will enforce data consistency using relational constraints, triggers, and stored
procedures to prevent invalid entries such as train overbooking or scheduling confl icts. It
will employ indexing to optimize data retrieval for tasks like scheduling, inventory
management, and reporting. Additionally, all user actions—including scheduling,
inventory updates, and report generation will be logged for audit purposes, with access
restricted to authorized users such as Management.
```
### 10. User Access and Authentication

```
The system will implement role-based access control to restrict functionalities based on
user roles such as Store Manager, Warehouse Staff, Management, Driver, and Driver
Assistant. It will require secure user authentication through credentials like usernames
and passwords for all access points, including web and mobile apps. Additionally, the
system will manage user sessions by automatically logging out inactive users after a
configurable timeout period, such as 15 minutes.
```
### 3.3 Detailed Non-Functional Requirements

### 3 .3.1 Logical Structure of the Data


```
The logical structure of the data to be stored in the internal database is given below.
(ERD Diagram)
Figure 20 - ERD Diagram
```
### 3.3.2 Security

```
The Kandypack Supply Chain Distribution System handles sensitive data and requires
strong security measures to prevent unauthorized access and data breaches. It enforces
```

role-based access control, ensuring users access only functions relevant to their roles,
with secure authentication and session timeouts after 15 minutes of inactivity. Password
policies enforce minimum length and complexity. Sensitive data is encrypted both in
storage (AES-256) and during transmission (TLS), and secure APIs restrict mobile app
access. The system maintains detailed audit logs accessible only to Management,
includes intrusion detection for suspicious activity, and applies regular security updates.
Data backups are encrypted, stored securely off site, and tested for fast recovery within 5
minutes. The system also complies with relevant data protection laws to safeguard
customer and employee information, ensuring data integrity, operational continuity, and
user trust.


