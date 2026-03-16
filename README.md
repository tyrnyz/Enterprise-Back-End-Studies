# Enterprise-Back-End-Studies

A collection of laboratory exercises and projects completed for **ICS2609 – Enterprise Back-End Development**, a course taken in the 3rd year of the BS Information Systems program at the **University of Santo Tomas (UST)**.

---

## Folder Structure

```
Enterprise-Back-End-Studies/
├── final-lab-act/          # Sprint 3 final project — full-stack expense tracker (ipon101)
├── ics2609-backend/        # Basic Express + MySQL backend (early course exercises)
├── individual-landing-page/# Vue 3 landing page with JWT authentication
├── lab-auth-api/           # Lab: JWT authentication API (signup, login, logout, profile)
├── lab-auth-joins/         # Lab: JWT auth with SQL JOIN operations
└── lab-crud-api/           # Lab: CRUD API for students and courses
```

---

## Projects

### `final-lab-act/` — ipon101 Expense Tracker (Sprint 3)

A complete full-stack personal finance application built as the final laboratory activity.

**Structure:**
```
final-lab-act/
├── backend/                # Standalone Express backend (root-level)
├── ipon101/
│   ├── backend/            # Primary Express + MySQL backend
│   │   ├── config/db.js
│   │   ├── controllers/    # authController, categoryController, transactionController
│   │   ├── middleware/     # JWT auth middleware
│   │   └── routes/         # auth, categories, transactions
│   ├── ipon101/            # Nested Vue 3 frontend (Vite)
│   │   └── src/
│   │       ├── components/ # Auth, Categories, Transactions, Dashboard
│   │       ├── services/   # API service modules
│   │       └── utils/
│   └── src/                # Root-level Vue frontend (with Bootstrap + Chart.js)
└── ipon101.sql             # Database schema
```

**Tech:** Vue 3, Vite, Pinia, Vue Router, Axios, Chart.js, Bootstrap 5, Express.js, MySQL2, JWT, bcryptjs

**Setup — Backend:**
```bash
cd final-lab-act/ipon101/backend
npm install
# Create a .env file with DB credentials and JWT_SECRET
npm run dev
```

**Setup — Frontend:**
```bash
cd final-lab-act/ipon101
npm install
npm run dev
```

---

### `ics2609-backend/` — Course Backend Starter

A basic Express.js + MySQL backend used for early course exercises and database connection practice.

**Tech:** Express.js, MySQL2, dotenv

**Setup:**
```bash
cd ics2609-backend
npm install
# Create a .env file with DB credentials
npm run dev
```

---

### `individual-landing-page/` — Vue 3 Auth Landing Page

A Vue 3 single-page application featuring a landing page, authentication flow (login/dashboard), and Pinia state management.

**Tech:** Vue 3, Vite, Vue Router, Pinia, Axios, Bootstrap 5, Bootstrap Icons, Tailwind CSS

**Setup:**
```bash
cd individual-landing-page
npm install
npm run dev
```

---

### `lab-auth-api/` — JWT Authentication API

A Node.js REST API implementing JWT-based authentication from scratch.

**Endpoints:** `POST /signup`, `POST /login`, `POST /logout`, `GET /profile`

**Tech:** Express.js, MySQL2, JWT (jsonwebtoken), bcryptjs, dotenv, uuid

**Setup:**
```bash
cd lab-auth-api
npm install
cp .env.example .env   # Fill in DB credentials and JWT_SECRET
npm run dev
```

---

### `lab-auth-joins/` — JWT Auth with SQL Joins

Extends `lab-auth-api` with relational database queries using SQL JOINs.

**Tech:** Express.js, MySQL2, JWT, bcryptjs, dotenv, uuid

**Setup:**
```bash
cd lab-auth-joins
npm install
cp .env.example .env   # Fill in DB credentials and JWT_SECRET
npm run dev
```

---

### `lab-crud-api/` — CRUD REST API

A REST API demonstrating full Create, Read, Update, Delete operations for `students` and `courses` tables.

**Tech:** Express.js (CommonJS), MySQL2, dotenv

**Setup:**
```bash
cd lab-crud-api
npm install
cp .env.example .env   # Fill in DB credentials
npm run dev
```

---

## Tech Stack

| Layer      | Technologies                                      |
|------------|---------------------------------------------------|
| Frontend   | Vue 3, Vite, Vue Router, Pinia, Axios             |
| Styling    | Bootstrap 5, Bootstrap Icons, Tailwind CSS, CSS   |
| Charts     | Chart.js                                          |
| Backend    | Node.js, Express.js                               |
| Database   | MySQL (via mysql2 driver, XAMPP)                  |
| Auth       | JWT (jsonwebtoken), bcryptjs                      |
| Dev Tools  | nodemon, dotenv                                   |

---

## Course Context

- **Course:** ICS2609 – Enterprise Back-End Development
- **Program:** BS Information Systems
- **Year Level:** 3rd Year
- **University:** University of Santo Tomas (UST)
