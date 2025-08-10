<xaiArtifact artifact_id="18510198-1ee4-48a7-b832-e72e3dc21ff0" artifact_version_id="82eb2a3f-5969-484b-ad2c-b42fb5aa4d0a" title="README.md" contentType="text/markdown">

# Parcel Delivery API

A secure, modular, and role-based backend API for a parcel delivery system, built with **Express.js**, **TypeScript**, and **Mongoose**. This system enables users to register, create parcel delivery requests, and track their status through a complete lifecycle, with administrative controls for user management, parcel oversight, and promotional campaigns.

### Live Link : https://parcel-delivery-api-amber.vercel.app/
### Postman APIs collection: https://github.com/EtherSphere01/Parcel-Delivery-API/blob/main/Parcel%20Delivery%20API.postman_collection.json

## ✨ Features

-   **JWT Authentication**: Secure, stateless authentication using JSON Web Tokens with access and refresh token rotation.
-   **Role-Based Access Control (RBAC)**: Three distinct user roles (`ADMIN`, `SENDER`, `RECEIVER`) with granular permissions for every action.
-   **Complete Parcel Lifecycle**: Full management of parcels from creation to delivery, with a detailed, embedded status log.
-   **Dynamic Fee Calculation**: Delivery fees are calculated based on parcel weight.
-   **Coupon & Discount System**: Admins can create, manage, and delete promotional coupon codes that apply percentage-based discounts to delivery fees.
-   **Admin Dashboard Analytics**: A dedicated endpoint for admins to fetch key statistics like total users, parcels, revenue, and status breakdowns.
-   **Relational Data Integrity**: Ensures parcels can only be sent to valid, registered users with the `RECEIVER` role.
-   **Modular Architecture**: Organized by feature into distinct modules (`auth`, `user`, `parcel`, `coupon`, `admin`) for maintainability and scalability.
-   **Robust Validation**: Uses **Zod** for type-safe validation of all incoming requests to prevent bad data.
-   **Global Error Handling**: Centralized middleware for consistent and predictable API responses.

## 🛠️ Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Language**: TypeScript
-   **Authentication**: JSON Web Token (JWT)
-   **Validation**: Zod
-   **Dev Tools**: ESLint, Prettier, ts-node-dev

## 🚀 Project Setup

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/EtherSphere01/Parcel-Delivery-API.git
cd parcel-delivery-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and configure the following variables:

<xaiArtifact artifact_id="3f8a7a2c-c54f-4729-8f47-e03cca5b857f" artifact_version_id="dfb11721-bc69-47e7-82e9-b2c4d132d291" title=".env" contentType="text/plain">

# Server Configuration

PORT=5000
NODE_ENV=development

# Database URL

DB_URL=mongodb://localhost:27017/parcel-delivery

# Bcrypt Salt Rounds

BCRYPT_SALT_ROUNDS=10

# JWT Secrets and Expiration

JWT_ACCESS_SECRET=your-super-secret-for-access-token
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your-super-secret-for-refresh-token
JWT_REFRESH_EXPIRES=30d

# Frontend URL

FRONT_END_URL=http://localhost:3000

# Seed Admin

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin@123
ADMIN_PHONE=+8801883747589

</xaiArtifact>

Replace the placeholders (e.g., `your-super-secret-for-access-token`) with secure values. Ensure the `DB_URL` points to your MongoDB instance.

### 4. Running the Application

#### For Development (with auto-reloading):

```bash
npm run dev
```

#### For Production:

1. Build the TypeScript code into JavaScript:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

The server will be running at `http://localhost:5000`.

## ⚙️ Core Functionality

### User Roles

The system supports three distinct user roles with specific permissions:

-   **SENDER**: Can create parcel delivery requests, view their own parcels, and cancel parcels in `REQUESTED` or `APPROVED` states.
-   **RECEIVER**: Can view all parcels addressed to them.
-   **ADMIN**: Has full control, including managing users, parcels, coupons, and accessing dashboard analytics.

### Parcel Lifecycle & Status

Each parcel follows a defined lifecycle, tracked by its status, which is updated by admins:

-   **REQUESTED**: A sender creates a parcel, pending admin approval.
-   **APPROVED**: An admin approves the request, and the parcel is ready for pickup.
-   **DISPATCHED**: The parcel is picked up and en route to the hub.
-   **IN_TRANSIT**: The parcel is between hubs or out for final delivery.
-   **DELIVERED**: The receiver has received the parcel.
-   **CANCELLED**: The sender or admin cancels the parcel (only possible in `REQUESTED` states).

### Fee Calculation & Coupon Usage

-   **Fee Calculation**: The delivery fee is calculated as `Base Fee (50 BDT) + (Weight in kg * 10 BDT)`.
-   **Coupon Application**: Senders can apply an optional `couponCode` during parcel creation. If the code is valid, active, and not expired, a percentage-based discount is applied to the delivery fee.

### Relational Data Integrity

-   Parcels can only be addressed to registered users with the `RECEIVER` role, ensuring data consistency.
-   Mongoose enforces relational constraints through schema validation.

## 🌐 API Endpoint Documentation

**Base URL**: `/api/v1`

### Auth Module (`/auth`)

| Method | Endpoint           | Access            | Description                                   |
| ------ | ------------------ | ----------------- | --------------------------------------------- |
| POST   | `/login`           | Public            | Log in a user to receive auth tokens.         |
| POST   | `/refresh-token`   | Public            | Get a new access token using a refresh token. |
| POST   | `/logout`          | Any Authenticated | Log out the user by clearing auth cookies.    |
| POST   | `/change-password` | Any Authenticated | Change the password for the logged-in user.   |

### User Module (`/user`)

| Method | Endpoint     | Access            | Description                                 |
| ------ | ------------ | ----------------- | ------------------------------------------- |
| POST   | `/register`  | Public            | Register a new SENDER or RECEIVER.          |
| GET    | `/me`        | Any Authenticated | Get the profile of the logged-in user.      |
| GET    | `/all-users` | ADMIN             | Get a list of all users.                    |
| GET    | `/:id`       | ADMIN             | Get details of a single user by ID.         |
| PATCH  | `/:id`       | ADMIN / User      | Update user information (self or any user). |

### Parcel Module (`/parcels`)

| Method | Endpoint             | Access         | Description                                     |
| ------ | -------------------- | -------------- | ----------------------------------------------- |
| POST   | `/`                  | SENDER         | Create a new parcel delivery request.           |
| GET    | `/me`                | SENDER         | Get all parcels created by the sender.          |
| GET    | `/incoming-parcels`  | RECEIVER       | Get all parcels addressed to the receiver.      |
| GET    | `/all`               | ADMIN          | Get a list of all parcels in the system.        |
| PATCH  | `/cancel/:id`        | SENDER / ADMIN | Cancel a parcel in REQUESTED or APPROVED state. |
| PATCH  | `/update-status/:id` | ADMIN          | Update the delivery status of a parcel.         |

### Coupon Module (`/coupons`)

| Method | Endpoint             | Access | Description                            |
| ------ | -------------------- | ------ | -------------------------------------- |
| POST   | `/`                  | ADMIN  | Create a new discount coupon.          |
| GET    | `/`                  | ADMIN  | Get a list of all non-deleted coupons. |
| GET    | `/:id`               | ADMIN  | Get details of a single coupon by ID.  |
| PATCH  | `/:id`               | ADMIN  | Update a coupon's details.             |
| PATCH  | `/toggle-status/:id` | ADMIN  | Activate or deactivate a coupon.       |
| DELETE | `/:id`               | ADMIN  | Soft delete a coupon.                  |

### Admin Module (`/admin`)

| Method | Endpoint           | Access | Description                                  |
| ------ | ------------------ | ------ | -------------------------------------------- |
| GET    | `/dashboard-stats` | ADMIN  | Get aggregated statistics for the dashboard. |

## 📝 Notes

-   Ensure MongoDB is running locally or use a cloud-based MongoDB instance (e.g., MongoDB Atlas) for the `DB_URL`.
-   Use strong, unique secrets for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to ensure security.
-   The admin seed credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_PHONE`) are used to create an initial admin user during setup.

</xaiArtifact>
