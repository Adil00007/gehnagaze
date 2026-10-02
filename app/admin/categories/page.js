"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

const emptyForm = { id: null, name: "", image_url: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const response = await fetch("/api/categories");
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setError(data.error || "Could not load categories");
    setCategories(data.categories || []);
  }

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, []);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json().catch(() => ({}));
    setUploading(false);
    if (!response.ok) return setError(data.error || "Upload failed");
    setForm((current) => ({ ...current, image_url: data.url }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const response = await fetch(form.id ? `/api/categories/${form.id}` : "/api/categories", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, image_url: form.image_url }),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) return setError(data.error || "Could not save category");
    setForm(emptyForm);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this category? Products will keep their category text.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell title="Categories">
      <p className="text-sm text-ink/50 mb-6 max-w-xl">Create visual category collections for the storefront. Product category text should match these names.</p>
      <form onSubmit={save} className="border border-ink/15 p-6 mb-10 grid md:grid-cols-2 gap-5">
        <div className="flex items-center gap-4 md:col-span-2">
          {form.image_url ? <img src={form.image_url} alt="" className="w-20 h-20 object-cover" /> : <div className="w-20 h-20 bg-ivory-dim" />}
          <label className="btn btn-outline cursor-pointer text-sm">{uploading ? "Uploading…" : "Upload category image"}<input type="file" accept="image/*" className="hidden" onChange={upload} /></label>
        </div>
        <label className="block">
          <span className="text-xs text-ink/50 mb-1.5 block">Category name</span>
          <input required className="w-full border border-ink/25 px-4 py-2.5 outline-none focus-ring" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Earrings" />
        </label>
        {error && <p className="text-sm text-rose md:col-span-2">{error}</p>}
        <div className="flex gap-3 items-end">
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : form.id ? "Save changes" : "Add category"}</button>
          {form.id && <button type="button" className="btn btn-outline" onClick={() => setForm(emptyForm)}>Cancel</button>}
        </div>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map((category) => (
          <div key={category.id} className="border border-ink/15">
            <div className="aspect-square bg-ivory-dim overflow-hidden">{category.image_url && <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />}</div>
            <div className="p-3 flex items-center justify-between gap-2"><span className="font-display text-lg truncate">{category.name}</span><span className="flex gap-2 text-xs"><button className="underline" onClick={() => setForm(category)}>Edit</button><button className="text-rose underline" onClick={() => remove(category.id)}>Delete</button></span></div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}