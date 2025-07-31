# 🧪 API Testing Guide

This comprehensive guide provides detailed examples for testing all API endpoints in the Parcel Delivery System. All examples are production-ready and can be tested with tools like Postman, Thunder Client, Insomnia, or curl.

## 🚀 Base URL

```
http://localhost:5000/api
```

## 🏥 Health Check

**GET** `/`

Check if the API server is running and healthy.

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel Delivery API is running successfully",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## 🔐 Authentication Overview

The API uses JWT-based authentication with a dual token system:

- **Access Token**: 15 minutes expiry (for API requests)
- **Refresh Token**: 7 days expiry (for token renewal)

Both tokens are stored as HTTP-only cookies for enhanced security.

---

## 👤 Authentication Endpoints

### 1. User Registration

**POST** `/auth/register`

Register a new user in the system.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "role": "sender",
  "address": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "sender",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "isBlocked": false,
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Errors (400):**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation error",
  "errorSources": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 2. User Login

**POST** `/auth/login`

Authenticate a user and receive JWT tokens.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "sender"
    }
  }
}
```

### 3. Refresh Token

**POST** `/auth/refresh-token`

Refresh the access token using the refresh token stored in cookies.

**Request:** No body required (uses refresh token from HTTP-only cookie)

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Token refreshed successfully"
}
```

### 4. Logout

**POST** `/auth/logout`

Log out the user and invalidate tokens.

**Request:** No body required

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Logout successful"
}
```

### 5. Get Current User Profile

**GET** `/auth/me`

Get the profile information of the currently authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "sender",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "isBlocked": false,
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 👥 User Management Endpoints

### 1. Get User Profile

**GET** `/users/profile`

Get the current user's profile information.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "sender",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "isBlocked": false,
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Update User Profile

**PATCH** `/users/profile`

Update the current user's profile information.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "name": "John Updated Doe",
  "phone": "+1234567899",
  "address": {
    "street": "456 Updated Street",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "USA"
  }
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567899",
    "role": "sender",
    "address": {
      "street": "456 Updated Street",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02101",
      "country": "USA"
    },
    "isBlocked": false,
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 3. Get All Users (Admin Only)

**GET** `/users`

Retrieve all users in the system (admin access required).

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Request Example:**

```
GET /users?page=1&limit=10
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "sender",
      "isBlocked": false,
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 4. Get User Statistics (Admin Only)

**GET** `/users/stats`

Get comprehensive user statistics.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "totalUsers": 150,
    "adminUsers": 2,
    "senderUsers": 98,
    "receiverUsers": 50,
    "blockedUsers": 3,
    "verifiedUsers": 142,
    "unverifiedUsers": 8
  }
}
```

---

## 📦 Parcel Management Endpoints

### 1. Create Parcel (Sender Only)

**POST** `/parcels`

Create a new parcel delivery request. Only users with 'sender' role can create parcels.

**Important Requirements:**

- The receiver must have a valid registered account in the system
- `receiverEmail` is **required** - you must specify an existing receiver's email address
- The system will automatically find the receiver by email and fetch their information
- Receiver's name and email are automatically fetched from the database (non-editable)
- You can optionally override the receiver's phone and/or address
- If not overridden, the receiver's default phone and address from their profile will be used

**Headers:**

```
Authorization: Bearer <sender_access_token>
```

**Request Body - Basic (using receiver's default contact info):**

```json
{
  "receiverEmail": "jane.smith@example.com",
  "parcelDetails": {
    "type": "electronics",
    "weight": 2.5,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 15
    },
    "description": "Laptop computer for delivery",
    "value": 1200
  },
  "deliveryInfo": {
    "preferredDeliveryDate": "2024-01-20T14:00:00.000Z",
    "deliveryInstructions": "Please ring the doorbell twice",
    "isUrgent": true
  }
}
```

**Request Body - With Contact Info Override:**

```json
{
  "receiverEmail": "jane.smith@example.com",
  "receiverInfo": {
    "phone": "+1-555-0199",
    "address": {
      "street": "789 Pine Street",
      "city": "Chicago",
      "state": "IL",
      "zipCode": "60601",
      "country": "USA"
    }
  },
  "parcelDetails": {
    "type": "electronics",
    "weight": 2.5,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 15
    },
    "description": "Laptop computer for delivery",
    "value": 1200
  },
  "deliveryInfo": {
    "preferredDeliveryDate": "2024-01-20T14:00:00.000Z",
    "deliveryInstructions": "Please ring the doorbell twice",
    "isUrgent": true
  }
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": null,
    "senderInfo": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "address": {
        "street": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      }
    },
    "receiverInfo": {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+0987654321",
      "address": {
        "street": "789 Pine Street",
        "city": "Chicago",
        "state": "IL",
        "zipCode": "60601",
        "country": "USA"
      }
    },
    "parcelDetails": {
      "type": "electronics",
      "weight": 2.5,
      "dimensions": {
        "length": 30,
        "width": 20,
        "height": 15
      },
      "description": "Laptop computer for delivery",
      "value": 1200
    },
    "deliveryInfo": {
      "preferredDeliveryDate": "2024-01-20T14:00:00.000Z",
      "deliveryInstructions": "Please ring the doorbell twice",
      "isUrgent": true
    },
    "currentStatus": "requested",
    "statusHistory": [
      {
        "status": "requested",
        "timestamp": "2024-01-15T10:45:00.000Z",
        "updatedBy": "507f1f77bcf86cd799439011",
        "note": "Parcel created"
      }
    ],
    "fee": {
      "baseFee": 50,
      "weightFee": 50,
      "urgentFee": 100,
      "totalFee": 200,
      "isPaid": false
    },
    "isFlagged": false,
    "isHeld": false,
    "isBlocked": false,
    "createdAt": "2024-01-15T10:45:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

