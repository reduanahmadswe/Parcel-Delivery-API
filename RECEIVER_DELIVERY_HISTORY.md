# Receiver Delivery History Testing Guide

## Overview

This document verifies that receivers can properly access their delivery history through the available API endpoints.

## Available Endpoints for Receivers

### 1. Get My Parcels (Delivery History)

**GET** `/parcels/me`

**Headers:**

```
Authorization: Bearer <receiver_access_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (requested, approved, dispatched, in-transit, delivered, cancelled, returned)
- `isUrgent` (optional): Filter by urgency (true/false)
- `startDate` (optional): Filter by creation date range (ISO string)
- `endDate` (optional): Filter by creation date range (ISO string)

**Example Request:**

```
GET /api/parcels/me?page=1&limit=10&status=delivered
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcels retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "TRK-20250801-ABC123",
      "senderId": "507f1f77bcf86cd799439011",
      "receiverId": "507f1f77bcf86cd799439013",
      "senderInfo": {
        "name": "John Sender",
        "email": "sender@example.com",
        "phone": "+8801700001001",
        "address": {
          "street": "123 Sender Street",
          "city": "Dhaka",
          "state": "Dhaka Division",
          "zipCode": "1000",
          "country": "Bangladesh"
        }
      },
      "receiverInfo": {
        "name": "Jane Receiver",
        "email": "receiver@example.com",
        "phone": "+8801700004002",
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
      },
      "currentStatus": "delivered",
      "statusHistory": [
        {
          "status": "requested",
          "timestamp": "2025-08-01T10:00:00.000Z",
          "updatedBy": "507f1f77bcf86cd799439011",
          "updatedByType": "sender",
          "note": "Parcel created"
        },
        {
          "status": "approved",
          "timestamp": "2025-08-01T11:00:00.000Z",
          "updatedBy": "admin",
          "updatedByType": "admin",
          "note": "Approved for dispatch"
        },
        {
          "status": "dispatched",
          "timestamp": "2025-08-01T12:00:00.000Z",
          "updatedBy": "admin",
          "updatedByType": "admin",
          "location": "Dhaka Distribution Center",
          "note": "Parcel dispatched for delivery"
        },
        {
          "status": "in-transit",
          "timestamp": "2025-08-02T09:00:00.000Z",
          "updatedBy": "admin",
          "updatedByType": "admin",
          "location": "Highway to Chittagong",
          "note": "In transit to destination"
        },
        {
          "status": "delivered",
          "timestamp": "2025-08-05T14:30:00.000Z",
          "updatedBy": "507f1f77bcf86cd799439013",
          "updatedByType": "receiver",
          "note": "Package received in good condition"
        }
      ],
      "fee": {
        "baseFee": 50,
        "weightFee": 50,
        "urgentFee": 0,
        "totalFee": 100,
        "isPaid": true
      },
      "isFlagged": false,
      "isHeld": false,
      "isBlocked": false,
      "createdAt": "2025-08-01T10:00:00.000Z",
      "updatedAt": "2025-08-05T14:30:00.000Z"
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

### 2. Get Specific Parcel Details

**GET** `/parcels/:id`

**Headers:**

```
Authorization: Bearer <receiver_access_token>
```

**Example Request:**

```
GET /api/parcels/507f1f77bcf86cd799439012
```

### 3. Get Parcel Status History

**GET** `/parcels/:id/status-log`

**Headers:**

```
Authorization: Bearer <receiver_access_token>
```

**Example Request:**

```
GET /api/parcels/507f1f77bcf86cd799439012/status-log
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel status log retrieved successfully",
  "data": {
    "trackingId": "TRK-20250801-ABC123",
    "statusHistory": [
      {
        "status": "requested",
        "timestamp": "2025-08-01T10:00:00.000Z",
        "updatedBy": "507f1f77bcf86cd799439011",
        "updatedByType": "sender",
        "note": "Parcel created"
      },
      {
        "status": "approved",
        "timestamp": "2025-08-01T11:00:00.000Z",
        "updatedBy": "admin",
        "updatedByType": "admin",
        "note": "Approved for dispatch"
      },
      {
        "status": "dispatched",
        "timestamp": "2025-08-01T12:00:00.000Z",
        "updatedBy": "admin",
        "updatedByType": "admin",
        "location": "Dhaka Distribution Center",
        "note": "Parcel dispatched for delivery"
      },
      {
        "status": "in-transit",
        "timestamp": "2025-08-02T09:00:00.000Z",
        "updatedBy": "admin",
        "updatedByType": "admin",
        "location": "Highway to Chittagong",
        "note": "In transit to destination"
      },
      {
        "status": "delivered",
        "timestamp": "2025-08-05T14:30:00.000Z",
        "updatedBy": "507f1f77bcf86cd799439013",
        "updatedByType": "receiver",
        "note": "Package received in good condition"
      }
    ]
  }
}
```

