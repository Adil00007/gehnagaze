"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { formatPrice } from "@/lib/site";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  discounted_price: "",
  category: "",
  in_stock: true,
  image_url: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load products");
      setProducts(data.products || []);
    } catch (err) {
      setProducts([]);
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

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    update("image_url", data.url);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discounted_price: form.discounted_price ? Number(form.discounted_price) : null,
      category: form.category,
      in_stock: form.in_stock,
      image_url: form.image_url,
    };
    const res = await fetch(form.id ? `/api/products/${form.id}` : "/api/products", {
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

  async function remove(id) {
    if (!confirm("Delete this piece? This can't be undone.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  function edit(product) {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      discounted_price: product.discounted_price || "",
      category: product.category || "",
      in_stock: product.in_stock,
      image_url: product.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AdminShell title="Products">
      <form onSubmit={save} className="border border-ink/15 p-6 mb-10 grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2 flex items-center gap-4">
          {form.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image_url} alt="" className="w-20 h-24 object-cover bg-ivory-dim" />
          ) : (
            <div className="w-20 h-24 bg-ivory-dim flex items-center justify-center text-xs text-ink/40">
              No photo
            </div>
          )}
          <label className="btn btn-outline cursor-pointer text-sm">
            {uploading ? "Uploading…" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        </div>

        <TextField label="Name" value={form.name} onChange={(v) => update("name", v)} required />
        <TextField label="Category" value={form.category} onChange={(v) => update("category", v)} />
        <TextField
          label="Price (PKR)"
          type="number"
          value={form.price}
          onChange={(v) => update("price", v)}
          required
        />
        <TextField
          label="Discounted price (optional)"
          type="number"
          value={form.discounted_price}
          onChange={(v) => update("discounted_price", v)}
        />
        <label className="md:col-span-2 block">
          <span className="text-xs text-ink/50 mb-1.5 block">Description</span>
          <textarea
            className="w-full border border-ink/25 px-4 py-2.5 outline-none focus-ring"
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.in_stock}
            onChange={(e) => update("in_stock", e.target.checked)}
          />
          In stock
        </label>

        {error && <p className="text-sm text-rose md:col-span-2">{error}</p>}

        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving…" : form.id ? "Save changes" : "Add product"}
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
      ) : products.length === 0 ? (
        <p className="text-sm text-ink/50">No products yet — add your first one above.</p>
      ) : (
        <div className="divide-y divide-ink/10 border-t border-ink/10">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 py-4">
              <div className="w-14 h-16 bg-ivory-dim shrink-0 overflow-hidden">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-ink/50">
                  {p.category || "Uncategorized"} · {p.in_stock ? "In stock" : "Sold out"}
                </div>
              </div>
              <div className="text-sm w-28 text-right">
                {p.discounted_price ? (
                  <>
                    <div className="line-through text-ink/40 text-xs">{formatPrice(p.price)}</div>
                    <div className="text-rose">{formatPrice(p.discounted_price)}</div>
                  </>
                ) : (
                  formatPrice(p.price)
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="text-xs underline" onClick={() => edit(p)}>
                  Edit
                </button>
                <button className="text-xs text-rose underline" onClick={() => remove(p.id)}>
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

function TextField({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      <span className="text-xs text-ink/50 mb-1.5 block">{label}</span>
      <input
        type={type}
        required={required}
        className="w-full border border-ink/25 px-4 py-2.5 outline-none focus-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
