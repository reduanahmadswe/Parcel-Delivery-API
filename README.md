# Parcel Delivery API 📦

A comprehensive, secure, and role-based backend API for a parcel delivery system built with Express.js, TypeScript, and MongoDB. This system provides complete parcel tracking, user management, and admin control features.

## 🚀 Features

### 🔐 Authentication & Authorization

- **JWT-based Authentication**: Dual token system (access & refresh tokens) with secure HTTP-only cookies
- **Role-based Access Control**: Three distinct roles (Admin, Sender, Receiver) with granular permissions
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Account Management**: User blocking/unblocking functionality
- **Token Management**: Automatic token refresh and secure logout

### 📦 Parcel Management

- **Comprehensive Tracking**: Unique tracking IDs with TRK-YYYYMMDD-XXXXXX format
- **Status Management**: Complete workflow from requested to delivered with validation
- **Embedded History**: All status changes stored within parcel documents for optimal performance
- **Real-time Updates**: Location and note tracking for each status change
- **Fee Calculation**: Automatic pricing based on weight, urgency, and base fees
- **Delivery Personnel**: Admin assignment of delivery staff with tracking

### 🎭 Role-Based Operations

#### 👤 Senders

- Create parcel delivery requests with detailed information
- Cancel parcels (only before dispatch)
- View all their parcels with complete status history
- Track parcel progress in real-time
- Update profile information

#### 📨 Receivers

- View all incoming parcels filtered by email
- Confirm parcel delivery when in-transit
- Access complete delivery history
- Track parcels using tracking ID (public access)
- Manage profile settings

#### 👨‍💼 Admins

- **User Management**: View all users (excluding own profile), block/unblock, delete accounts
- **Parcel Management**: View all parcels, update statuses, block/unblock parcels
- **Personnel Assignment**: Assign delivery personnel to parcels
- **Status Control**: Full control over parcel status transitions
- **Analytics**: Comprehensive statistics for users and parcels
- **Complete Oversight**: Monitor all system activities

## 📁 Project Architecture

```
src/
├── modules/                  # Feature-based modular architecture
│   ├── auth/                 # Authentication & authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.interface.ts
│   ├── user/                 # User management & profiles
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.model.ts
│   │   ├── user.interface.ts
│   │   ├── user.validation.ts
│   │   └── user.routes.ts
│   └── parcel/               # Parcel delivery system
│       ├── parcel.controller.ts
│       ├── parcel.service.ts
│       ├── parcel.model.ts
│       ├── parcel.interface.ts
│       ├── parcel.validation.ts
│       └── parcel.routes.ts
├── middlewares/              # Cross-cutting concerns
│   ├── auth.ts               # JWT authentication & role authorization
│   ├── validation.ts         # Request validation using Zod
│   ├── globalErrorHandler.ts # Centralized error handling
│   └── notFoundHandler.ts    # 404 route handler
├── config/                   # Configuration management
│   └── database.ts           # MongoDB connection setup
├── utils/                    # Utility functions
│   ├── AppError.ts           # Custom error class
│   ├── catchAsync.ts         # Async error handling wrapper
│   ├── sendResponse.ts       # Standardized API responses
│   ├── helpers.ts            # JWT utilities & tracking ID generation
│   └── authTokens.ts         # Cookie management for tokens
├── routes/                   # Route aggregation
│   └── index.ts              # Main route registry
├── scripts/                  # Database utilities
│   └── seedAdmin.ts          # Admin user seeding
└── app.ts                    # Express application setup
```

## 🛠 Technology Stack

