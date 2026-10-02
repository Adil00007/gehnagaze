"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

const empty = { logo_url: "", banner_url: "", banner_title: "Jewelry worth looking twice at.", banner_subtitle: "Fine jewelry, handpicked from our Instagram edit." };

export default function AdminContentPage() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  useEffect(() => {
    fetch("/api/site-content").then((response) => response.json()).then((data) => setForm({ ...empty, ...(data.settings || {}) }));
  }, []);

  async function upload(event, field) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(field);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json().catch(() => ({}));
    setUploading("");
    if (!response.ok) return setError(data.error || "Upload failed");
    setForm((current) => ({ ...current, [field]: data.url }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const response = await fetch("/api/site-content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) return setError(data.error || "Could not save site content");
    setForm({ ...empty, ...(data.settings || {}) });
  }

  return (
    <AdminShell title="Site content">
      <p className="text-sm text-ink/50 mb-6 max-w-xl">Update the storefront logo, homepage banner, and hero copy without changing code.</p>
      <form onSubmit={save} className="max-w-3xl border border-ink/15 p-6 grid gap-6">
        <AssetField label="Logo image" value={form.logo_url} uploading={uploading === "logo_url"} onUpload={(event) => upload(event, "logo_url")} />
        <AssetField label="Homepage banner image" value={form.banner_url} uploading={uploading === "banner_url"} onUpload={(event) => upload(event, "banner_url")} />
        <Field label="Hero title" value={form.banner_title} onChange={(value) => setForm({ ...form, banner_title: value })} />
        <label><span className="text-xs text-ink/50 mb-1.5 block">Hero supporting text</span><textarea rows={3} className="w-full border border-ink/25 px-4 py-2.5 outline-none focus-ring" value={form.banner_subtitle} onChange={(event) => setForm({ ...form, banner_subtitle: event.target.value })} /></label>
        {error && <p className="text-sm text-rose">{error}</p>}
        <button className="btn btn-primary w-fit" disabled={saving}>{saving ? "Saving…" : "Save site content"}</button>
      </form>
    </AdminShell>
  );
}

function Field({ label, value, onChange }) { return <label><span className="text-xs text-ink/50 mb-1.5 block">{label}</span><input className="w-full border border-ink/25 px-4 py-2.5 outline-none focus-ring" value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function AssetField({ label, value, uploading, onUpload }) { return <div><span className="text-xs text-ink/50 mb-1.5 block">{label}</span><div className="flex items-center gap-4"><div className="w-28 h-20 bg-ivory-dim overflow-hidden">{value && <img src={value} alt="" className="w-full h-full object-cover" />}</div><label className="btn btn-outline cursor-pointer text-sm">{uploading ? "Uploading…" : "Upload image"}<input type="file" accept="image/*" className="hidden" onChange={onUpload} /></label></div></div>; }