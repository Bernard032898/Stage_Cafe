import React, { useEffect, useState } from "react";
import { getAllTables, createTable, deleteTable } from "../services/api";

export default function ManageTables() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTables();
      setTables(data || []);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to load tables";
      console.error("Load tables error:", err);
      setError(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTable() {
    setCreating(true);
    try {
      await createTable();
      alert("Table created successfully");
      loadTables();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to create table");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteTable(id: string, tableNum: number) {
    if (!confirm(`Delete Table ${tableNum}?`)) return;

    try {
      await deleteTable(id);
      alert("Table deleted successfully");
      loadTables();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to delete table");
    }
  }

  return (
    <div>
      <h2>Manage Tables</h2>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <button
          onClick={handleCreateTable}
          disabled={creating || loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#51cf66",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: creating || loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: creating || loading ? 0.6 : 1,
          }}
        >
          {creating ? "Adding Table..." : "Add New Table"}
        </button>
        <button
          onClick={loadTables}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#748ffc",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && <p>Loading tables...</p>}

      {tables.length === 0 && !loading && (
        <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>
          No tables found. Click "Add New Table" to get started.
        </p>
      )}

      {tables.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#495057",
                    fontSize: 14,
                  }}
                >
                  Table #
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#495057",
                    fontSize: 14,
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => {
                const activeOrderCount = table.isInUse ? (table.orders?.length || 0) : 0;
                const isInUse = table.isInUse;

                return (
                  <tr
                    key={table.id}
                    style={{
                      borderBottom: "1px solid #e9ecef",
                      backgroundColor: "#fff",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#212529",
                      }}
                    >
                      {table.tableNumber}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => handleDeleteTable(table.id, table.tableNumber)}
                        disabled={isInUse && activeOrderCount > 0}
                        title={isInUse && activeOrderCount > 0 ? "Cannot delete table with active orders" : "Delete table"}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: isInUse && activeOrderCount > 0 ? "#ccc" : "#ff6b6b",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: isInUse && activeOrderCount > 0 ? "not-allowed" : "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          opacity: isInUse && activeOrderCount > 0 ? 0.5 : 1,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