| Category       | Technology          | Purpose                          |
| -------------- | ------------------- | -------------------------------- |
| Runtime        | Node.js             | JavaScript runtime environment   |
| Framework      | Express.js          | Web application framework        |
| Language       | TypeScript          | Type-safe JavaScript             |
| Database       | MongoDB + Mongoose  | NoSQL database with ODM          |
| Authentication | JWT + bcrypt        | Secure authentication            |
| Validation     | Zod                 | Schema validation                |
| HTTP Security  | CORS, Cookie Parser | Cross-origin and cookie security |
| Environment    | Dotenv              | Environment variable management  |

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or cloud instance)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd parcel-delivery-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/parcel-delivery
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=12
   FRONTEND_URL=http://localhost:3000
   ```

4. **Create admin user (optional)**

   ```bash
   npm run seed:admin
   ```

5. **Build the project**

   ```bash
   npm run build
   ```

6. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 📊 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint         | Description           | Access Level |
| ------ | ---------------- | --------------------- | ------------ |
| POST   | `/register`      | Register new user     | Public       |
| POST   | `/login`         | User login            | Public       |
| POST   | `/logout`        | User logout           | Public       |
| POST   | `/refresh-token` | Refresh JWT token     | Public       |
| GET    | `/me`            | Get current user info | Protected    |

### 👤 User Routes (`/api/users`)

| Method | Endpoint            | Description                    | Access Level  |
| ------ | ------------------- | ------------------------------ | ------------- |
| GET    | `/profile`          | Get user profile               | Authenticated |
| PATCH  | `/profile`          | Update user profile            | Authenticated |
| GET    | `/`                 | Get all users (admin excluded) | Admin only    |
| GET    | `/stats`            | Get user statistics            | Admin only    |
| GET    | `/:id`              | Get user by ID                 | Admin only    |
| PATCH  | `/:id/block-status` | Block/unblock user             | Admin only    |
| DELETE | `/:id`              | Delete user                    | Admin only    |

### 📦 Parcel Routes (`/api/parcels`)

| Method | Endpoint                | Description               | Access Level            |
| ------ | ----------------------- | ------------------------- | ----------------------- |
| POST   | `/`                     | Create parcel             | Sender only             |
| GET    | `/me`                   | Get user's parcels        | Sender & Receiver       |
| GET    | `/track/:trackingId`    | Track parcel              | Public                  |
| GET    | `/:id`                  | Get parcel details        | Sender, Receiver, Admin |
| PATCH  | `/:id/cancel`           | Cancel parcel             | Sender only             |
| PATCH  | `/:id/confirm-delivery` | Confirm delivery          | Receiver only           |
| GET    | `/`                     | Get all parcels           | Admin only              |
| GET    | `/admin/stats`          | Get parcel statistics     | Admin only              |
| PATCH  | `/:id/status`           | Update parcel status      | Admin only              |
| PATCH  | `/:id/block-status`     | Block/unblock parcel      | Admin only              |
| PATCH  | `/:id/assign-personnel` | Assign delivery personnel | Admin only              |

## 📋 Parcel Status Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Requested  │──▶ │  Approved   │──▶ │ Dispatched  │──▶ │ In Transit  │──▶ │ Delivered   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                    │                    │                    │
       ▼                    ▼                    ▼                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Cancelled  │    │  Cancelled  │    │  Returned   │    │  Returned   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Status Descriptions & Permissions

| Status     | Description                         | Who Can Set        |
| ---------- | ----------------------------------- | ------------------ |
| Requested  | Parcel created by sender            | System (automatic) |
| Approved   | Admin approved the delivery request | Admin only         |
| Dispatched | Parcel picked up for transport      | Admin only         |
| In Transit | Parcel is being delivered           | Admin only         |
| Delivered  | Parcel successfully delivered       | Receiver or Admin  |
| Cancelled  | Delivery request cancelled          | Sender or Admin    |
| Returned   | Parcel returned to sender           | Admin only         |

## 🔒 Security Features

### Authentication Security

- **JWT Tokens**: Dual token system with short-lived access tokens (15 min) and long-lived refresh tokens (7 days)
- **HTTP-Only Cookies**: Secure token storage preventing XSS attacks
- **Password Hashing**: bcrypt with configurable salt rounds (default: 12)
- **Token Rotation**: Automatic refresh token rotation on use

### Authorization Security

- **Role-Based Access Control**: Granular permissions for each user role
- **Route Protection**: Every sensitive endpoint protected with authentication and authorization
- **Resource Access Control**: Users can only access their own resources (with admin override)
- **Account Security**: User blocking functionality to disable malicious accounts

### Data Security

- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Sanitized error responses preventing information disclosure
- **Database Security**: Mongoose validation and schema enforcement
- **CORS Configuration**: Configurable cross-origin resource sharing

## 📈 Advanced Features

### 💰 Automatic Fee Calculation

- **Base Fee**: 50 BDT for all parcels
- **Weight-based Fee**: 20 BDT per kilogram
- **Urgent Delivery Fee**: Additional 100 BDT for urgent parcels
- **Total Calculation**: Automatic computation on parcel creation

### 🏷️ Tracking System

- **Unique IDs**: TRK-YYYYMMDD-XXXXXX format (e.g., TRK-20250729-ABC123)
- **Public Tracking**: No authentication required for tracking
- **Complete History**: Every status change recorded with timestamps
- **Location Tracking**: Optional location information for each status update
- **Note System**: Custom notes for each status change

### 📊 Analytics & Statistics

- **User Statistics**: Total users, role distribution, blocked users, verification status
- **Parcel Statistics**: Status distribution, urgent parcels, blocked parcels, revenue tracking
- **Real-time Data**: Live statistics updated with each operation

### 🔍 Data Validation

- **Email Validation**: RFC-compliant email format checking
- **Phone Validation**: International phone number format support
- **Address Validation**: Complete address requirement with country defaulting
- **Weight Limits**: 0.1kg minimum, 50kg maximum weight restrictions
- **Dimension Validation**: Positive dimension requirements
- **Date Validation**: Future date validation for delivery preferences

## 🧪 Development Commands

```bash
# Development with auto-reload and TypeScript compilation
npm run dev