**Error Responses:**

**403 - Only Senders Can Create Parcels:**

```json
{
  "statusCode": 403,
  "success": false,
  "message": "Only users with sender role can create parcels"
}
```

**400 - Receiver Not Found:**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation Error",
  "data": {
    "errors": [
      {
        "path": "receiverEmail",
        "message": "Receiver with this email does not exist"
      }
    ]
  }
}
```

**400 - Missing Required Field:**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation error",
  "errorSources": [
    {
      "path": ["receiverEmail"],
      "message": "Receiver email is required"
    }
  ]
}
```

**400 - Invalid Email Format:**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation error",
  "errorSources": [
    {
      "path": ["receiverEmail"],
      "message": "Please enter a valid email address"
    }
  ]
}
```

**400 - Invalid Receiver Role:**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Selected user is not registered as a receiver"
}
```

**400 - Blocked Receiver:**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "The receiver account is blocked and cannot receive parcels"
}
```

**400 - Cannot Send to Self:**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "You cannot send a parcel to yourself"
}
```

### 2. Track Parcel by Tracking ID (Public)

**GET** `/parcels/track/:trackingId`

Track a parcel using its tracking ID (no authentication required).

**Request Example:**

```
GET /parcels/track/TRK-20240115-ABC123
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel tracking information retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "currentStatus": "in-transit",
    "senderInfo": {
      "name": "John Doe",
      "city": "New York",
      "state": "NY"
    },
    "receiverInfo": {
      "name": "Jane Smith",
      "city": "Chicago",
      "state": "IL"
    },
    "parcelDetails": {
      "type": "electronics",
      "weight": 2.5,
      "description": "Laptop computer for delivery"
    },
    "deliveryInfo": {
      "isUrgent": true,
      "preferredDeliveryDate": "2024-01-20T14:00:00.000Z"
    },
    "statusHistory": [
      {
        "status": "requested",
        "timestamp": "2024-01-15T10:45:00.000Z",
        "note": "Parcel created"
      },
      {
        "status": "approved",
        "timestamp": "2024-01-15T11:00:00.000Z",
        "note": "Approved by admin"
      },
      {
        "status": "dispatched",
        "timestamp": "2024-01-15T12:00:00.000Z",
        "location": "New York Distribution Center",
        "note": "Parcel dispatched for delivery"
      },
      {
        "status": "in-transit",
        "timestamp": "2024-01-15T14:00:00.000Z",
        "location": "Highway 95, between NY and IL",
        "note": "In transit to Chicago"
      }
    ],
    "estimatedDelivery": "2024-01-17T16:00:00.000Z",
    "createdAt": "2024-01-15T10:45:00.000Z"
  }
}
```

### 3. Get My Parcels

**GET** `/parcels/me`

Get all parcels associated with the current user (sender or receiver).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `isUrgent` (optional): Filter by urgency (true/false)
- `startDate` (optional): Filter by creation date range
- `endDate` (optional): Filter by creation date range

