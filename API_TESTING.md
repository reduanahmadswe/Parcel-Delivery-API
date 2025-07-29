# 🧪 API Testing Guide

This guide provides comprehensive examples for testing all API endpoints in the Parcel Delivery System. All examples use standard HTTP methods and can be tested with tools like Postman, Thunder Client, or curl.

## 🚀 Base URL

```
http://localhost:5000/api
```

## 🔐 Authentication

The API uses JWT-based authentication with dual token system:

- **Access Token**: 15 minutes expiry (for API requests)
- **Refresh Token**: 7 days expiry (for token renewal)

Both tokens are stored as HTTP-only cookies for security.

---

## 👤 Authentication Endpoints

### 1. User Registration

**POST** `/auth/register`

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
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
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
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
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 2. User Login

**POST** `/auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
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

**POST** `/auth/refresh`

_No body required - uses refresh token from HTTP-only cookie_

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

### 4. Logout

**POST** `/auth/logout`

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 5. Get Current User Profile

**GET** `/auth/me`

_Requires Authentication_

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
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
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 👥 User Management Endpoints

### 1. Get All Users (Admin Only)

**GET** `/users?page=1&limit=10&role=sender&search=john`

_Requires Admin Authentication_

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (sender/receiver/admin)
- `search` (optional): Search by name or email

**Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [
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
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalUsers": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### 2. Get User by ID (Admin Only)

**GET** `/users/507f1f77bcf86cd799439011`

_Requires Admin Authentication_

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
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
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 3. Update User (Admin Only)

**PUT** `/users/507f1f77bcf86cd799439011`

_Requires Admin Authentication_

```json
{
  "name": "John Smith",
  "phone": "+1234567891",
  "address": {
    "street": "456 Oak Avenue",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "country": "USA"
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "senderId": "507f1f77bcf86cd799439011",
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
        "description": "Laptop computer",
        "value": 1200
      },
      "deliveryInfo": {
        "preferredDeliveryDate": "2024-01-20T00:00:00.000Z",
        "deliveryInstructions": "Ring doorbell twice",
        "isUrgent": false
      },
      "fee": {
        "baseFee": 10,
        "weightFee": 2.5,
        "urgentFee": 0,
        "totalFee": 12.5,
        "isPaid": false,
        "paymentMethod": "cash"
      },
      "currentStatus": "requested",
      "statusHistory": [
        {
          "status": "requested",
          "timestamp": "2024-01-15T10:30:00.000Z",
          "location": "New York, NY",
          "notes": "Parcel request submitted"
        }
      ],
      "isBlocked": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 2. Get All Parcels

**GET** `/parcels?page=1&limit=10&status=requested&search=TRK-20240115`

_Requires Authentication (Access level varies by role)_

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `search` (optional): Search by tracking ID
- `startDate` (optional): Filter by creation date (from)
- `endDate` (optional): Filter by creation date (to)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "parcels": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "trackingId": "TRK-20240115-001234",
        "senderInfo": {
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "receiverInfo": {
          "name": "Jane Smith",
          "email": "jane.smith@example.com"
        },
        "currentStatus": "requested",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "fee": {
          "totalFee": 12.5,
          "isPaid": false
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalParcels": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### 3. Get Parcel by ID

**GET** `/parcels/507f1f77bcf86cd799439012`

_Requires Authentication_

**Response (200):**

```json
{
  "success": true,
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "senderId": "507f1f77bcf86cd799439011",
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
        "description": "Laptop computer",
        "value": 1200
      },
      "deliveryInfo": {
        "preferredDeliveryDate": "2024-01-20T00:00:00.000Z",
        "deliveryInstructions": "Ring doorbell twice",
        "isUrgent": false
      },
      "fee": {
        "baseFee": 10,
        "weightFee": 2.5,
        "urgentFee": 0,
        "totalFee": 12.5,
        "isPaid": false,
        "paymentMethod": "cash"
      },
      "currentStatus": "requested",
      "statusHistory": [
        {
          "status": "requested",
          "timestamp": "2024-01-15T10:30:00.000Z",
          "location": "New York, NY",
          "notes": "Parcel request submitted"
        }
      ],
      "isBlocked": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 4. Track Parcel by Tracking ID

**GET** `/parcels/track/TRK-20240115-001234`

_Public endpoint - No authentication required_

**Response (200):**

```json
{
  "success": true,
  "data": {
    "parcel": {
      "trackingId": "TRK-20240115-001234",
      "currentStatus": "in-transit",
      "statusHistory": [
        {
          "status": "requested",
          "timestamp": "2024-01-15T10:30:00.000Z",
          "location": "New York, NY",
          "notes": "Parcel request submitted"
        },
        {
          "status": "approved",
          "timestamp": "2024-01-15T11:00:00.000Z",
          "location": "New York, NY",
          "notes": "Parcel approved for shipment"
        },
        {
          "status": "dispatched",
          "timestamp": "2024-01-15T14:00:00.000Z",
          "location": "New York Distribution Center",
          "notes": "Parcel dispatched from origin"
        },
        {
          "status": "in-transit",
          "timestamp": "2024-01-16T09:00:00.000Z",
          "location": "Chicago Distribution Center",
          "notes": "Parcel in transit to destination"
        }
      ],
      "estimatedDelivery": "2024-01-18T00:00:00.000Z"
    }
  }
}
```

### 5. Update Parcel Status (Admin Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/status`

_Requires Admin Authentication_

```json
{
  "status": "approved",
  "location": "New York, NY",
  "notes": "Parcel approved for shipment"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel status updated successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "currentStatus": "approved",
      "statusHistory": [
        {
          "status": "requested",
          "timestamp": "2024-01-15T10:30:00.000Z",
          "location": "New York, NY",
          "notes": "Parcel request submitted"
        },
        {
          "status": "approved",
          "timestamp": "2024-01-15T11:00:00.000Z",
          "location": "New York, NY",
          "notes": "Parcel approved for shipment"
        }
      ]
    }
  }
}
```

### 6. Cancel Parcel (Sender Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/cancel`

_Requires Sender Authentication (Only if status is 'requested')_

```json
{
  "reason": "Changed delivery address"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel cancelled successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "currentStatus": "cancelled",
      "statusHistory": [
        {
          "status": "requested",
          "timestamp": "2024-01-15T10:30:00.000Z",
          "location": "New York, NY",
          "notes": "Parcel request submitted"
        },
        {
          "status": "cancelled",
          "timestamp": "2024-01-15T11:30:00.000Z",
          "location": "New York, NY",
          "notes": "Cancelled by sender: Changed delivery address"
        }
      ]
    }
  }
}
```

### 7. Confirm Delivery (Receiver Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/deliver`

_Requires Receiver Authentication (Only if status is 'delivered')_

```json
{
  "deliveryNotes": "Package received in good condition",
  "rating": 5
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Delivery confirmed successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "currentStatus": "delivered",
      "deliveryConfirmation": {
        "confirmedAt": "2024-01-18T15:30:00.000Z",
        "notes": "Package received in good condition",
        "rating": 5
      }
    }
  }
}
```

### 8. Assign Delivery Personnel (Admin Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/assign`

_Requires Admin Authentication_

```json
{
  "deliveryPersonnel": "John Driver",
  "notes": "Assigned to experienced driver for electronics delivery"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Delivery personnel assigned successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "assignedDeliveryPersonnel": "John Driver",
      "statusHistory": [
        {
          "status": "personnel-assigned",
          "timestamp": "2024-01-16T10:00:00.000Z",
          "location": "Distribution Center",
          "notes": "Assigned to experienced driver for electronics delivery"
        }
      ]
    }
  }
}
```

### 9. Block/Unblock Parcel (Admin Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/block`

_Requires Admin Authentication_

```json
{
  "isBlocked": true,
  "reason": "Suspicious package contents"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel blocked successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "isBlocked": true,
      "blockReason": "Suspicious package contents"
    }
  }
}
```

### 10. Delete Parcel (Admin Only)

**DELETE** `/parcels/507f1f77bcf86cd799439012`

_Requires Admin Authentication_

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel deleted successfully"
}
```

### 11. Flag/Unflag Parcel (Admin Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/flag`

_Requires Admin Authentication_

```json
{
  "isFlagged": true,
  "note": "Suspicious parcel contents detected"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel flagged successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "isFlagged": true,
      "statusHistory": [
        {
          "status": "flagged",
          "timestamp": "2024-01-16T10:00:00.000Z",
          "updatedBy": "admin_id",
          "note": "Suspicious parcel contents detected"
        }
      ]
    }
  }
}
```

### 12. Hold/Unhold Parcel (Admin Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/hold`

_Requires Admin Authentication_

```json
{
  "isHeld": true,
  "note": "Holding parcel for further inspection"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel held successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "isHeld": true,
      "statusHistory": [
        {
          "status": "held",
          "timestamp": "2024-01-16T10:00:00.000Z",
          "updatedBy": "admin_id",
          "note": "Holding parcel for further inspection"
        }
      ]
    }
  }
}
```

### 13. Unblock Parcel (Admin Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/unblock`

_Requires Admin Authentication_

```json
{
  "note": "All issues resolved, parcel cleared for delivery"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel unblocked successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "isBlocked": false,
      "isFlagged": false,
      "isHeld": false,
      "statusHistory": [
        {
          "status": "unblocked",
          "timestamp": "2024-01-16T11:00:00.000Z",
          "updatedBy": "admin_id",
          "note": "All issues resolved, parcel cleared for delivery"
        }
      ]
    }
  }
}
```

### 14. Return Parcel (Admin Only)

**PATCH** `/parcels/507f1f77bcf86cd799439012/return`

_Requires Admin Authentication_

**Request Body (Optional):**

```json
{
  "note": "Receiver was unavailable for delivery"
}
```

**Note:** The request body is optional. If no body is provided, a default note "Parcel returned" will be used.

**Example without body:**

```bash
curl -X PATCH http://localhost:5000/api/parcels/6887d7e57f6b918d0ed42d44/return \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Example with body:**

```bash
curl -X PATCH http://localhost:5000/api/parcels/6887d7e57f6b918d0ed42d44/return \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{"note": "Receiver was unavailable for delivery"}'
```

**Response (200):**

```json
{
  "success": true,
  "message": "Parcel marked as returned successfully",
  "data": {
    "parcel": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20240115-001234",
      "currentStatus": "returned",
      "statusHistory": [
        {
          "status": "returned",
          "timestamp": "2024-01-16T12:00:00.000Z",
          "updatedBy": "admin_id",
          "note": "Receiver was unavailable for delivery"
        }
      ]
    }
  }
}
```

---

## 📊 Statistics & Reports (Admin Only)

### 1. Dashboard Statistics

**GET** `/parcels/stats/dashboard`

_Requires Admin Authentication_

**Response (200):**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalParcels": 150,
      "totalUsers": 45,
      "totalRevenue": 2500.75,
      "statusBreakdown": {
        "requested": 15,
        "approved": 10,
        "dispatched": 8,
        "in-transit": 12,
        "delivered": 98,
        "cancelled": 7
      },
      "recentActivity": [
        {
          "type": "parcel_created",
          "message": "New parcel TRK-20240115-001234 created",
          "timestamp": "2024-01-15T10:30:00.000Z"
        },
        {
          "type": "user_registered",
          "message": "New user John Doe registered",
          "timestamp": "2024-01-15T10:15:00.000Z"
        }
      ]
    }
  }
}
```

---

## 🚨 Error Responses

### Common Error Codes

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Access denied. Please authenticate."
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Resource not found"
}
```

**409 Conflict:**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔧 Testing Tools

### Recommended Testing Tools

1. **Postman** - GUI-based API testing
2. **Thunder Client** - VS Code extension for API testing
3. **Insomnia** - REST client with beautiful interface
4. **curl** - Command-line HTTP client

### Environment Variables for Testing

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parcel-delivery
JWT_ACCESS_SECRET=your-super-secret-access-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Test Data Setup

Use the registration endpoint to create test users with different roles:

1. **Admin User**: `role: "admin"`
2. **Sender User**: `role: "sender"`
3. **Receiver User**: `role: "receiver"`

---

## 📝 Notes

- All endpoints that require authentication need valid JWT tokens in HTTP-only cookies
- Timestamps are in ISO 8601 format (UTC)
- All monetary values are in USD
- Phone numbers should include country codes
- Tracking IDs follow the format: `TRK-YYYYMMDD-XXXXXX`
- Status transitions follow a specific workflow: `requested → approved → dispatched → in-transit → delivered`
- Only certain operations are allowed based on user roles and parcel status
- **Parcel Hold System**: Held parcels cannot proceed to next status until unheld by admin
- **Parcel Flag System**: Flagged parcels are marked as suspicious for admin review
- **Parcel Return System**: Returned parcels cannot be cancelled by sender or confirmed by receiver
- **Status Restrictions**: Blocked or held parcels cannot have their status updated until unblocked/unheld
- **Return Restrictions**: Once marked as returned, only admin can re-dispatch the parcel
- **Admin Override**: Only admins can flag, hold, unblock, or return parcels

---

_For detailed API documentation and project setup, see [README.md](README.md)_
"\_id": "507f1f77bcf86cd799439011",
"isBlocked": true
}
}
}

````

### 5. Delete User (Admin Only)

**DELETE** `/users/507f1f77bcf86cd799439011`

*Requires Admin Authentication*

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
````

---

## 📦 Parcel Management Endpoints

### 1. Create Parcel (Sender Only)

**POST** `/parcels`

_Requires Sender Authentication_

```json
{
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
    "description": "Laptop computer",
    "value": 1200
  },
  "deliveryInfo": {
    "preferredDeliveryDate": "2024-01-20T00:00:00.000Z",
    "deliveryInstructions": "Ring doorbell twice",
    "isUrgent": false
  }
}
      "zipCode": "4000",
      "country": "Bangladesh"
    }
  }'
