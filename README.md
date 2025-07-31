# Parcel Delivery API 📦

A comprehensive, secure, and role-based backend API for a parcel delivery system built with Express.js, TypeScript, and MongoDB. This enterprise-grade system provides complete parcel tracking, user management, and administrative control features with robust security and scalable architecture.

## 🌟 Key Highlights

- **🔒 Enterprise Security**: JWT-based dual token authentication with HTTP-only cookies
- **🎭 Role-Based Access Control**: Granular permissions for Admin, Sender, and Receiver roles
- **📱 Real-Time Tracking**: Comprehensive parcel tracking with embedded status history
- **🏗️ Modular Architecture**: Clean, maintainable code structure following best practices
- **✅ Data Validation**: Input validation using Zod schemas with detailed error handling
- **📈 Performance Optimized**: Efficient database operations with proper indexing
- **🔧 Developer Friendly**: TypeScript, comprehensive error handling, and detailed documentation

## 🚀 Features

### 🔐 Authentication & Authorization

- **JWT-based Authentication**: Dual token system (access & refresh tokens) stored in secure HTTP-only cookies
- **Role-based Access Control**: Three distinct roles with granular permissions:
  - **Admin**: Full system access, user management, parcel oversight
  - **Sender**: Create parcels, cancel before dispatch, view own parcels
  - **Receiver**: View incoming parcels, confirm delivery, track shipments
- **Password Security**: bcrypt hashing with configurable salt rounds (default: 12)
- **Account Management**: User blocking/unblocking functionality for administrative control
- **Token Management**: Automatic token refresh, secure logout, and session management

### 📦 Parcel Management

- **Comprehensive Tracking**: Unique tracking IDs with format `TRK-YYYYMMDD-XXXXXX`
- **Status Workflow**: Complete lifecycle management with validated transitions:
  - `requested` → `approved` → `dispatched` → `in-transit` → `delivered`
  - Cancellation and return flows with proper validation
- **Embedded History**: All status changes stored within parcel documents for optimal performance
- **Real-time Updates**: Location tracking and detailed notes for each status change
- **Fee Management**: Automatic pricing calculation based on weight, urgency, and base fees
- **Delivery Personnel**: Admin assignment and tracking of delivery staff
- **Advanced Filtering**: Search, filter, and sort parcels by multiple criteria

### 🛡️ Security Features

- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Global error handling with consistent response format
- **Access Control**: Route-level and resource-level authorization
- **Data Sanitization**: Input sanitization to prevent injection attacks
- **CORS Configuration**: Secure cross-origin resource sharing setup

### 🎛️ Admin Dashboard Features

- **User Management**: Complete user lifecycle management
- **Parcel Oversight**: Full parcel management with status controls
- **Analytics**: User and parcel statistics
- **Flagging System**: Mark suspicious parcels for review
- **Hold/Block System**: Temporarily halt parcel processing

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: bcryptjs, CORS, HTTP-only cookies
- **Development**: ESLint, Nodemon, TypeScript

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/reduanahmadswe/Parcel-Delivery-API.git
cd Parcel-Delivery-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/parcel-delivery

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# JWT Access Token Configuration
JWT_ACCESS_SECRET=access-token-secret-change-this-in-production
JWT_ACCESS_EXPIRES=15m

# JWT Refresh Token Configuration
JWT_REFRESH_SECRET=refresh-token-secret-change-this-in-production
JWT_REFRESH_EXPIRES=7d