**Request Example:**

```
GET /parcels/me?page=1&limit=5&status=in-transit&isUrgent=true
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcels retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-ABC123",
      "currentStatus": "in-transit",
      "receiverInfo": {
        "name": "Jane Smith",
        "email": "jane.smith@example.com"
      },
      "parcelDetails": {
        "type": "electronics",
        "weight": 2.5,
        "description": "Laptop computer for delivery"
      },
      "deliveryInfo": {
        "isUrgent": true
      },
      "fee": {
        "totalFee": 200,
        "isPaid": false
      },
      "createdAt": "2024-01-15T10:45:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1
  }
}
```

### 4. Get Parcel Status Log

**GET** `/parcels/:id/status-log`

Get the complete status history of a parcel.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel status log retrieved successfully",
  "data": {
    "trackingId": "TRK-20240115-ABC123",
    "statusHistory": [
      {
        "status": "requested",
        "timestamp": "2024-01-15T10:45:00.000Z",
        "updatedBy": "507f1f77bcf86cd799439011",
        "updatedByType": "sender",
        "note": "Parcel created"
      },
      {
        "status": "approved",
        "timestamp": "2024-01-15T11:00:00.000Z",
        "updatedBy": "admin",
        "updatedByType": "admin",
        "note": "Approved by admin for dispatch"
      },
      {
        "status": "dispatched",
        "timestamp": "2024-01-15T12:00:00.000Z",
        "updatedBy": "admin",
        "updatedByType": "admin",
        "location": "New York Distribution Center",
        "note": "Parcel dispatched for delivery"
      },
      {
        "status": "in-transit",
        "timestamp": "2024-01-15T14:00:00.000Z",
        "updatedBy": "admin",
        "updatedByType": "admin",
        "location": "Highway 95, between NY and IL",
        "note": "In transit to Chicago"
      }
    ]
  }
}
```

### 5. Cancel Parcel (Sender Only)

**PATCH** `/parcels/cancel/:id`

Cancel a parcel delivery request (only before dispatch).

**Headers:**

```
Authorization: Bearer <sender_access_token>
```

**Request Body:**

```json
{
  "note": "Customer requested cancellation"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel cancelled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "currentStatus": "cancelled",
    "statusHistory": [
      {
        "status": "requested",
        "timestamp": "2024-01-15T10:45:00.000Z",
        "updatedBy": "507f1f77bcf86cd799439011",
        "note": "Parcel created"
      },
      {
        "status": "cancelled",
        "timestamp": "2024-01-15T11:30:00.000Z",
        "updatedBy": "507f1f77bcf86cd799439011",
        "note": "Customer requested cancellation"
      }
    ],
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### 6. Confirm Delivery (Receiver Only)

**PATCH** `/parcels/:id/confirm-delivery`

Confirm that a parcel has been delivered (receiver only, when status is in-transit).

**Headers:**

```
Authorization: Bearer <receiver_access_token>
```

**Request Body:**

```json
{
  "note": "Package received in good condition"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Delivery confirmed successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "currentStatus": "delivered",
    "statusHistory": [
      {
        "status": "delivered",
        "timestamp": "2024-01-17T16:00:00.000Z",
        "updatedBy": "507f1f77bcf86cd799439013",
        "note": "Package received in good condition"
      }
    ],
    "updatedAt": "2024-01-17T16:00:00.000Z"
  }
}
```

---

## 👨‍💼 Admin-Only Endpoints

### 1. Get All Parcels (Admin Only)

**GET** `/parcels`

Get all parcels in the system with advanced filtering options.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**

- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of items per page (default: 10)
- `status` (string): Filter by parcel status (requested, approved, dispatched, in-transit, delivered, cancelled, returned)
- `isUrgent` (boolean): Filter by urgent delivery (true/false)
- `startDate` (ISO string): Filter parcels created after this date
- `endDate` (ISO string): Filter parcels created before this date
- `search` (string): Search in tracking ID, sender name, receiver name, or description
- `senderId` (string): Filter by specific sender ID
- `receiverId` (string): Filter by specific receiver ID
- `senderEmail` (string): Filter by sender email
- `receiverEmail` (string): Filter by receiver email
- `isFlagged` (boolean): Filter by flagged status (true/false)
- `isHeld` (boolean): Filter by held status (true/false)
- `isBlocked` (boolean): Filter by blocked status (true/false)

**Request Examples:**

```
# Get all in-transit urgent parcels
GET /parcels?status=in-transit&isUrgent=true

# Search for parcels containing "laptop"
GET /parcels?search=laptop

# Get parcels from specific date range
GET /parcels?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z

# Get flagged parcels only
GET /parcels?isFlagged=true

# Multiple filters with pagination
GET /parcels?page=2&limit=5&status=delivered&senderEmail=john@example.com
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcels retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-ABC123",
      "currentStatus": "in-transit",
      "senderInfo": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "receiverInfo": {
        "name": "Jane Smith",
        "email": "jane.smith@example.com"
      },
      "parcelDetails": {
        "type": "electronics",
        "weight": 2.5,
        "description": "Laptop computer for delivery"
      },
      "deliveryInfo": {
        "isUrgent": true
      },
      "fee": {
        "totalFee": 200,
        "isPaid": false
      },
      "assignedDeliveryPersonnel": "Mike Johnson",
      "isFlagged": false,
      "isHeld": false,
      "isBlocked": false,
      "createdAt": "2024-01-15T10:45:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 2. Get Parcel Statistics (Admin Only)

**GET** `/parcels/admin/stats`

Get comprehensive parcel statistics and analytics.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel statistics retrieved successfully",
  "data": {
    "totalParcels": 1250,
    "requested": 45,
    "approved": 23,
    "dispatched": 67,
    "inTransit": 89,
    "delivered": 980,
    "cancelled": 35,
    "returned": 11,
    "urgentParcels": 234,
    "blockedParcels": 8,
    "totalRevenue": 125000
  }
}
```

### 3. Update Parcel Status (Admin Only)

**PATCH** `/parcels/:id/status`

Update the status of a parcel with validation for proper workflow.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "status": "dispatched",
  "location": "Chicago Distribution Center",
  "note": "Parcel dispatched to Chicago facility"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "currentStatus": "dispatched",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### 4. Flag/Unflag Parcel (Admin Only)

**PATCH** `/parcels/:id/flag`

Flag or unflag a parcel for review or special attention.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "isFlagged": true,
  "note": "Parcel flagged for suspicious content"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel flagged successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "isFlagged": true,
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

### 5. Hold/Unhold Parcel (Admin Only)

**PATCH** `/parcels/:id/hold`

Put a parcel on hold or remove the hold status.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "isHeld": true,
  "note": "Parcel held pending investigation"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel held successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "isHeld": true,
    "updatedAt": "2024-01-15T14:30:00.000Z"
  }
}
```

### 6. Unblock Parcel (Admin Only)

**PATCH** `/parcels/:id/unblock`

Unblock a previously blocked parcel and restore normal operations.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "note": "Issue resolved, unblocking parcel"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel unblocked successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "isBlocked": false,
    "isFlagged": false,
    "isHeld": false,
    "updatedAt": "2024-01-15T15:00:00.000Z"
  }
}
```

