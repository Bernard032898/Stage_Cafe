# Database Design

Database: PostgreSQL

ORM: Prisma

Primary Key:
UUID

---

## Roles

Stores user roles.

Columns

- id
- name
- description

Example

Admin
Manager
Cashier
Kitchen

---

## Users

Stores employee accounts.

Columns

- id
- role_id
- first_name
- last_name
- email
- password
- phone
- status

Relationship

Many Users belong to one Role.

---

## Categories

Stores menu categories.

Examples

Coffee
Milk Tea
Desserts
Meals

---

## Products

Stores menu items.

Examples

Cafe Latte
Spanish Latte
Americano

Relationship

Many Products belong to one Category.

---

## Orders

Stores customer orders.

Relationship

One Customer

Many Orders

---

## Order Items

Stores individual products inside an order.

Relationship

One Order

Many Order Items

---

## Inventory

Stores ingredients.

Examples

Milk
Coffee Beans
Sugar
Chocolate
Ice

---

## Suppliers

Stores supplier information.

---

## Reservations

Stores customer reservations.

---

## Payments

Stores payment records.

---

## Audit Logs

Stores all system activity.