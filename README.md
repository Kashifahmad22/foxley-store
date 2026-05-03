# Foxley Store (Full-stack MVP)

## Frontend
```bash
npm install
npm run dev
```
Set `.env`:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
```

## Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Required backend env:
- `MONGO_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `CLIENT_URL`

## APIs
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/orders`
- `GET /api/orders/me`
- `GET /api/orders` (admin)
- `PUT /api/orders/:id/status` (admin)
- `POST /api/orders/payment/create`
- `POST /api/orders/payment/verify`
