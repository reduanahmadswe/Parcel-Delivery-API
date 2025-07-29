# Parcel Delivery API 📦

A comprehensive, secure, and role-based backend API for a parcel delivery system built with Express.js, TypeScript, and MongoDB. This enterprise-grade system provides complete parcel tracking, user management, and administrative control features with robust security and scalable architecture.

## 🌟 Key Highlights

- **🔒 Enterprise Security**: JWT-based dual token authentication with HTTP-only cookies
- **🎭 Role-Based Access Control**: Granular permissions for Admin, Sender, and Receiver roles
- **� Real-Time Tracking**: Comprehensive parcel tracking with embedded status history
- **🏗️ Modular Architecture**: Clean, maintainable code structure following best practices
- **✅ Data Validation**: Input validation using Zod schemas with detailed error handling
- **📈 Performance Optimized**: Efficient database operations with proper indexing
- **🔧 Developer Friendly**: TypeScript, comprehensive error handling, and detailed documentation

## �🚀 Features

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

### �️ Security Features

- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Global error handling with consistent response format
- **Access Control**: Route-level and resource-level authorization
- **Data Sanitization**: Input sanitization to prevent injection attacks
- **CORS Configuration**: Secure cross-origin resource sharing setup

### � Admin Dashboard Features

- **User Management**: Complete user lifecycle management
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

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or cloud instance) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager

### 🔧 Installation

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

   Create a `.env` file in the root directory:

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

4. **Database setup**

   Make sure MongoDB is running locally or provide a connection string to MongoDB Atlas.

5. **Create admin user (optional)**

   ```bash
   npm run seed:admin
   ```

   This creates an admin user with:

   - **Email**: `admin@parceldelivery.com`
   - **Password**: `Admin123!`

6. **Build the project**

   ```bash
   npm run build
   ```

7. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will be available at `http://localhost:5000`

### 🏥 Health Check

Visit `http://localhost:5000/api/health` to verify the server is running.

## 📊 API Endpoints Overview

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint         | Description           | Access Level |
| ------ | ---------------- | --------------------- | ------------ |
| POST   | `/register`      | Register new user     | Public       |
| POST   | `/login`         | User login            | Public       |
| POST   | `/logout`        | User logout           | Public       |
| POST   | `/refresh-token` | Refresh JWT token     | Public       |
| GET    | `/me`            | Get current user info | Protected    |

### 👤 User Management Routes (`/api/users`)

| Method | Endpoint            | Description                 | Access Level  |
| ------ | ------------------- | --------------------------- | ------------- |
| GET    | `/profile`          | Get user profile            | Authenticated |
| PATCH  | `/profile`          | Update user profile         | Authenticated |
| GET    | `/`                 | Get all users (admin only)  | Admin         |
| GET    | `/stats`            | Get user statistics (admin) | Admin         |
| GET    | `/:id`              | Get user by ID (admin only) | Admin         |
| PUT    | `/:id`              | Update user by ID (admin)   | Admin         |
| PATCH  | `/:id/block-status` | Block/unblock user (admin)  | Admin         |
| DELETE | `/:id`              | Delete user (admin only)    | Admin         |

### 📦 Parcel Management Routes (`/api/parcels`)

| Method | Endpoint                | Description                 | Access Level |
| ------ | ----------------------- | --------------------------- | ------------ |
| GET    | `/track/:trackingId`    | Track parcel by ID (public) | Public       |
| POST   | `/`                     | Create new parcel (sender)  | Sender       |
| GET    | `/me`                   | Get my parcels              | User         |
| GET    | `/:id`                  | Get parcel by ID            | User/Admin   |
| GET    | `/:id/status-log`       | Get parcel status history   | User/Admin   |
| PATCH  | `/cancel/:id`           | Cancel parcel (sender)      | Sender       |
| PATCH  | `/:id/confirm-delivery` | Confirm delivery (receiver) | Receiver     |
| GET    | `/` (admin)             | Get all parcels (admin)     | Admin        |
| GET    | `/admin/stats`          | Get parcel statistics       | Admin        |
| PATCH  | `/:id/status`           | Update parcel status        | Admin        |
| PATCH  | `/:id/block-status`     | Block/unblock parcel        | Admin        |
| PATCH  | `/:id/assign-personnel` | Assign delivery personnel   | Admin        |
| PATCH  | `/:id/flag`             | Flag/unflag parcel          | Admin        |
| PATCH  | `/:id/hold`             | Hold/unhold parcel          | Admin        |
| PATCH  | `/:id/unblock`          | Unblock parcel              | Admin        |
| PATCH  | `/:id/return`           | Return parcel               | Admin        |
| DELETE | `/:id`                  | Delete parcel               | Admin        |

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

## 📊 Data Models

### User Schema

```typescript
{
  _id: ObjectId,
  email: string,        // Unique, indexed
  password: string,     // bcrypt hashed
  name: string,
  phone: string,
  role: 'admin' | 'sender' | 'receiver',
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
  trackingId: string,   // Unique, format: TRK-YYYYMMDD-XXXXXX
  senderId: string,     // User ObjectId
  receiverId: string,   // User ObjectId (optional)
  senderInfo: PersonInfo,
  receiverInfo: PersonInfo,
  parcelDetails: {
    type: 'document' | 'package' | 'fragile' | 'electronics' | 'clothing' | 'other',
    weight: number,     // in kg
    dimensions: { length, width, height },
    description: string,
    value: number       // estimated value
  },
  deliveryInfo: {
    preferredDeliveryDate: Date,
    deliveryInstructions: string,
    isUrgent: boolean
  },
  currentStatus: StatusEnum,
  statusHistory: [StatusLog],
  fee: {
    baseFee: number,
    weightFee: number,
    urgentFee: number,
    totalFee: number,
    isPaid: boolean,
    paymentMethod: string
  },
  assignedDeliveryPersonnel: string,
  isFlagged: boolean,
  isHeld: boolean,
  isBlocked: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

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

# Lint code (placeholder - configure as needed)
npm run lint

# Run tests (placeholder - implement as needed)
npm test
```

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

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

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

**Built with ❤️ using Node.js, Express.js, TypeScript, and MongoDB**
npm start

# Create admin user

npm run seed:admin

# Linting (placeholder for future ESLint integration)

npm run lint

# Testing (placeholder for future test implementation)

npm test

````

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
````

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
