import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export function setAuth(token: string, userId: string) {
  localStorage.setItem("sc_token", token);
  localStorage.setItem("sc_userId", userId);
}

export function getAuth(): { token: string; userId: string } | null {
  const token = localStorage.getItem("sc_token");
  const userId = localStorage.getItem("sc_userId");
  if (token && userId) return { token, userId };
  return null;
}

export function clearAuth() {
  localStorage.removeItem("sc_token");
  localStorage.removeItem("sc_userId");
}

function authHeaders() {
  const token = localStorage.getItem("sc_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchProducts() {
  const res = await axios.get(`${BASE}/products`, { headers: authHeaders() });
  return res.data;
}

export async function fetchTables() {
  const res = await axios.get(`${BASE}/orders/tables`, { headers: authHeaders() });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await axios.post(`${BASE}/auth/login`, { email, password }, { headers: { "Content-Type": "application/json" } });
  return res.data; // { token, user }
}

export async function createBulkOrders(userId: string, orders: any[]) {
  const res = await axios.post(
    `${BASE}/orders/bulk`,
    { orders },
    { headers: { ...authHeaders(), "Content-Type": "application/json" } }
  );
  return res.data;
}

export async function fetchOrders() {
  const res = await axios.get(`${BASE}/orders`, { headers: authHeaders() });
  return res.data;
}

export async function createProduct(data: any) {
  const res = await axios.post(`${BASE}/products`, data, { headers: { ...authHeaders(), "Content-Type": "application/json" } });
  return res.data;
}

export async function completeOrder(orderId: string) {
  const res = await axios.patch(`${BASE}/orders/${orderId}/complete`, {}, { headers: authHeaders() });
  return res.data;
}

export async function getIncome(period: "day" | "month" | "year") {
  const res = await axios.get(`${BASE}/orders/income?period=${period}`, { headers: authHeaders() });
  return res.data;
}
