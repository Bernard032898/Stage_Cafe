import React, { useEffect, useState } from "react";
import { getIncome } from "../services/api";

export default function Stats() {
  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const d = await getIncome("day");
      const m = await getIncome("month");
      const y = await getIncome("year");
      setDay(d.total);
      setMonth(m.total);
      setYear(y.total);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

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
      <div style={{ marginTop: 8 }}>
        <button onClick={load} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
      </div>
    </div>
  );
}
