"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

const emptyForm = { id: null, title: "", description: "", percentage: "", active: false };

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/discounts");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load announcements");
      setDiscounts(data.discounts || []);
    } catch (err) {
      setDiscounts([]);
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      description: form.description,
      percentage: form.percentage ? Number(form.percentage) : null,
      active: form.active,
    };
    const res = await fetch(form.id ? `/api/discounts/${form.id}` : "/api/discounts", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Could not save");
      return;
    }
    setForm(emptyForm);
    load();
  }

  async function toggleActive(d) {
    await fetch(`/api/discounts/${d.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !d.active }),
    });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/discounts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell title="Discounts & announcements">
      <p className="text-sm text-ink/50 mb-6 max-w-xl">
        The active announcement shows as a banner across the whole site instantly —
        no redeploy needed. Only one can be active at a time.
      </p>

      <form onSubmit={save} className="border border-ink/15 p-6 mb-10 grid md:grid-cols-2 gap-5">
        <label className="block md:col-span-2">
          <span className="text-xs text-ink/50 mb-1.5 block">Title</span>
          <input
            required
            className="w-full border border-ink/25 px-4 py-2.5 outline-none focus-ring"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Eid Sale"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs text-ink/50 mb-1.5 block">Description</span>
          <input
            className="w-full border border-ink/25 px-4 py-2.5 outline-none focus-ring"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="On all earrings, this week only"
          />
        </label>
        <label className="block">
          <span className="text-xs text-ink/50 mb-1.5 block">Percentage off (optional)</span>
          <input
            type="number"
            className="w-full border border-ink/25 px-4 py-2.5 outline-none focus-ring"
            value={form.percentage}
            onChange={(e) => update("percentage", e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm mt-6">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
          />
          Make active now
        </label>

        {error && <p className="text-sm text-rose md:col-span-2">{error}</p>}

        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving…" : form.id ? "Save changes" : "Create announcement"}
          </button>
          {form.id && (
            <button type="button" className="btn btn-outline" onClick={() => setForm(emptyForm)}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : discounts.length === 0 ? (
        <p className="text-sm text-ink/50">No announcements yet.</p>
      ) : (
        <div className="divide-y divide-ink/10 border-t border-ink/10">
          {discounts.map((d) => (
            <div key={d.id} className="flex items-center gap-4 py-4">
              <div className="flex-1">
                <div className="font-medium">
                  {d.title} {d.percentage ? `· ${d.percentage}% off` : ""}
                </div>
                <div className="text-xs text-ink/50">{d.description}</div>
              </div>
              <button
                onClick={() => toggleActive(d)}
                className={`text-xs px-3 py-1.5 border ${
                  d.active ? "bg-emerald text-ivory border-emerald" : "border-ink/25"
                }`}
              >
                {d.active ? "Active" : "Inactive"}
              </button>
              <div className="flex gap-2 shrink-0">
                <button className="text-xs underline" onClick={() => setForm(d)}>
                  Edit
                </button>
                <button className="text-xs text-rose underline" onClick={() => remove(d.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
