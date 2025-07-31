# Parcel Creation Examples

This document provides comprehensive examples of how to create parcels in the Parcel Delivery System.

## Prerequisites

1. The sender must have a valid account with role 'sender'
2. The receiver must have a valid account in the system
3. The sender must be authenticated (have a valid JWT token)

## Business Rules

1. **Role Validation**: Only users with 'sender' role can create parcels
2. **Receiver Validation**: The receiver must exist in the database
3. **Account Status**: Neither sender nor receiver can be blocked
4. **Self-Send Prevention**: Users cannot send parcels to themselves
5. **Fee Calculation**: Automatic calculation based on weight and urgency

## Implementation Overview

### Key Security Features

```typescript
// 1. Sender Role Validation
if (sender.role !== "sender") {
  throw new AppError("Only users with sender role can create parcels", 403);
}

// 2. Sender Account Status Check
if (sender.isBlocked) {
  throw new AppError("Your account is blocked and cannot create parcels", 403);
}

// 3. Receiver Existence Validation
if (!receiver) {
  throw new AppError(
    `Receiver not found. Please ensure the receiver has a valid account.`,
    404
  );
}

// 4. Receiver Account Status Check
if (receiver.isBlocked) {
  throw new AppError(
    "The receiver account is blocked and cannot receive parcels",
    400
  );
}

// 5. Self-Send Prevention
if (receiver._id.toString() === senderId.toString()) {
  throw new AppError("You cannot send a parcel to yourself", 400);
}
```

### Database Transaction

The parcel creation uses MongoDB transactions to ensure data consistency:

```typescript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All database operations happen within this transaction
  // If any operation fails, the entire transaction is rolled back

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## API Usage Examples

### Method 1: Using Receiver ID (Recommended)

```bash
curl -X POST http://localhost:5000/api/parcels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SENDER_TOKEN" \
  -d '{
    "receiverId": "60f1b9b9e1b9c8001f5e4b8a",
    "parcelDetails": {
      "type": "electronics",
      "weight": 2.5,
      "description": "MacBook Pro laptop",
      "value": 1500
    },
    "deliveryInfo": {
      "isUrgent": true,
      "deliveryInstructions": "Handle with care"
    }
  }'
```

### Method 2: Using Receiver Email

```bash
curl -X POST http://localhost:5000/api/parcels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SENDER_TOKEN" \
  -d '{
    "receiverInfo": {
      "name": "John Receiver",
      "email": "john.receiver@example.com",
      "phone": "+1234567890",
      "address": {
        "street": "456 Oak Avenue",
        "city": "Boston",
        "state": "MA",
        "zipCode": "02101",
        "country": "USA"
      }
    },
    "parcelDetails": {
      "type": "document",
      "weight": 0.5,
      "description": "Important legal documents"
    },
    "deliveryInfo": {
      "isUrgent": false,
      "preferredDeliveryDate": "2024-02-01T10:00:00.000Z"
    }
  }'
```

## Error Handling Scenarios

### 1. Non-Sender User Attempt

```json
{
  "error": {
    "statusCode": 403,
    "message": "Only users with sender role can create parcels"
  }
}
```

### 2. Receiver Not Found

```json
{
  "error": {
    "statusCode": 404,
    "message": "Receiver with email unknown@example.com not found. Please ensure the receiver has a valid account."
  }
}
```

### 3. Blocked Sender Account

```json
{
  "error": {
    "statusCode": 403,
    "message": "Your account is blocked and cannot create parcels"
  }
}
```

### 4. Blocked Receiver Account

```json
{
  "error": {
    "statusCode": 400,
    "message": "The receiver account is blocked and cannot receive parcels"
  }
}
```

### 5. Self-Send Attempt

```json
{
  "error": {
    "statusCode": 400,
    "message": "You cannot send a parcel to yourself"
  }
}
```

## Fee Calculation Logic

The system automatically calculates fees based on:

```typescript
const baseFee = 50; // BDT base fee for all parcels
const weightFee = Math.ceil(parcelData.parcelDetails.weight) * 20; // 20 BDT per kg
const urgentFee = parcelData.deliveryInfo.isUrgent ? 100 : 0; // 100 BDT for urgent delivery
const totalFee = baseFee + weightFee + urgentFee;
```

### Fee Examples

| Weight | Urgent | Base Fee | Weight Fee | Urgent Fee | Total   |
| ------ | ------ | -------- | ---------- | ---------- | ------- |
| 1.2 kg | No     | 50 BDT   | 40 BDT     | 0 BDT      | 90 BDT  |
| 2.7 kg | Yes    | 50 BDT   | 60 BDT     | 100 BDT    | 210 BDT |
| 0.5 kg | No     | 50 BDT   | 20 BDT     | 0 BDT      | 70 BDT  |

## Best Practices

1. **Always validate receiver existence** before allowing parcel creation
2. **Use receiver ID when possible** for better performance
3. **Implement proper error handling** for all validation scenarios
4. **Use database transactions** to ensure data consistency
5. **Validate user roles** before processing requests
6. **Check account status** for both sender and receiver
7. **Prevent self-sending** to avoid logical errors
8. **Calculate fees automatically** to ensure consistency

## Testing Checklist

- [ ] Sender can create parcel with valid receiver ID
- [ ] Sender can create parcel with valid receiver email
- [ ] Non-sender users cannot create parcels
- [ ] Cannot create parcel with non-existent receiver
- [ ] Cannot create parcel with blocked receiver
- [ ] Cannot create parcel when sender is blocked
- [ ] Cannot create parcel to self
- [ ] Fee calculation works correctly
- [ ] Tracking ID is generated uniquely
- [ ] Status history is initialized properly
- [ ] Database transaction rollback works on errors
