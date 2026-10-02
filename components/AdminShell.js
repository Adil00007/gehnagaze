"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/content", label: "Site content" },
];

export default function AdminShell({ children, title }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid md:grid-cols-[220px_1fr] bg-ivory">
      <aside className="border-r border-ink/10 p-6 flex flex-col">
        <Link href="/" className="font-display text-xl mb-10">
          Gehna <span className="text-gold">Gaze</span>
          <span className="block text-xs text-ink/40 font-body tracking-wide mt-0.5">
            ADMIN
          </span>
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-sm ${
                pathname === l.href ? "bg-ink text-ivory" : "hover:bg-ink/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-auto text-sm text-ink/50 hover:text-rose text-left px-3 py-2"
        >
          Log out
        </button>
      </aside>
      <div className="p-8 md:p-12">
        <h1 className="text-2xl mb-8">{title}</h1>
        {children}
      </div>
    </div>
  );
}
