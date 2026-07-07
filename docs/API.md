# REST API Documentation

Base URL

/api

-----------------------------------

Authentication

POST /auth/login

POST /auth/register

POST /auth/logout

POST /auth/refresh

-----------------------------------

Dashboard

GET /dashboard

-----------------------------------

Users

GET /users

GET /users/:id

POST /users

PUT /users/:id

DELETE /users/:id

-----------------------------------

Roles

GET /roles

POST /roles

PUT /roles/:id

DELETE /roles/:id

-----------------------------------

Categories

GET /categories

GET /categories/:id

POST /categories

PUT /categories/:id

DELETE /categories/:id

-----------------------------------

Products

GET /products

GET /products/:id

POST /products

PUT /products/:id

DELETE /products/:id

-----------------------------------

Customers

GET /customers

POST /customers

PUT /customers/:id

DELETE /customers/:id

-----------------------------------

Orders

GET /orders

GET /orders/:id

POST /orders

PUT /orders/:id

DELETE /orders/:id

-----------------------------------

Inventory

GET /inventory

POST /inventory

PUT /inventory/:id

DELETE /inventory/:id

-----------------------------------

Suppliers

GET /suppliers

POST /suppliers

PUT /suppliers/:id

DELETE /suppliers/:id

-----------------------------------

Reservations

GET /reservations

POST /reservations

PUT /reservations/:id

DELETE /reservations/:id

-----------------------------------

Payments

GET /payments

POST /payments

GET /payments/:id

-----------------------------------

Reports

GET /reports/daily

GET /reports/weekly

GET /reports/monthly

GET /reports/top-products

GET /reports/inventory

-----------------------------------

Audit Logs

GET /audit-logs