### 7. Return Parcel (Admin Only)

**PATCH** `/parcels/:id/return`

Mark a parcel as returned to sender.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "note": "Undeliverable - incorrect address"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel marked as returned successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "currentStatus": "returned",
    "updatedAt": "2024-01-15T15:30:00.000Z"
  }
}
```

### 8. Assign Delivery Personnel (Admin Only)

**PATCH** `/parcels/:id/assign-personnel`

Assign delivery personnel to a parcel.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "deliveryPersonnel": "Mike Johnson - Driver ID: D12345"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Delivery personnel assigned successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "TRK-20240115-ABC123",
    "assignedDeliveryPersonnel": "Mike Johnson - Driver ID: D12345",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
```

### 9. Delete Parcel (Admin Only)

**DELETE** `/parcels/:id`

Permanently delete a parcel from the system.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel deleted successfully",
  "data": null
}
```

**Important Notes:**

- This action is irreversible
- Only use for test data or in extreme cases
- Consider archiving instead of deleting in production

---

## 🚫 Common Error Responses

### 400 - Bad Request (Validation Error)

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation error",
  "errorSources": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 - Unauthorized

```json
{
  "statusCode": 401,
  "success": false,
  "message": "Access token is required"
}
```

### 403 - Forbidden

```json
{
  "statusCode": 403,
  "success": false,
  "message": "Access denied: You can only view status logs of your own parcels"
}
```

### 404 - Not Found

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Parcel not found"
}
```

