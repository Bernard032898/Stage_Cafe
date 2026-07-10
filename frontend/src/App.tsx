import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import OrdersList from "./components/OrdersList";
import BulkOrderForm from "./components/BulkOrderForm";
import AddProduct from "./components/AddProduct";
import ManageUsers from "./components/ManageUsers";
import ManageInventory from "./components/ManageInventory";
import ManageTables from "./components/ManageTables";
import { getAuth, clearAuth, AuthSession } from "./services/api";

export default function App() {
  const [view, setView] = useState<"orders" | "bulk" | "add" | "login" | "users" | "inventory" | "tables">("login");
  const [auth, setAuth] = useState<AuthSession | null>(null);

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
              {auth.role === "Admin" && (
                <>
                  <button onClick={() => setView("tables")} style={{ marginLeft: 16 }}>Manage Tables</button>
                  <button onClick={() => setView("inventory")}>Manage Inventory</button>
                  <button onClick={() => setView("users")}>Manage Users</button>
                </>
              )}
              <button onClick={handleLogout} style={{ marginLeft: 16 }}>Logout</button>
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
        {auth && view === "inventory" && <ManageInventory />}
        {auth && view === "tables" && <ManageTables />}
        {auth && view === "users" && <ManageUsers />}
      </main>

      <footer className="footer">Built for Stage Cafe</footer>
    </div>
  );
}
