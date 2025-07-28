# Parcel Delivery API 📦

A secure, modular, and role-based backend API for a parcel delivery system built with Express.js, TypeScript, and MongoDB.

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication with secure HTTP-only cookies
- Role-based access control (Admin, Sender, Receiver)
- Password hashing with bcrypt
- User blocking functionality

### 📦 Parcel Management

- Create delivery requests with detailed tracking
- Embedded status history within parcel documents
- Real-time status updates with location tracking
- Automatic fee calculation based on weight and urgency
- Unique tracking ID generation (TRK-YYYYMMDD-XXXXXX format)

### 🎭 Role-Based Operations

#### 👤 Senders

- Create parcel delivery requests
- Cancel parcels (if not dispatched)
- View all their parcels and status logs
- Update profile information

#### 📨 Receivers

- View incoming parcels
- Confirm parcel delivery
- Access delivery history
- Track parcels via tracking ID

#### 👨‍💼 Admins

- Manage all users and parcels
- Block/unblock users and parcels
- Update delivery statuses
- Access comprehensive statistics
- Full CRUD operations

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/                 # Authentication logic
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.interface.ts
│   │   └── auth.routes.ts
│   ├── user/                 # User management
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.model.ts
│   │   ├── user.interface.ts
│   │   ├── user.validation.ts
│   │   └── user.routes.ts
│   └── parcel/               # Parcel management with embedded status logs
│       ├── parcel.controller.ts
│       ├── parcel.service.ts
│       ├── parcel.model.ts
│       ├── parcel.interface.ts
│       ├── parcel.validation.ts
│       └── parcel.routes.ts
├── middlewares/              # Authentication, validation, error handling
├── config/                   # Database configuration
├── utils/                    # Helper functions and utilities
├── types/                    # TypeScript type definitions
└── app.ts                    # Main application file
```

## 🛠 Technology Stack

| Category       | Technology                  |
| -------------- | --------------------------- |
| Runtime        | Node.js                     |
| Framework      | Express.js                  |
| Language       | TypeScript                  |
| Database       | MongoDB + Mongoose          |
| Authentication | JWT + bcrypt                |
| Validation     | Zod                         |
| Others         | CORS, Cookie Parser, Dotenv |

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

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

   Update the `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/parcel-delivery
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 📊 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh JWT token
- `GET /me` - Get current user info

### User Routes (`/api/users`)

- `GET /profile` - Get user profile
- `PATCH /profile` - Update user profile
- `GET /` - Get all users (Admin only)
- `GET /stats` - Get user statistics (Admin only)
- `GET /:id` - Get user by ID (Admin only)
- `PATCH /:id/block-status` - Block/unblock user (Admin only)
- `DELETE /:id` - Delete user (Admin only)

### Parcel Routes (`/api/parcels`)

- `POST /` - Create parcel (Sender only)
- `GET /me` - Get user's parcels
- `GET /track/:trackingId` - Track parcel (Public)
- `GET /:id` - Get parcel details
- `PATCH /:id/cancel` - Cancel parcel (Sender only)
- `PATCH /:id/confirm-delivery` - Confirm delivery (Receiver only)
- `GET /admin/stats` - Get parcel statistics (Admin only)
- `PATCH /:id/status` - Update parcel status (Admin only)
- `PATCH /:id/block-status` - Block/unblock parcel (Admin only)

## 📋 Parcel Status Workflow

```
Requested → Approved → Dispatched → In Transit → Delivered
    ↓           ↓          ↓
Cancelled   Cancelled   Returned
```

### Status Descriptions

- **Requested**: Parcel created by sender
- **Approved**: Admin approved the delivery request
- **Dispatched**: Parcel picked up and ready for transport
- **In Transit**: Parcel is being delivered
- **Delivered**: Parcel successfully delivered
- **Cancelled**: Delivery request cancelled
- **Returned**: Parcel returned to sender

## 🔒 Security Features

- **Password Hashing**: Bcrypt with configurable salt rounds
- **JWT Security**: HTTP-only cookies with secure settings
- **Input Validation**: Comprehensive validation using Zod
- **Error Handling**: Centralized error handling with sanitized responses
- **Role-Based Access**: Granular permissions for different user types
- **Account Security**: User blocking and verification system

## 📈 Additional Features

### Fee Calculation

- Base fee: 50 BDT
- Weight-based fee: 20 BDT per kg
- Urgent delivery fee: 100 BDT additional
- Automatic calculation on parcel creation

### Tracking System

- Unique tracking ID generation
- Public tracking without authentication
- Complete status history with timestamps
- Location and note tracking for each status update

### Data Validation

- Email format validation
- Phone number validation
- Address completeness validation
- Parcel weight and dimension limits
- Date validation for delivery preferences

## 🧪 Development Commands

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Clean build directory
npm run clean

# Start production server
npm start
```

## 📝 Environment Variables

| Variable             | Description               | Default                                   |
| -------------------- | ------------------------- | ----------------------------------------- |
| `NODE_ENV`           | Environment mode          | development                               |
| `PORT`               | Server port               | 5000                                      |
| `MONGODB_URI`        | MongoDB connection string | mongodb://localhost:27017/parcel-delivery |
| `JWT_SECRET`         | JWT signing secret        | -                                         |
| `JWT_EXPIRES_IN`     | Token expiration time     | 7d                                        |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds   | 12                                        |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the ISC License.

## 🛡️ Security Considerations

- Always use HTTPS in production
- Regularly update dependencies
- Use strong JWT secrets
- Implement rate limiting for production
- Monitor for suspicious activities
- Regular security audits

---

**Built with ❤️ using TypeScript, Express.js, and MongoDB**
