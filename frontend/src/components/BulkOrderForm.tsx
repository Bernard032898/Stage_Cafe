import React, { useEffect, useState } from "react";
import { fetchProducts, fetchTables, createBulkOrders, getAuth } from "../services/api";

function emptyOrder() {
  return { tableNumber: undefined as number | undefined, items: [{ productId: "", quantity: 1 }] };
}

export default function BulkOrderForm() {
  const [orders, setOrders] = useState<any[]>([emptyOrder()]);
  const [products, setProducts] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadTables();
  }, []);

  useEffect(() => {
    function onProductsUpdated() { loadProducts(); }
    window.addEventListener("products.updated", onProductsUpdated as EventListener);
    return () => window.removeEventListener("products.updated", onProductsUpdated as EventListener);
  }, []);

  async function loadProducts() {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load products. Ensure backend is running and you are authenticated.");
    }
  }

  async function loadTables() {
    try {
      const data = await fetchTables();
      setTables(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load tables. Ensure backend is running and you are authenticated.");
    }
  }

  function addOrder() { setOrders([...orders, emptyOrder()]); }
  function removeOrder(idx: number) { setOrders(orders.filter((_, i) => i !== idx)); }

  function updateOrder(idx: number, delta: any) {
    const copy = [...orders];
    copy[idx] = { ...copy[idx], ...delta };
    setOrders(copy);
  }

  function updateItem(orderIdx: number, itemIdx: number, delta: any) {
    const copy = [...orders];
    const items = [...copy[orderIdx].items];
    items[itemIdx] = { ...items[itemIdx], ...delta };
    copy[orderIdx].items = items;
    setOrders(copy);
  }

  function addItem(orderIdx: number) {
    const copy = [...orders];
    copy[orderIdx].items.push({ productId: "", quantity: 1 });
    setOrders(copy);
  }

  function removeItem(orderIdx: number, itemIdx: number) {
    const copy = [...orders];
    copy[orderIdx].items = copy[orderIdx].items.filter((_: any, i: number) => i !== itemIdx);
    setOrders(copy);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const auth = getAuth();
    if (!auth) return alert("Please login first");

    // basic validation
    for (const ord of orders) {
      if (ord.tableNumber == null || !Array.isArray(ord.items) || ord.items.length === 0) {
        return alert("Each order needs a table number and at least one item");
      }
    }

    setLoading(true);
    try {
      const res = await createBulkOrders(auth.userId, orders.map((o) => ({ tableNumber: o.tableNumber, items: o.items })));
      alert(`Created ${res.length} orders`);
      setOrders([emptyOrder()]);
      // notify other components (orders list) to refresh
      window.dispatchEvent(new CustomEvent("orders.created"));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to create orders");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Create Multiple Orders</h2>
      <form onSubmit={submit}>
        {orders.map((ord, idx) => (
          <div className="card order-form-card" key={idx}>
            <div className="row">
              <div>
                <strong>Order #{idx + 1}</strong>
                <div className="small muted">Add items and choose a table</div>
              </div>
              <button type="button" onClick={() => removeOrder(idx)} disabled={orders.length === 1}>Remove</button>
            </div>

            <div className="grid-2">
              <div>
                <label>Table Number</label>
                <select value={ord.tableNumber ?? ""} onChange={(e) => updateOrder(idx, { tableNumber: e.target.value ? Number(e.target.value) : undefined })}>
                  <option value="">Select a table</option>
                  {tables.length === 0 && <option value="">No table numbers available</option>}
                  {tables.map((table) => (
                    <option key={table.id} value={table.tableNumber}>
                      Table {table.tableNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="order-form-items">
              <h4>Items</h4>
              {ord.items.map((it: any, itIdx: number) => (
                <div key={itIdx} className="item-row item-card">
                  <select value={it.productId} onChange={(e) => updateItem(idx, itIdx, { productId: e.target.value })}>
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                    ))}
                  </select>
                  <input type="number" min={1} value={it.quantity} onChange={(e) => updateItem(idx, itIdx, { quantity: Number(e.target.value) })} />
                  <button type="button" onClick={() => removeItem(idx, itIdx)} disabled={ord.items.length === 1}>Remove</button>
                </div>
              ))}
              <button type="button" className="secondary-button" onClick={() => addItem(idx)}>Add Item</button>
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={addOrder}>Add Another Order</button>
          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Orders"}</button>
        </div>
      </form>
    </div>
  );
}
