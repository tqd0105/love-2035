# Project Structure Specification

## 1. Overview

Project follows layered architecture:

- app/ → routing layer
- services/ → business logic
- middleware/ → guards
- lib/ → shared utilities
- prisma/ → database layer

UI layer must never contain business logic.

---

## 2. Layer Responsibilities

### app/api

- Define route handlers only
- Call service functions
- Do not access Prisma directly

---

### services

- Contain all business logic
- Can call Prisma
- Can call other services
- Must not depend on UI

---

### middleware

- Auth
- Mode injection
- Visibility guard

Middleware must be stateless.

---

### lib

Reusable utilities:

- prisma client
- jwt utils
- encryption
- helpers

---

## 3. Dependency Rules

- app → services
- services → prisma
- middleware → lib
- services must not import from app

Circular dependency is forbidden.