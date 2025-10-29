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

Changed in `parcel.service.ts` to properly handle delivery address:

```typescript
// OLD CODE (WRONG - Could mix addresses)
receiverInfo: {
    name: receiver.name,
    email: receiver.email,
    phone: parcelData.receiverInfo?.phone || receiver.phone,
    address: parcelData.receiverInfo?.address ?? receiver.address,
}

// NEW CODE (CORRECT - Prevents address mixing)
// Prepare receiver address - use form data if provided, otherwise use account address
const deliveryAddress = parcelData.receiverInfo?.address
    ? {
        street: parcelData.receiverInfo.address.street,
        city: parcelData.receiverInfo.address.city,
        state: parcelData.receiverInfo.address.state,
        zipCode: parcelData.receiverInfo.address.zipCode,
        country: parcelData.receiverInfo.address.country || 'Bangladesh',
    }
    : receiver.address;

receiverInfo: {
    name: receiver.name,
    email: receiver.email,
    phone: parcelData.receiverInfo?.phone || receiver.phone,
    address: deliveryAddress, // Use prepared delivery address
}
```

### Why This Fix Was Needed

The previous approach using `??` operator would accept any object, even if partially filled. This caused issues where:

- Frontend sends: `{ city: "Rajshahi", state: "Rajshahi", zipCode: "6000" }`
- But `street` was missing
- Backend would use the whole partial object instead of falling back to account address
- Result: Street from account address got mixed with city/state/zip from form

**Solution:** Now we explicitly construct a new address object only when `receiverInfo.address` exists, ensuring all fields come from the same source.
