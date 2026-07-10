import React, { useEffect, useState } from "react";
import { fetchOrders, completeOrder, cancelOrder } from "../services/api";
import Stats from "./Stats";
import { getProductImageUrl, getFallbackProductImageUrl } from "../utils/productImage";

export default function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    function onOrdersCreated() { load(); }
    window.addEventListener("orders.created", onOrdersCreated as EventListener);
    return () => window.removeEventListener("orders.created", onOrdersCreated as EventListener);
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "cancelled") return order.isCancelled;
    if (filter === "completed") return order.isCompleted && !order.isCancelled;
    return !order.isCompleted && !order.isCancelled;
  });

  async function handleCancel(orderId: string) {
    if (!confirm("Cancel this order?")) return;
    try {
      await cancelOrder(orderId);
      window.dispatchEvent(new CustomEvent('orders.created'));
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel order');
    }
  }

  return (
    <div>
      <Stats />
      <div className="header">
        <div>
          <h2>Orders</h2>
          <p className="muted">Filter by status to view completed or in-progress orders.</p>
        </div>
        <div className="filter-row">
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All Orders</option>
            <option value="pending">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={load}>Refresh</button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {filteredOrders.length === 0 && !loading && <p className="muted">No orders match that status yet.</p>}
      <div className="orders-grid">
        {filteredOrders.map((o) => (
          <div className="order-card" key={o.id}>
            <img
              className="order-image"
              src={getProductImageUrl(o.items[0]?.product?.name || o.orderNumber || "coffee drink")}
              alt={o.items[0]?.product?.name || "Coffee drink"}
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).src = getFallbackProductImageUrl();
              }}
            />
            <div className="order-card-content">
              <div className="card-header">
                <div>
                  <strong>{o.orderNumber}</strong>
                  <div className="muted small">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className={`status-badge ${o.isCancelled ? "cancelled" : o.isCompleted ? "completed" : "pending"}`}>
                  {o.isCancelled ? "Cancelled" : o.isCompleted ? "Completed" : "Pending"}
                </div>
              </div>

              <div className="order-details">
                <div>Table: <strong>{o.table?.tableNumber ?? "-"}</strong></div>
                <div>Total: <strong>${o.total}</strong></div>
              </div>

              <div className="order-items">
                {o.items.map((it: any) => (
                  <div key={it.id} className="order-item">
                    <div>{it.product?.name}</div>
                    <div>{it.quantity} × ${it.price}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {!o.isCompleted && !o.isCancelled && (
                  <>
                    <button className="complete-button" onClick={async () => {
                      try {
                        await completeOrder(o.id);
                        window.dispatchEvent(new CustomEvent('orders.created'));
                        load();
                      } catch (err) {
                        console.error(err);
                        alert('Failed to complete order');
                      }
                    }} style={{ flex: 1 }}>
                      Mark Complete
                    </button>
                    <button className="secondary-button" onClick={() => handleCancel(o.id)} style={{ flex: 1 }}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
