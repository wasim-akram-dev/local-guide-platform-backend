# Locana | A Local Tour Guide Finder — Backend (Node.js, Express, Prisma, PostgreSQL)

A complete backend for a **Locana | A Local Tour Guide Finder** platform where tourists can book trips, write reviews, and interact with verified guides.

Built with **Node.js**, **Express**, **Prisma ORM**, **PostgreSQL**, **Zod**, **JWT authentication**, and **role-based access control**.

---

## 🚀 Features

### **User & Auth Module**

- Tourist, Guide, Admin roles
- JWT-based authentication
- Role-based authorization
- Profile management
- Guide verification flag

### **Listings Module**

- Guides can create/edit/delete listings
- Tourists can browse listings
- Listing images (array)
- Category & availability support

### **Bookings Module**

- Tourists can request bookings
- Guides can Accept / Reject
- Guides can mark as Completed
- Tourists can Cancel
- Clean status workflow
- Prevent duplicates

### **Reviews Module**

- Only tourists can review guides
- Only after completed bookings
- One review per booking
- Ratings from 1–5
- Adds average rating to listings

### **Payments Module**

- Tracks booking payments
- Payment status: `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`
- Amount, method, transaction ID
- One payment per booking
- Webhook support (future ready)

---

## 🏗 Tech Stack

| Layer         | Technology                  |
| ------------- | --------------------------- |
| Language      | TypeScript                  |
| Runtime       | Node.js                     |
| Framework     | Express.js                  |
| Database ORM  | Prisma                      |
| Database      | PostgreSQL                  |
| Validation    | Zod                         |
| Auth          | JWT                         |
| Security      | bcrypt, cookie-parser, cors |
| File Uploads  | Multer / External URLs      |
| Documentation | Markdown                    |

---

## 📦 Project Structure

```
src/
 ┣ modules/
 │   ┣ users/
 │   ┣ listings/
 │   ┣ bookings/
 │   ┣ reviews/
 │   ┗ payments/
 ┣ middlewares/
 ┣ utils/
 ┣ prisma/
 ┗ app.ts
```

---

## 🔐 Environment Variables

Create **.env**:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

PORT=5000

# BCRYPT
BCRYPT_SALT_ROUND=7

# JWT
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES=1d
-------------------------------
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES=30d
```

---

## 📘 Available Endpoints

### **Auth & Users**

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| POST   | `/auth/register` | Register user   |
| POST   | `/auth/login`    | Login           |
| GET    | `/users/me`      | Get own profile |
| PATCH  | `/users/me`      | Update profile  |

### **Listings**

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | `/listings` (Guide only)     |
| GET    | `/listings`                  |
| GET    | `/listings/:id`              |
| PATCH  | `/listings/:id` (Guide only) |
| DELETE | `/listings/:id` (Guide only) |

### **Bookings**

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | `/bookings` (Tourist)  |
| GET    | `/bookings`            |
| PATCH  | `/bookings/:id/status` |

### **Reviews**

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/reviews` (Tourist only) |
| GET    | `/reviews/guide/:guideId` |

### **Payments**

| Method | Endpoint                       |
| ------ | ------------------------------ |
| POST   | `/payments/initiate`           |
| GET    | `/payments/booking/:bookingId` |
| PATCH  | `/payments/webhook`            |

---

## 🎯 Core Booking Workflow

```
PENDING → ACCEPTED → COMPLETED
PENDING → REJECTED
PENDING/ACCEPTED → CANCELLED (Tourist only)
```

---

## ⭐ Review Rules

- Only **tourist** can review
- Booking must be **COMPLETED**
- One review per booking

---

## 💳 Payment Rules

- One payment per booking
- Payment statuses:

  - `PENDING`
  - `SUCCESS`
  - `FAILED`
  - `REFUNDED`

---

## 🛠 Run Locally

### Install dependencies

```sh
npm install
```

### Push Prisma schema

```sh
npx prisma migrate dev
```

### Start server

```sh
npm run dev
```

---

## 📚 Future Enhancements

- SSLCommerz / Stripe integration
- Email notifications
- Guide verification workflow
- Analytics dashboard

---

## 🤝 Contributing

Pull requests are welcome!