```

## 4. Login as Sender

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sender@example.com",
    "password": "password123"
  }'
```

## 5. Create a Parcel (Sender)

**Note:** You need to login first to get the JWT token, then use it in the Authorization header.

### PowerShell Command:

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/parcels" -Method POST `
  -Headers @{
    "Content-Type"="application/json"
    "Authorization"="Bearer YOUR_JWT_TOKEN"
  } `
  -Body '{
    "receiverInfo": {
      "name": "Jane Receiver",
      "email": "receiver@example.com",
      "phone": "+8801700000002",
      "address": {
        "street": "456 Receiver Avenue",
        "city": "Chittagong",
        "state": "Chittagong Division",
        "zipCode": "4000",
        "country": "Bangladesh"
      }
    },
    "parcelDetails": {
      "type": "package",
      "weight": 2.5,
      "dimensions": {
        "length": 30,
        "width": 20,
        "height": 15
      },
      "description": "Electronics and accessories",
      "value": 5000
    },
    "deliveryInfo": {
      "preferredDeliveryDate": "2025-08-05T10:00:00.000Z",
      "deliveryInstructions": "Please call before delivery",
      "isUrgent": false
    }
  }' | Select-Object -ExpandProperty Content
```

### cURL Command:

```bash
curl -X POST http://localhost:5000/api/parcels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "receiverInfo": {
      "name": "Jane Receiver",
      "email": "receiver@example.com",
      "phone": "+8801700000002",
      "address": {
        "street": "456 Receiver Avenue",
        "city": "Chittagong",
        "state": "Chittagong Division",
        "zipCode": "4000",
        "country": "Bangladesh"
      }
    },
    "parcelDetails": {
      "type": "package",
      "weight": 2.5,
      "dimensions": {
        "length": 30,
        "width": 20,
        "height": 15
      },
      "description": "Electronics and accessories",
      "value": 5000
    },
    "deliveryInfo": {
      "preferredDeliveryDate": "2025-08-05T10:00:00.000Z",
      "deliveryInstructions": "Please call before delivery",
      "isUrgent": false
    }
  }'
```

