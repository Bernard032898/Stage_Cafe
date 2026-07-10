import React, { useState } from "react";
import { setAuth, login } from "../services/api";

export default function Login({ onLogin }: { onLogin: (a: { token: string; userId: string; user?: any }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return alert("Email and password are required");
    setLoading(true);
    try {
      const res = await login(email, password); // { token, user }
      const token = res.token;
      const userId = res.user?.id;
      const role = res.user?.role?.name || res.role || "";
      if (!token || !userId) throw new Error("Invalid login response");

      const session = { token, userId, user: res.user, role };
      setAuth(session);
      onLogin(session);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Sign in</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </div>
      </form>
      <p className="muted">Sign in using your account email and password.</p>
    </div>
  );
}
