# Stage Cafe Frontend

This is a small React + Vite frontend that connects to the backend API implemented in this repo.

Quick start

1. Install dependencies

```bash
cd frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open the app at the printed Vite URL (usually http://localhost:5173)

Notes

- The app expects the backend API base URL at `http://localhost:3000/api` by default. You can change it by setting `VITE_API_BASE`.
- For testing, sign in by pasting a valid JWT token and `userId` from your backend authentication into the Login screen.
- Pages:
  - Orders: lists recent orders from `GET /api/orders`.
  - Create Multiple Orders: submit multiple orders in a single request to `POST /api/orders/bulk`.

