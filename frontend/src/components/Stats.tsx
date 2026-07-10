import React, { useEffect, useState } from "react";
import { getIncome, getTopProducts } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Stats() {
  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [topProductsDay, setTopProductsDay] = useState<any[]>([]);
  const [topProductsMonth, setTopProductsMonth] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const d = await getIncome("day");
      const m = await getIncome("month");
      const y = await getIncome("year");
      const topDay = await getTopProducts("day");
      const topMonth = await getTopProducts("month");
      setDay(d.total);
      setMonth(m.total);
      setYear(y.total);
      setTopProductsDay(topDay || []);
      setTopProductsMonth(topMonth || []);
    } catch (err) {
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  }

  // Transform data for charts
  const dayChartData = topProductsDay.slice(0, 10).map(p => ({
    name: p.name,
    quantity: p.quantity,
    revenue: parseFloat(p.revenue || 0)
  }));

  const monthChartData = topProductsMonth.slice(0, 10).map(p => ({
    name: p.name,
    quantity: p.quantity,
    revenue: parseFloat(p.revenue || 0)
  }));

  return (
    <div style={{ marginBottom: 12 }}>
      <h3>Income</h3>
      <div className="stats-grid">
        <div className="card stat">
          <div className="muted">Today</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>${day ?? 0}</div>
        </div>
        <div className="card stat">
          <div className="muted">This Month</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>${month ?? 0}</div>
        </div>
        <div className="card stat">
          <div className="muted">This Year</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>${year ?? 0}</div>
        </div>
      </div>
      
      <h3 style={{ marginTop: 24 }}>Top Products Trends</h3>
      
      {loading ? (
        <p className="muted">Loading data...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          {/* Today's Chart */}
          <div className="card" style={{ padding: 16 }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: 14, fontWeight: 600 }}>Today's Top Products</h4>
            {dayChartData.length === 0 ? (
              <p className="muted">No products sold today</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dayChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#51cf66" name="Quantity Sold" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Last Month's Chart */}
          <div className="card" style={{ padding: 16 }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: 14, fontWeight: 600 }}>Last Month's Top Products</h4>
            {monthChartData.length === 0 ? (
              <p className="muted">No products sold this month</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#748ffc" name="Quantity Sold" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {!loading && topProductsDay.length > 0 && (
        <div className="card" style={{ marginTop: 24, padding: 16 }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: 14, fontWeight: 600 }}>Trends Summary</h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: 12 }}>Product</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, fontSize: 12 }}>Today</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, fontSize: 12 }}>This Month</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, fontSize: 12 }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProductsDay.slice(0, 5).map((todayProduct) => {
                  const monthProduct = topProductsMonth.find(m => m.productId === todayProduct.productId);
                  const monthQty = monthProduct?.quantity || 0;
                  const todayQty = todayProduct.quantity || 0;
                  const trend = monthQty > 0 ? ((todayQty - monthQty) / monthQty * 100) : 0;
                  const isUp = trend >= 0;

                  return (
                    <tr key={todayProduct.productId} style={{ borderBottom: "1px solid #e9ecef" }}>
                      <td style={{ padding: "8px 12px", fontSize: 13, fontWeight: 500 }}>{todayProduct.name}</td>
                      <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 13, color: "#51cf66", fontWeight: 600 }}>{todayQty}</td>
                      <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 13, color: "#748ffc", fontWeight: 600 }}>{Math.round(monthQty / 30) || "-"}</td>
                      <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 13 }}>
                        <span style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          backgroundColor: isUp ? "#e7f5e9" : "#ffe0e0",
                          color: isUp ? "#2f9e44" : "#c92a2a",
                          fontWeight: 600,
                          fontSize: 11
                        }}>
                          {isUp ? "↑" : "↓"} {Math.abs(trend).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={load} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
      </div>
    </div>
  );
}
