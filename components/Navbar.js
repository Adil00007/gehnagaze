"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { site } from "@/lib/site";

export default function Navbar({ branding = {} }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur border-b border-ink/10">
      <div className="container-x flex items-center justify-between h-20">
        <Link href="/" className="font-display text-2xl tracking-wide">
          {branding.logo_url ? <img src={branding.logo_url} alt="Gehna Gaze" className="h-10 w-auto object-contain" /> : <>Gehna <span className="text-gold">Gaze</span></>}
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[0.95rem]">
          <Link href="/shop" className="hover:text-gold transition-colors">
            Shop
          </Link>
          <Link href="/shop#new" className="hover:text-gold transition-colors">
            New In
          </Link>
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-gold transition-colors"
          >
            Instagram
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-sm border border-ink px-4 py-2 hover:bg-ink hover:text-ivory transition-colors"
          >
            Cart
            {count > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[0.7rem] bg-gold text-ivory rounded-full">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden border border-ink w-10 h-10 flex items-center justify-center"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-ivory">
          <div className="container-x py-4 flex flex-col gap-4 text-sm">
            <Link href="/shop" onClick={() => setOpen(false)}>
              Shop
            </Link>
            <Link href="/shop#new" onClick={() => setOpen(false)}>
              New In
            </Link>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
