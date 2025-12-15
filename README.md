# 💼 Wallet Service API

A simple wallet service built with **NestJS**, **TypeORM**, and **SQLite**.

This service supports:
- Wallet creation
- Funding wallets
- Transferring funds between wallets
- Fetching wallet details with transaction history
- Idempotent fund operations

The focus of this project is **clarity, correctness, and safe money handling**, not over-engineering.

---

## ⚠️ IMPORTANT DISCLAIMER (PLEASE READ)

**This API is hosted on Render's Free Tier.**

Render free services **spin down after a period of inactivity**.  

As a result:

**👉 The first request after inactivity may take up to ~50 seconds to respond.**

This is expected behavior due to cold-start delays and **not a bug** in the application.

Please take this into consideration during testing. Subsequent requests will respond normally once the service is awake.

---

## 🛠 Tech Stack

- **Node.js**
- **NestJS**
- **TypeScript**
- **TypeORM**
- **SQLite**
- **Jest** (unit tests)

---

## 🚀 Live API

https://wallet-service-dxdp.onrender.com

---

## 📦 Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/wallet-service.git
cd wallet-service
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the application

```bash
npm run start:dev
```

The server will start on: `http://localhost:3000`

---

## 🗄 Database

- Uses SQLite for simplicity
- Runs in-memory for tests
- Uses file-based SQLite in development
- TypeORM manages schema automatically
- No external database setup required

---

## 📘 API Documentation

### Base URL

```
/wallets
```

### Create Wallet

**POST** `/wallets`

```json
{
  "currency": "USD"
}
```

### Fund Wallet

**POST** `/wallets/{walletId}/fund`

**Headers:**
```
Idempotency-Key: <unique-key>
```

**Body:**
```json
{
  "amount": 200
}
```

### Transfer Funds

**POST** `/wallets/transfer`

```json
{
  "fromWalletId": "uuid-1",
  "toWalletId": "uuid-2",
  "amount": 50
}
```

### Get Wallet Details

**GET** `/wallets/{walletId}`

Returns wallet information along with full transaction history.

### Get All Wallets

**GET** `/wallets`

Returns all wallets. An empty array is returned if no wallets exist.

---

## 🔁 Idempotency

- Funding operations support idempotency
- Clients may pass an `Idempotency-Key` header
- Duplicate requests with the same key are safely rejected
- Prevents accidental double-funding during retries
- Idempotency is enforced at the database level to ensure consistency

---

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Tests cover:
- Wallet creation
- Funding behavior
- Transfer validation
- Insufficient balance handling

---

## 🧠 Design Notes

- Wallet balance integrity is strictly enforced
- Transfers are executed inside database transactions
- Each wallet maintains its own ledger-style transaction history
- SQLite is used for simplicity but can be replaced with Postgres easily

---

## 👤 Author

**Built by Ruby**  
Software Engineer

---

## ✅ Notes for Reviewers

- The project prioritizes correctness and clarity
- Error handling and validation are intentional
- Cold-start delays are expected due to free-tier hosting

Thank you for reviewing this project.