---

## 🔧 Testing Tools & Setup

### Recommended Tools

1. **Postman** - Full-featured GUI-based API testing
2. **Thunder Client** - VS Code extension for API testing
3. **Insomnia** - Beautiful REST client
4. **curl** - Command-line HTTP client

### Environment Setup

Create these environment variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parcel-delivery-test
JWT_SECRET=test-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
FRONTEND_URL=http://localhost:3000
```

### Sample Test Users

#### Admin User

```json
{
  "name": "Test Admin",
  "email": "admin@test.com",
  "password": "Admin123!",
  "phone": "+1000000000",
  "role": "admin",
  "address": {
    "street": "1 Admin Street",
    "city": "Admin City",
    "state": "AC",
    "zipCode": "00001",
    "country": "USA"
  }
}
```

#### Sender User

```json
{
  "name": "Test Sender",
  "email": "sender@test.com",
  "password": "Sender123!",
  "phone": "+1111111111",
  "role": "sender",
  "address": {
    "street": "2 Sender Street",
    "city": "Sender City",
    "state": "SC",
    "zipCode": "11111",
    "country": "USA"
  }
}
```

#### Receiver User

```json
{
  "name": "Test Receiver",
  "email": "receiver@test.com",
  "password": "Receiver123!",
  "phone": "+1222222222",
  "role": "receiver",
  "address": {
    "street": "3 Receiver Street",
    "city": "Receiver City",
    "state": "RC",
    "zipCode": "22222",
    "country": "USA"
  }
}
```

### Health Check

Start testing by verifying the server:

**GET** `/health`

```json
{
  "success": true,
  "message": "Parcel Delivery API is running successfully",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

## 🧪 Testing Scenarios

### Authentication Flow Testing

1. **Registration Testing**

   - Valid registration with all required fields
   - Invalid email format
   - Weak password
   - Missing required fields
   - Duplicate email registration

2. **Login Testing**

   - Valid credentials
   - Invalid email
   - Invalid password
   - Blocked user login attempt

3. **Token Management**
   - Token refresh with valid refresh token
   - Token refresh with expired refresh token
   - Accessing protected routes without token
   - Accessing protected routes with expired token

### Role-Based Access Testing

1. **Sender Operations**

   - Create parcel with valid data
   - Cancel own parcel before dispatch
   - Attempt to cancel dispatched parcel
   - View own parcels only
   - Attempt admin operations (should fail)

2. **Receiver Operations**

   - View parcels addressed to them
   - Confirm delivery of in-transit parcel
   - Attempt to confirm non-existent parcel
   - Attempt sender operations (should fail)

3. **Admin Operations**
   - View all users and parcels
   - Update parcel status
   - Block/unblock users and parcels
   - Flag/hold parcels
   - Access statistics

### Data Validation Testing

1. **Parcel Creation**

   - Valid parcel with all optional fields
   - Missing required fields
   - Invalid weight (negative, zero, over limit)
   - Invalid dimensions
   - Future date validation for delivery

2. **Status Updates**
   - Valid status transitions
   - Invalid status transitions
   - Status updates on flagged/held parcels

### Error Handling Testing

1. **Invalid IDs**

   - Non-existent parcel IDs
   - Malformed ObjectIDs
   - Invalid tracking ID format

2. **Permission Errors**
   - Cross-user access attempts
   - Wrong role access attempts
   - Blocked user operations

---

## 📊 Testing Checklist

### ✅ Basic Functionality

- [ ] User registration with all roles
- [ ] User login and logout
- [ ] Token refresh mechanism
- [ ] Parcel creation and tracking
- [ ] Status workflow compliance
- [ ] Public tracking functionality

### ✅ Security Testing

- [ ] JWT token validation
- [ ] Role-based access control
- [ ] Resource ownership validation
- [ ] Input sanitization
- [ ] Error message security

### ✅ Edge Cases

- [ ] Extremely long input values
- [ ] Special characters in inputs
- [ ] Concurrent operations
- [ ] Large file uploads (if applicable)
- [ ] Rate limiting (if implemented)

### ✅ Performance Testing

- [ ] Response times under load
- [ ] Database query performance
- [ ] Pagination efficiency
- [ ] Search functionality performance

---

**Happy Testing! 🚀**

For any issues or questions, please refer to the main [README.md](./README.md) or contact the development team.