### Expected Response:

```json
{
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "trackingId": "TRK-20250728-XXXXXX",
    "senderId": "user_id_here",
    "receiverId": "receiver_id_here",
    "senderInfo": { ... },
    "receiverInfo": { ... },
    "parcelDetails": { ... },
    "deliveryInfo": { ... },
    "fee": {
      "baseFee": 50,
      "weightFee": 50,
      "urgentFee": 0,
      "totalFee": 100,
      "isPaid": false
    },
    "currentStatus": "requested",
    "statusHistory": [
      {
        "status": "requested",
        "timestamp": "2025-07-28T13:24:57.189Z",
        "updatedBy": "sender_id",
        "note": "Parcel created and requested for delivery"
      }
    ]
  }
}
```

## 6. Track Parcel (Public)

**Note:** This endpoint doesn't require authentication and can be accessed by anyone with the tracking ID.

### PowerShell Command:

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/parcels/track/TRK-20250728-POXPSW" -Method GET | Select-Object -ExpandProperty Content
```

### cURL Command:

```bash
curl -X GET http://localhost:5000/api/parcels/track/TRK-20250728-POXPSW
```

### Expected Response:

```json
{
  "success": true,
  "message": "Parcel tracking information retrieved successfully",
  "data": {
    "trackingId": "TRK-20250728-POXPSW",
    "currentStatus": "requested",
    "senderInfo": { ... },
    "receiverInfo": { ... },
    "parcelDetails": { ... },
    "deliveryInfo": { ... },
    "fee": { ... },
    "statusHistory": [
      {
        "status": "requested",
        "timestamp": "2025-07-28T13:24:57.189Z",
        "updatedBy": "sender_id",
        "note": "Parcel created and requested for delivery"
      }
    ]
  }
}
```

## 7. Get My Parcels (Sender/Receiver)

```bash
curl -X GET http://localhost:5000/api/parcels/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 8. Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@parceldelivery.com",
    "password": "Admin123!"
  }'