BCRYPT_SALT_ROUNDS=12
FRONTEND_URL=http://localhost:3000
```

### 4. Create Admin User

```bash
npm run seed:admin
```

### 5. Development

```bash
npm run dev
```

### 6. Production Build

```bash
npm run build
npm start
```

## 🌐 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### 🔐 Authentication Endpoints

| Method | Endpoint              | Description           | Access  |
| ------ | --------------------- | --------------------- | ------- |
| POST   | `/auth/register`      | Register new user     | Public  |
| POST   | `/auth/login`         | User login            | Public  |
| POST   | `/auth/logout`        | User logout           | Public  |
| POST   | `/auth/refresh-token` | Refresh access token  | Public  |
| GET    | `/auth/me`            | Get current user info | Private |

### 👤 User Management Endpoints

| Method | Endpoint                  | Description              | Access |
| ------ | ------------------------- | ------------------------ | ------ |
| GET    | `/users/profile`          | Get user profile         | User   |
| PATCH  | `/users/profile`          | Update user profile      | User   |
| GET    | `/users`                  | Get all users            | Admin  |
| GET    | `/users/stats`            | Get user statistics      | Admin  |
| GET    | `/users/:id`              | Get user by ID           | Admin  |
| PUT    | `/users/:id`              | Update user by ID        | Admin  |
| PATCH  | `/users/:id/block-status` | Toggle user block status | Admin  |
| DELETE | `/users/:id`              | Delete user              | Admin  |

### 📦 Parcel Management Endpoints

#### Public Routes

| Method | Endpoint                     | Description                 | Access |
| ------ | ---------------------------- | --------------------------- | ------ |
| GET    | `/parcels/track/:trackingId` | Track parcel by tracking ID | Public |

#### Sender Routes

| Method | Endpoint              | Description       | Access |
| ------ | --------------------- | ----------------- | ------ |
| POST   | `/parcels`            | Create new parcel | Sender |
| PATCH  | `/parcels/cancel/:id` | Cancel parcel     | Sender |

#### Receiver Routes

| Method | Endpoint                        | Description      | Access   |
| ------ | ------------------------------- | ---------------- | -------- |
| PATCH  | `/parcels/:id/confirm-delivery` | Confirm delivery | Receiver |

#### Shared Routes (Sender & Receiver)

| Method | Endpoint                  | Description               | Access                |
| ------ | ------------------------- | ------------------------- | --------------------- |
| GET    | `/parcels/me`             | Get user's parcels        | Sender/Receiver       |
| GET    | `/parcels/:id`            | Get parcel by ID          | Sender/Receiver/Admin |
| GET    | `/parcels/:id/status-log` | Get parcel status history | Sender/Receiver/Admin |

#### Admin Routes

| Method | Endpoint                        | Description                | Access |
| ------ | ------------------------------- | -------------------------- | ------ |
| GET    | `/parcels`                      | Get all parcels            | Admin  |
| GET    | `/parcels/admin/stats`          | Get parcel statistics      | Admin  |
| PATCH  | `/parcels/:id/status`           | Update parcel status       | Admin  |
| PATCH  | `/parcels/:id/block-status`     | Toggle parcel block status | Admin  |
| PATCH  | `/parcels/:id/assign-personnel` | Assign delivery personnel  | Admin  |
| PATCH  | `/parcels/:id/flag`             | Flag/unflag parcel         | Admin  |
| PATCH  | `/parcels/:id/hold`             | Hold/unhold parcel         | Admin  |
| PATCH  | `/parcels/:id/unblock`          | Unblock parcel             | Admin  |
| PATCH  | `/parcels/:id/return`           | Return parcel              | Admin  |
| DELETE | `/parcels/:id`                  | Delete parcel              | Admin  |

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server

# Code Quality
npm run lint         # Check code for linting errors
npm run lint:fix     # Fix linting errors automatically
npm run lint:check   # Check linting with zero warnings

# Database
npm run seed:admin   # Create initial admin user

# Utilities
npm run clean        # Clean build directory
```

## 📊 Data Models

### User Model

