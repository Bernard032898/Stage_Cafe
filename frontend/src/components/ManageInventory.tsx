import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";

export default function ManageInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    function onProductsUpdated() {
      loadProducts();
    }
    window.addEventListener("products.updated", onProductsUpdated as EventListener);
    return () =>
      window.removeEventListener("products.updated", onProductsUpdated as EventListener);
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Manage Inventory</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={loadProducts} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && <p>Loading products...</p>}

      {products.length === 0 && !loading && <p className="muted">No products found</p>}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "2px solid #ddd",
                textAlign: "left",
                padding: 8,
              }}
            >
              <th style={{ padding: 8 }}>Product</th>
              <th style={{ padding: 8 }}>Category</th>
              <th style={{ padding: 8 }}>Price</th>
              <th style={{ padding: 8 }}>Stock</th>
              <th style={{ padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid #eee",
                  backgroundColor: Number(p.stock) <= 5 ? "#ffe6e6" : "transparent",
                }}
              >
                <td style={{ padding: 8 }}>{p.name}</td>
                <td style={{ padding: 8 }}>{p.category?.name || "N/A"}</td>
                <td style={{ padding: 8 }}>${p.price}</td>
                <td style={{ padding: 8, fontWeight: 700 }}>{Number(p.stock) || 0}</td>
                <td style={{ padding: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: 4,
                      backgroundColor:
                        Number(p.stock) <= 5
                          ? "#ff6b6b"
                          : Number(p.stock) <= 20
                            ? "#ffd43b"
                            : "#51cf66",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {Number(p.stock) <= 5
                      ? "Low"
                      : Number(p.stock) <= 20
                        ? "Medium"
                        : "Good"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
