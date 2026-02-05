# Admin Token Usage Guide

## Overview
All admin actions that modify user data require an **admin token** for security. This prevents unauthorized changes even if a regular authentication token is compromised.

## How to Use Admin Token

### Step 1: Login as Admin
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "user_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Regular token
  }
}
```

### Step 2: Request Admin Token
Before performing any admin action, request an admin token by providing your password:

```http
POST /api/users/request-admin-token
Authorization: Bearer <regular_token>
Content-Type: application/json

{
  "password": "admin_password"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Admin token generated successfully",
  "data": {
    "adminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

### Step 3: Use Both Tokens for Admin Actions

Now you can perform admin actions by including **both tokens**:

#### Delete User
```http
DELETE /api/users/admin/delete/:userId
Authorization: Bearer <regular_token>
x-admin-token: <admin_token>
```

#### Approve User
```http
PATCH /api/users/admin/approve/:userId
Authorization: Bearer <regular_token>
x-admin-token: <admin_token>
Content-Type: application/json

{
  "role": "USER"
}
```

#### Reject User
```http
PATCH /api/users/admin/reject/:userId
Authorization: Bearer <regular_token>
x-admin-token: <admin_token>
```

## Admin Actions Requiring Admin Token

The following endpoints **require admin token**:
- `DELETE /api/users/admin/delete/:id` - Delete a user
- `PATCH /api/users/admin/approve/:id` - Approve a pending user
- `PATCH /api/users/admin/reject/:id` - Reject a pending user

## Admin Actions NOT Requiring Admin Token

These endpoints only need regular authentication:
- `GET /api/users/admin/stats` - View system statistics
- `GET /api/users/admin/all-users` - List all users
- `GET /api/users/admin/pending-users` - List pending users

## Error Responses

### Missing Admin Token
```json
{
  "status": "fail",
  "message": "Admin token required for this operation"
}
```

### Invalid/Expired Admin Token
```json
{
  "status": "fail",
  "message": "Invalid or expired admin token"
}
```

### Self-Modification Attempt
```json
{
  "status": "fail",
  "message": "Admins cannot modify their own credentials. Please have another admin make this change."
}
```

## Frontend Implementation Example

```javascript
// 1. Login and store regular token
const loginResponse = await fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token: regularToken } = await loginResponse.json();

// 2. Request admin token before admin action
const adminTokenResponse = await fetch('/api/users/request-admin-token', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${regularToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ password: adminPassword })
});
const { adminToken } = await adminTokenResponse.json();

// 3. Perform admin action with both tokens
const deleteResponse = await fetch(`/api/users/admin/delete/${userId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${regularToken}`,
    'x-admin-token': adminToken
  }
});
```

## Security Features

✅ **Password Re-authentication**: Admin token requires password verification  
✅ **Short Expiry**: Admin tokens expire in 15 minutes  
✅ **Self-Modification Prevention**: Admins cannot modify their own accounts  
✅ **Token Type Validation**: System verifies the token is specifically an admin token  

## Notes

- Admin tokens expire after **15 minutes** for security
- You need to request a new admin token after expiry
- Regular tokens expire after **1 hour**
- Admins **cannot** delete, approve, or reject themselves (even with admin token)