```typescript
interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "sender" | "receiver";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Parcel Model

```typescript
interface IParcel {
  _id: string;
  trackingId: string;
  senderId: string;
  receiverId: string;
  senderInfo: PersonInfo;
  receiverInfo: PersonInfo;
  parcelDetails: {
    type:
      | "document"
      | "package"
      | "fragile"
      | "electronics"
      | "clothing"
      | "other";
    weight: number;
    dimensions?: { length: number; width: number; height: number };
    description: string;
    value?: number;
  };
  deliveryInfo: {
    preferredDeliveryDate?: Date;
    deliveryInstructions?: string;
    isUrgent: boolean;
  };
  fee: {
    baseFee: number;
    weightFee: number;
    urgentFee: number;
    totalFee: number;
    isPaid: boolean;
    paymentMethod?: "cash" | "card" | "online";
  };
  currentStatus:
    | "requested"
    | "approved"
    | "dispatched"
    | "in-transit"
    | "delivered"
    | "cancelled"
    | "returned";
  statusHistory: IStatusLog[];
  assignedDeliveryPersonnel?: string;
  isFlagged: boolean;
  isHeld: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Authentication Flow

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server generates access (15min) and refresh (7d) tokens
3. **Cookie Storage**: Tokens stored as HTTP-only cookies
4. **Request Authentication**: Access token validates API requests
5. **Token Refresh**: Refresh token regenerates expired access tokens
6. **Logout**: Clears authentication cookies

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Traditional Hosting

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🧪 Testing

Comprehensive API testing examples are available in `API_TESTING.md`. The file includes:

- Complete endpoint documentation
- Request/response examples
- Authentication flows
- Error handling scenarios



## 🆘 Support

For support, email reduanahmadswe@gmail.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- Express.js team for the robust web framework
- MongoDB team for the flexible database solution
- TypeScript team for type safety
- Zod team for runtime validation
- All contributors and users of this project
- **Parcel Oversight**: Advanced parcel management with bulk operations
- **Analytics**: Comprehensive statistics and reporting
- **System Monitoring**: Health checks and system status monitoring

## 📁 Project Architecture

This project follows a modular architecture pattern with clear separation of concerns:

```
src/
├── modules/                  # Feature-based modular architecture
│   ├── auth/                 # Authentication & authorization
│   │   ├── auth.controller.ts    # HTTP request handlers
│   │   ├── auth.service.ts       # Business logic layer
│   │   ├── auth.routes.ts        # Route definitions
│   │   └── auth.interface.ts     # Type definitions
│   ├── user/                 # User management & profiles
│   │   ├── user.controller.ts    # User HTTP handlers
│   │   ├── user.service.ts       # User business logic
│   │   ├── user.model.ts         # Mongoose schema & model
│   │   ├── user.interface.ts     # User type definitions
│   │   ├── user.validation.ts    # Zod validation schemas
│   │   └── user.routes.ts        # User route definitions
│   └── parcel/               # Parcel delivery system
│       ├── parcel.controller.ts  # Parcel HTTP handlers
│       ├── parcel.service.ts     # Parcel business logic
│       ├── parcel.model.ts       # Parcel mongoose model
│       ├── parcel.interface.ts   # Parcel type definitions
│       ├── parcel.validation.ts  # Parcel validation schemas
│       └── parcel.routes.ts      # Parcel route definitions
├── middlewares/              # Cross-cutting concerns
│   ├── auth.ts               # JWT authentication & authorization
│   ├── validation.ts         # Request validation middleware
│   ├── globalErrorHandler.ts # Centralized error handling
│   └── notFoundHandler.ts    # 404 route handler
├── config/                   # Configuration management
│   └── database.ts           # MongoDB connection & configuration
├── utils/                    # Utility functions & helpers
│   ├── AppError.ts           # Custom error class
│   ├── catchAsync.ts         # Async error handling wrapper
│   ├── sendResponse.ts       # Standardized API responses
│   ├── helpers.ts            # JWT utilities & ID generation
│   ├── jwt.ts                # JWT token utilities
│   └── authTokens.ts         # Cookie management for tokens
├── types/                    # Global type definitions
│   ├── express.d.ts          # Express request extensions
│   └── error.types.ts        # Error type definitions
├── routes/                   # Route aggregation
│   └── index.ts              # Main route registry
├── scripts/                  # Database utilities
│   └── seedAdmin.ts          # Admin user seeding script
├── app.ts                    # Express application setup
└── server.ts                 # Application entry point
```

## 🛠 Technology Stack

| Category           | Technology          | Purpose                           |
| ------------------ | ------------------- | --------------------------------- |
| **Runtime**        | Node.js             | JavaScript runtime environment    |
| **Framework**      | Express.js          | Web application framework         |
| **Language**       | TypeScript          | Type-safe JavaScript development  |
| **Database**       | MongoDB + Mongoose  | NoSQL database with ODM           |
| **Authentication** | JWT + bcrypt        | Secure token-based authentication |
| **Validation**     | Zod                 | Runtime schema validation         |
| **HTTP Security**  | CORS, Cookie Parser | Cross-origin and cookie security  |
| **Environment**    | Dotenv              | Environment variable management   |
| **Process Mgmt**   | Nodemon             | Development auto-reload           |


## 🎭 Role-Based Access Control

### 👤 Sender Permissions

- ✅ Create new parcel delivery requests
- ✅ View all their created parcels
- ✅ Cancel parcels (only before dispatch)
- ✅ View complete status history of own parcels
- ✅ Update own profile information
- ❌ Cannot access other users' parcels
- ❌ Cannot perform admin functions

### 📨 Receiver Permissions

- ✅ View parcels addressed to their email
- ✅ Confirm delivery for in-transit parcels
- ✅ Track parcels using tracking ID
- ✅ View complete delivery history
- ✅ Update own profile information
- ❌ Cannot create parcels
- ❌ Cannot access other users' parcels
- ❌ Cannot perform admin functions

### 👨‍💼 Admin Permissions

- ✅ **Full User Management**: View, update, block/unblock, delete users
- ✅ **Complete Parcel Oversight**: View all parcels, update statuses
- ✅ **Personnel Management**: Assign delivery staff to parcels
- ✅ **Status Control**: Full control over parcel status transitions
- ✅ **Flagging System**: Flag/unflag parcels for review
- ✅ **Hold System**: Put parcels on hold temporarily
- ✅ **Analytics**: Access comprehensive system statistics
- ✅ **System Monitoring**: Monitor all system activities

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

- **JWT Dual Token System**: Separate access and refresh tokens
- **HTTP-Only Cookies**: Tokens stored securely in cookies
- **Password Hashing**: bcrypt with configurable salt rounds
- **Token Expiration**: Automatic token expiration and refresh
- **Secure Logout**: Proper token invalidation

### Authorization Security

- **Role-Based Access**: Granular permissions per user role
- **Resource-Level Security**: Users can only access their own resources
- **Route Protection**: Middleware-based route authorization
- **Input Validation**: Comprehensive request validation using Zod

### Data Security

- **Input Sanitization**: Protection against injection attacks
- **Error Handling**: Secure error messages without data leakage
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data in environment configuration

## 📈 Advanced Features

### 💰 Automatic Fee Calculation

The system automatically calculates parcel fees based on:

- **Base Fee**: 50 BDT for all parcels
- **Weight-based Fee**: 20 BDT per kilogram
- **Urgent Delivery Fee**: Additional 100 BDT for urgent parcels
- **Total Calculation**: Automatic computation on parcel creation

### 🏷️ Smart Tracking System

- **Unique Tracking IDs**: Format `TRK-YYYYMMDD-XXXXXX` (e.g., TRK-20250729-ABC123)
- **Public Tracking**: No authentication required for tracking by ID
- **Complete History**: Every status change recorded with timestamps
- **Location Tracking**: Optional GPS coordinates for each update
- **Note System**: Custom notes and remarks for status changes
- **Retry Logic**: Automatic tracking ID regeneration on conflicts

### 📊 Analytics & Reporting

#### User Analytics

- Total registered users by role
- User verification status tracking
- Blocked user monitoring
- Registration trends over time

#### Parcel Analytics

- Status distribution across all parcels
- Urgent vs. regular parcel ratios
- Revenue tracking and payment status
- Delivery performance metrics
- Geographic distribution analysis

### 🔍 Comprehensive Data Validation

#### Input Validation

- **Email**: RFC-compliant format validation
- **Phone**: International format support with regex validation
- **Addresses**: Complete address requirements with country defaults
- **Weights**: Range validation (0.1kg - 50kg)
- **Dimensions**: Positive value requirements for L×W×H
- **Dates**: Future date validation for delivery preferences
- **Text Fields**: Length limits and character restrictions

#### Business Logic Validation

- **Status Transitions**: Enforced workflow compliance
- **Permission Checks**: Role-based operation validation
- **Resource Ownership**: User-resource relationship verification
- **Account Status**: Blocked user operation prevention

### 🛠️ Admin Management Tools

- **Parcel Flagging**: Mark suspicious parcels for review
- **Parcel Hold System**: Temporarily suspend parcel operations
- **Bulk Operations**: Efficient management of multiple records
- **Personnel Assignment**: Delivery staff allocation and tracking
- **Force Status Changes**: Override normal workflow when necessary

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


## 🔧 Testing

For comprehensive API testing, refer to the [API_TESTING.md](./API_TESTING.md) file which includes:

- Complete endpoint documentation with examples
- Authentication flow testing
- Role-based access testing
- Error scenario testing
- Data validation testing

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Ensure all required environment variables are set
2. **Database**: Use a production MongoDB instance (MongoDB Atlas recommended)
3. **Secrets**: Generate strong, unique JWT secrets
4. **CORS**: Configure appropriate CORS origins for your frontend
5. **Logging**: Implement proper logging for production monitoring
6. **Process Management**: Use PM2 or similar for process management


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure proper error handling
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

## 🔗 Related Documentation

- [API Testing Guide](./API_TESTING.md) - Comprehensive API testing examples
- [Database Schema](./docs/schema.md) - Detailed database schema documentation
- [Deployment Guide](./docs/deployment.md) - Production deployment instructions

---

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
