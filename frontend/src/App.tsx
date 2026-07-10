import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import OrdersList from "./components/OrdersList";
import BulkOrderForm from "./components/BulkOrderForm";
import AddProduct from "./components/AddProduct";
import { getAuth, clearAuth } from "./services/api";

export default function App() {
  const [view, setView] = useState<"orders" | "bulk" | "add" | "login">("login");
  const [auth, setAuth] = useState<{ token: string; userId: string } | null>(null);

  useEffect(() => {
    const a = getAuth();
    if (a) {
      setAuth(a);
      setView("orders");
    }
  }, []);

  function handleLogout() {
    clearAuth();
    setAuth(null);
    setView("login");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Stage Cafe</h1>
        <nav>
          {auth && (
            <>
              <button onClick={() => setView("orders")}>Orders</button>
              <button onClick={() => setView("bulk")}>Create Multiple Orders</button>
              <button onClick={() => setView("add")}>Add Product</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        {!auth && (
          <Login onLogin={(a) => { setAuth(a); setView("orders"); }} />
        )}

        {auth && view === "orders" && <OrdersList />}
        {auth && view === "bulk" && <BulkOrderForm />}
        {auth && view === "add" && <AddProduct onCreated={() => setView("bulk")} />}
      </main>

      <footer className="footer">Built for Stage Cafe</footer>
    </div>
  );
}