# Build TypeScript to JavaScript
npm run build

# Clean build directory
npm run clean

# Start production server
npm start

# Create admin user
npm run seed:admin

# Linting (placeholder for future ESLint integration)
npm run lint

# Testing (placeholder for future test implementation)
npm test
```

## 📝 Environment Variables

| Variable                 | Description               | Default                                   | Required |
| ------------------------ | ------------------------- | ----------------------------------------- | -------- |
| `NODE_ENV`               | Environment mode          | development                               | No       |
| `PORT`                   | Server port               | 5000                                      | No       |
| `MONGODB_URI`            | MongoDB connection string | mongodb://localhost:27017/parcel-delivery | Yes      |
| `JWT_SECRET`             | JWT signing secret        | -                                         | Yes      |
| `JWT_EXPIRES_IN`         | Access token expiration   | 15m                                       | No       |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration  | 7d                                        | No       |
| `BCRYPT_SALT_ROUNDS`     | Password hashing rounds   | 12                                        | No       |
| `FRONTEND_URL`           | Frontend application URL  | http://localhost:3000                     | No       |

## 🗄️ Database Schema

### User Schema

```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (hashed),
  name: string,
  phone: string,
  role: 'sender' | 'receiver' | 'admin',
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  isBlocked: boolean,
  isVerified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Parcel Schema

```typescript
{
  _id: ObjectId,
  trackingId: string (unique, indexed),
  senderId: string (indexed),
  receiverId: string (optional, indexed),
  senderInfo: PersonInfo,
  receiverInfo: PersonInfo,
  parcelDetails: {
    type: 'document' | 'package' | 'fragile' | 'electronics' | 'clothing' | 'other',
    weight: number,
    dimensions: { length: number, width: number, height: number },
    description: string,
    value: number
  },
  deliveryInfo: {
    preferredDeliveryDate: Date,
    deliveryInstructions: string,
    isUrgent: boolean
  },
  fee: {
    baseFee: number,
    weightFee: number,
    urgentFee: number,
    totalFee: number,
    isPaid: boolean,
    paymentMethod: 'cash' | 'card' | 'online'
  },
  currentStatus: string (indexed),
  statusHistory: Array<StatusLog>,
  assignedDeliveryPersonnel: string,
  isBlocked: boolean,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain consistent code formatting
- Add proper error handling
- Include input validation
- Write descriptive commit messages
- Test thoroughly before submitting

## 🛡️ Security Considerations

### Production Deployment

- **HTTPS Only**: Always use HTTPS in production environments
- **Environment Variables**: Never commit sensitive data to version control
- **Database Security**: Use MongoDB Atlas or secure self-hosted instances
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Monitoring**: Set up logging and monitoring for suspicious activities
- **Regular Updates**: Keep dependencies updated for security patches

### Security Best Practices

- **Strong JWT Secrets**: Use cryptographically strong random secrets (256-bit recommended)
- **Token Expiration**: Use short-lived access tokens with refresh token rotation
- **Input Sanitization**: Validate and sanitize all user inputs
- **Error Handling**: Avoid exposing sensitive information in error messages
- **Access Control**: Implement principle of least privilege
- **Audit Trails**: Log all sensitive operations for security auditing

## 📜 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Express.js** - Fast, unopinionated, minimalist web framework
- **MongoDB** - Document-based NoSQL database
- **TypeScript** - Typed superset of JavaScript
- **Mongoose** - Elegant MongoDB object modeling
- **Zod** - TypeScript-first schema validation
- **JWT** - JSON Web Token implementation

---

**Built with ❤️ using TypeScript, Express.js, and MongoDB**

_For API testing examples and detailed endpoint documentation, see [API_TESTING.md](API_TESTING.md)_
