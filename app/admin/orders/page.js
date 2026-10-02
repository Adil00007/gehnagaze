"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { formatPrice } from "@/lib/site";

const statuses = ["pending", "confirmed", "shipped", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load orders");
      setOrders(data.orders || []);
    } catch (err) {
      setOrders([]);
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <AdminShell title="Orders">
      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : error ? (
        <p className="text-sm text-rose">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-ink/50">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-ink/15 p-5">
              <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                <div>
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-ink/50">
                    {o.phone} · {o.address}
                  </div>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value)}
                  className="border border-ink/25 text-xs px-2 py-1.5 capitalize"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-ink/60 mb-3">
                Paid via {o.payment_method} · Ref: {o.transaction_id || "—"}
              </div>
              <div className="text-sm space-y-1 mb-3">
                {(o.items || []).map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {item.qty} × {item.name}
                    </span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-medium border-t border-ink/10 pt-3">
                <span>Total</span>
                <span>{formatPrice(o.total)}</span>
              </div>
              {o.notes && <div className="text-xs text-ink/50 mt-3">Note: {o.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