```

## 9. Update Parcel Status (Admin)

```bash
curl -X PATCH http://localhost:5000/api/parcels/PARCEL_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "status": "approved",
    "location": "Dhaka Hub",
    "note": "Parcel approved and ready for dispatch"
  }'
```

## 10. Get All Users (Admin)

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 11. Get Parcel Statistics (Admin)

```bash
curl -X GET http://localhost:5000/api/parcels/admin/stats \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 12. Cancel Parcel (Sender)

```bash
curl -X PATCH http://localhost:5000/api/parcels/PARCEL_ID/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SENDER_JWT_TOKEN" \
  -d '{
    "note": "Changed my mind about delivery"
  }'
```

## 13. Confirm Delivery (Receiver)

```bash
curl -X PATCH http://localhost:5000/api/parcels/PARCEL_ID/confirm-delivery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RECEIVER_JWT_TOKEN" \
  -d '{
    "note": "Package received in good condition"
  }'
```

## Notes:

- Replace `YOUR_JWT_TOKEN`, `ADMIN_JWT_TOKEN`, `SENDER_JWT_TOKEN`, `RECEIVER_JWT_TOKEN` with actual tokens from login responses
- Replace `PARCEL_ID` with actual parcel IDs from create/list responses
- Replace tracking IDs with actual tracking IDs from parcel creation responses
- The server should be running on `http://localhost:5000`
