# Receiver Information Implementation Guide

## Overview

This document explains how receiver information is handled during parcel creation in the updated system using email-based receiver identification.

## Key Requirements

1. **Receiver Email is Required**: Every parcel creation must include a valid `receiverEmail`
2. **Email-Based Lookup**: The system automatically finds the receiver by email address
3. **Name and Email Non-Editable**: Receiver's name and email are always fetched from the database
4. **Optional Contact Override**: Phone and address can be optionally overridden for specific deliveries
5. **Database Validation**: The receiver must exist in the system with 'receiver' role

## Implementation Details

### Interface Structure

```typescript
export interface ICreateParcel {
  receiverEmail: string; // Required - must be a valid registered user email
  receiverInfo?: {
    // Optional - for contact info override only
    phone?: string; // Optional phone override
    address?: {
      // Optional address override
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  parcelDetails: {
    // ... parcel details
  };
  deliveryInfo: {
    // ... delivery info
  };
}
```

### Validation Rules

1. `receiverEmail` is mandatory and must be a valid email format
2. Email lookup finds the corresponding user in the database
3. `receiverInfo` is optional and can contain:
   - `phone`: Optional string to override receiver's default phone
   - `address`: Optional address object to override receiver's default address
4. Name and email cannot be provided in `receiverInfo` (they're ignored if provided)

### Service Logic

The service layer:

1. **Validates Email Format**: Ensures the provided email is in correct format
2. **Database Lookup**: Searches for user by email address using `User.findOne({ email })`
3. **Validates Receiver Existence**: Returns specific error if no user found with that email
4. **Validates Receiver Role**: Ensures the user has 'receiver' role
5. **Fetches Base Info**: Gets name and email from the receiver's profile (non-editable)
6. **Applies Overrides**: Uses provided phone/address or defaults to user's profile data
7. **Internal ID Usage**: Uses the found receiver's `_id` as `receiverId` when saving the parcel

### Example Usage

#### Basic Usage (Default Contact Info)

```json
{
  "receiverEmail": "jane.smith@example.com",
  "parcelDetails": {
    "type": "document",
    "weight": 0.5,
    "description": "Important documents"
  },
  "deliveryInfo": {
    "isUrgent": false
  }
}
```

Result: System finds user by email, uses their default phone and address from profile.

#### With Phone Override

```json
{
  "receiverEmail": "jane.smith@example.com",
  "receiverInfo": {
    "phone": "+1-555-0199"
  },
  "parcelDetails": {
    "type": "document",
    "weight": 0.5,
    "description": "Important documents"
  },
  "deliveryInfo": {
    "isUrgent": false
  }
}
```

Result: Uses the provided phone number but keeps the receiver's default address.

#### With Address Override

```json
{
  "receiverEmail": "jane.smith@example.com",
  "receiverInfo": {
    "address": {
      "street": "123 Temporary Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  },
  "parcelDetails": {
    "type": "package",
    "weight": 2.0,
    "description": "Gift package"
  },
  "deliveryInfo": {
    "isUrgent": true
  }
}
```

Result: Uses the provided address but keeps the receiver's default phone number.

#### With Both Phone and Address Override

```json
{
  "receiverEmail": "jane.smith@example.com",
  "receiverInfo": {
    "phone": "+1-555-0199",
    "address": {
      "street": "123 Temporary Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  },
  "parcelDetails": {
    "type": "electronics",
    "weight": 1.5,
    "description": "Mobile phone"
  },
  "deliveryInfo": {
    "isUrgent": true
  }
}
```

Result: Uses both the provided phone and address for this specific delivery.

## Error Scenarios

### Receiver Email Not Found

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

### Missing Receiver Email

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

### Invalid Email Format

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

### Invalid Receiver Role

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Selected user is not registered as a receiver"
}
```

### Blocked Receiver

```json
{
  "statusCode": 400,
  "success": false,
  "message": "The receiver account is blocked and cannot receive parcels"
}
```

## Benefits

1. **User-Friendly**: Senders only need to know the receiver's email address
2. **Data Integrity**: Name and email are always accurate from the receiver's profile
3. **Flexibility**: Contact information can be customized per delivery
4. **Security**: Only registered receivers can receive parcels
5. **Consistency**: All parcels have verified receiver information
6. **Ease of Use**: Email addresses are more memorable than database IDs

## Technical Implementation

### Database Query

```typescript
const receiver = await User.findOne({
  email: parcelData.receiverEmail,
}).session(session);
```

### Error Handling

```typescript
if (!receiver) {
  throw new AppError("Validation Error", 400, {
    errors: [
      {
        path: "receiverEmail",
        message: "Receiver with this email does not exist",
      },
    ],
  });
}
```

### Internal ID Usage

```typescript
// The receiver's database ID is used internally
receiverId: receiver._id.toString();
```

## Migration Notes

If upgrading from the previous implementation:

1. Update all parcel creation requests to use `receiverEmail` instead of `receiverId`
2. Remove any hardcoded receiver IDs from requests
3. Ensure all receivers have valid email addresses in their profiles
4. Update frontend forms to collect email instead of selecting from ID lists
5. Only include `receiverInfo` if you need to override phone/address

## Testing

Use the examples in `API_TESTING.md` to test the new receiver email handling:

1. Test basic parcel creation with just `receiverEmail`
2. Test phone override functionality
3. Test address override functionality
4. Test combined phone and address override
5. Test error scenarios (invalid email, non-existent receiver, etc.)
6. Test email format validation
7. Test case-insensitive email matching
