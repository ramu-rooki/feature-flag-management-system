# Phase 3 Testing Scenarios & Guide

Use tools like **Postman**, **Insomnia**, or `curl` to verify the authentication endpoints.
All API endpoints are prefixed with `http://localhost:5000/api/auth`.

## 1. Organization Admin Signup (`POST /signup`)
**Endpoint**: `POST /signup`
**Success Scenario**:
```json
{
  "name": "Velan Admin",
  "email": "admin@velan.com",
  "password": "Password123",
  "organizationId": "your-org-uuid"
}
```
*Expected*: `201 Created` with success message.

**Failure Scenarios**:
- **Duplicate Email**: Trying to sign up with `admin@velan.com` again. Expected: `409 Conflict` (Duplicate entry).
- **Invalid Email**: `"email": "admin@velan"`. Expected: `400 Bad Request` (Invalid email format).
- **Weak Password**: `"password": "123"`. Expected: `400 Bad Request` (Password must be at least 8 characters).

## 2. Standard Login (`POST /login`)
**Endpoint**: `POST /login`
**Success Scenario**:
```json
{
  "email": "admin@velan.com",
  "password": "Password123"
}
```
*Expected*: `200 OK` with `token` and `user` object.

**Failure Scenarios**:
- **Wrong Password**: Expected `401 Unauthorized` (Invalid credentials).
- **Missing Field**: Expected `400 Bad Request` (Email and password are required).

## 3. Super Admin Login (`POST /super-admin/login`)
**Endpoint**: `POST /super-admin/login`
**Success Scenario**:
```json
{
  "email": "your_super_admin_email_from_env",
  "password": "your_super_admin_password_from_env"
}
```
*Expected*: `200 OK` with `SUPER_ADMIN` token (bypasses database).

## 4. Protected Profile Route (`GET /profile`)
**Endpoint**: `GET /profile`
**Headers**: `Authorization: Bearer <your_jwt_token>`

**Failure Scenarios**:
- **Missing Token**: Expected `401 Unauthorized`.
- **Invalid Token**: `"Bearer badtoken123"`. Expected `401 Unauthorized`.
- **Expired Token**: (Wait 24 hours). Expected `401 Unauthorized` (Token has expired).

## 5. Authorization (RBAC) Example
If you use the `authorize([Role.SUPER_ADMIN])` middleware on an endpoint, and attempt to access it with an `ORG_ADMIN` token, you will receive a `403 Forbidden: Insufficient permissions`.
