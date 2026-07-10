import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";
const AUTH_STORAGE_KEY = "sc_session";

export type AuthSession = {
  token: string;
  userId: string;
  user?: any;
  role?: string;
  authHeader?: string;
};

export function setAuth(session: AuthSession | null) {
  if (!session) {
    clearAuth();
    return;
  }

  const role = session.role || session.user?.role?.name || "";
  const authHeader = session.authHeader || `Bearer ${session.token}`;

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...session, role, authHeader }));
  localStorage.setItem("sc_token", session.token);
  localStorage.setItem("sc_userId", session.userId);
  localStorage.setItem("sc_role", role);
  localStorage.setItem("sc_authHeader", authHeader);

  if (session.user) {
    localStorage.setItem("sc_user", JSON.stringify(session.user));
  } else {
    localStorage.removeItem("sc_user");
  }
}

export function getAuth(): AuthSession | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as AuthSession;
      if (parsed?.token && parsed?.userId) {
        return parsed;
      }
    } catch {}
  }

  const token = localStorage.getItem("sc_token");
  const userId = localStorage.getItem("sc_userId");
  const role = localStorage.getItem("sc_role") || undefined;
  const authHeader = localStorage.getItem("sc_authHeader") || undefined;
  const userRaw = localStorage.getItem("sc_user");
  let user = undefined;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {}
  }

  if (token && userId) return { token, userId, user, role, authHeader };
  return null;
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("sc_token");
  localStorage.removeItem("sc_userId");
  localStorage.removeItem("sc_role");
  localStorage.removeItem("sc_authHeader");
  localStorage.removeItem("sc_user");
}

function authHeaders() {
  const authHeader = localStorage.getItem("sc_authHeader");
  if (authHeader) {
    return { Authorization: authHeader };
  }

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

export async function getTopProducts(period: "day" | "month" | "year") {
  const res = await axios.get(`${BASE}/orders/top-products?period=${period}`, { headers: authHeaders() });
  return res.data;
}

export async function cancelOrder(orderId: string) {
  const res = await axios.patch(`${BASE}/orders/${orderId}/cancel`, {}, { headers: authHeaders() });
  return res.data;
}

export async function getCategories() {
  const res = await axios.get(`${BASE}/products/categories`, { headers: authHeaders() });
  return res.data;
}

export async function getUsers() {
  const res = await axios.get(`${BASE}/users`, { headers: authHeaders() });
  return res.data;
}

export async function createUser(data: { firstName: string; lastName: string; email: string; password: string; roleId: string }) {
  const res = await axios.post(`${BASE}/users`, data, { headers: { ...authHeaders(), "Content-Type": "application/json" } });
  return res.data;
}

export async function getRoles() {
  const res = await axios.get(`${BASE}/roles`, { headers: authHeaders() });
  return res.data;
}

export async function getAllTables() {
  const res = await axios.get(`${BASE}/tables`, { headers: authHeaders() });
  return res.data;
}

export async function createTable() {
  const res = await axios.post(`${BASE}/tables`, {}, { headers: { ...authHeaders(), "Content-Type": "application/json" } });
  return res.data;
}

export async function deleteTable(tableId: string) {
  const res = await axios.delete(`${BASE}/tables/${tableId}`, { headers: authHeaders() });
  return res.data;
}

export async function updateTableStatus(tableId: string, isInUse: boolean) {
  const res = await axios.patch(`${BASE}/tables/${tableId}/status`, { isInUse }, { headers: { ...authHeaders(), "Content-Type": "application/json" } });
  return res.data;
}
