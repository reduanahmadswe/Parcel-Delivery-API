# Frontend Payload Fix - Delivery Address Issue

## Problem

The frontend was sending the wrong data structure. The backend expects `receiverInfo` to contain `phone` and `address`, but the frontend was sending them as separate fields.

## ❌ Old (Wrong) Frontend Payload Structure

```typescript
const payload = {
  receiverName: "John Doe",           // ❌ Not needed - backend gets from database
  receiverEmail: "receiver@email.com",
  receiverPhone: "01712345678",       // ❌ Wrong location
  receiverAddress: {                  // ❌ Wrong location
    street: "123 Main St",
    city: "Dhaka",
    state: "Dhaka",
    zipCode: "1200",
    country: "Bangladesh"
  },
  parcelDetails: { ... },
  deliveryInfo: { ... }
};
```

## ✅ Correct Frontend Payload Structure

```typescript
const payload = {
  receiverEmail: "receiver@email.com", // ✅ Required - used to find receiver in database
  receiverInfo: {
    // ✅ Optional - overrides receiver's default info
    phone: "01712345678", // ✅ Delivery contact number
    address: {
      // ✅ Delivery address (the one selected in form)
      street: "123 Main St",
      city: "Dhaka",
      state: "Dhaka",
      zipCode: "1200",
      country: "Bangladesh",
    },
  },
  parcelDetails: {
    type: "package",
    weight: 2.5,
    dimensions: {
      length: 30,
      width: 20,
      height: 10,
    },
    description: "Electronics item",
    value: 5000,
  },
  deliveryInfo: {
    preferredDeliveryDate: "2024-11-01T10:00:00.000Z",
    deliveryInstructions: "Call before delivery",
    isUrgent: false,
  },
};
```

## How It Works

1. **receiverEmail**: Backend uses this to find the receiver user in the database
2. **receiverInfo.phone**: Optional - if provided, this phone will be used for delivery contact
3. **receiverInfo.address**: Optional - if provided, this address will be used as delivery address
4. **Backend Logic**:
   - If `receiverInfo.address` is provided → Use it for delivery
   - If not provided → Use receiver's account address as default

## What Changed in Backend

Changed in `parcel.service.ts` line 98:

```typescript
// Old (would fallback to account address)
address: parcelData.receiverInfo?.address || receiver.address;

// New (prioritizes form address, uses ?? for explicit null/undefined check)
address: parcelData.receiverInfo?.address ?? receiver.address;
```

The `??` (nullish coalescing) operator only falls back if the value is `null` or `undefined`, not for empty objects.