### 4. Confirm Delivery

**PATCH** `/parcels/:id/confirm-delivery`

**Headers:**

```
Authorization: Bearer <receiver_access_token>
```

**Request Body:**

```json
{
  "note": "Package received in excellent condition"
}
```

### 5. Public Tracking (No Authentication Required)

**GET** `/parcels/track/:trackingId`

**Example Request:**

```
GET /api/parcels/track/TRK-20250801-ABC123
```

## Testing Scenarios

### 1. Test Receiver Can View All Their Parcels

```bash
# Login as receiver first
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "receiver@example.com",
    "password": "Receiver123!"
  }'

# Use the token to get parcels
curl -X GET "http://localhost:5000/api/parcels/me" \
  -H "Authorization: Bearer <receiver_access_token>"
```

### 2. Test Filtering by Status

```bash
# Get only delivered parcels
curl -X GET "http://localhost:5000/api/parcels/me?status=delivered" \
  -H "Authorization: Bearer <receiver_access_token>"

# Get in-transit parcels
curl -X GET "http://localhost:5000/api/parcels/me?status=in-transit" \
  -H "Authorization: Bearer <receiver_access_token>"
```

### 3. Test Date Range Filtering

```bash
# Get parcels from specific date range
curl -X GET "http://localhost:5000/api/parcels/me?startDate=2025-08-01T00:00:00.000Z&endDate=2025-08-31T23:59:59.999Z" \
  -H "Authorization: Bearer <receiver_access_token>"
```

### 4. Test Pagination

```bash
# Get first page with 5 items
curl -X GET "http://localhost:5000/api/parcels/me?page=1&limit=5" \
  -H "Authorization: Bearer <receiver_access_token>"
```

### 5. Test Access Control

```bash
# Receiver should NOT be able to see other receivers' parcels
curl -X GET "http://localhost:5000/api/parcels/507f1f77bcf86cd799439999" \
  -H "Authorization: Bearer <receiver_access_token>"
# Should return 403 or 404 if not their parcel
```

## Expected Behavior

### ✅ What Receivers CAN Do:

- View all parcels addressed to their email
- See complete delivery history with timestamps
- Filter parcels by status, date range, urgency
- View detailed parcel information
- See sender information
- Confirm delivery when parcel is in-transit
- Track parcels using public tracking (no auth needed)

### ❌ What Receivers CANNOT Do:

- View other receivers' parcels
- Create new parcels
- Cancel parcels
- Update parcel status (except confirming delivery)
- Access admin functions
- View parcels not addressed to them

## Database Query Verification

The system uses email-based filtering for receivers:

```javascript
// In ParcelService.getUserParcels()
if (userRole === "receiver") {
  filter["receiverInfo.email"] = userEmail;
}
```

This ensures receivers only see parcels where `receiverInfo.email` matches their authenticated email address.

## Security Considerations

1. **Authentication Required**: All endpoints except public tracking require valid JWT token
2. **Role-Based Access**: Only users with 'receiver' role can access receiver endpoints
3. **Email-Based Filtering**: Receivers can only see parcels addressed to their email
4. **Resource Ownership**: Receivers cannot access other users' parcels
5. **Input Validation**: All requests are validated using Zod schemas

## Common Issues and Solutions

### Issue: Receiver not seeing their parcels

**Solution**: Ensure the receiver's email in the JWT token matches the `receiverInfo.email` in the parcel documents.

### Issue: 403 Forbidden error

**Solution**: Verify the user has the 'receiver' role and is using a valid JWT token.

### Issue: Empty results

**Solution**: Check if parcels exist with the receiver's email and verify the email matching logic.

## Performance Considerations

- Parcels are indexed by `receiverInfo.email` for efficient filtering
- Pagination prevents large data loads
- Status filtering uses indexed `currentStatus` field
- Date filtering uses indexed `createdAt` field

This comprehensive delivery history system ensures receivers have complete visibility into their parcel deliveries while maintaining security and performance.
