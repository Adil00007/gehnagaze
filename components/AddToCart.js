"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function AddToCart({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product.in_stock) {
    return (
      <div className="border border-ink/20 px-5 py-3 text-sm text-ink/50 inline-block">
        Currently sold out — follow our Instagram for restocks.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-ink/30">
          <button
            className="w-9 h-9 hover:bg-ink hover:text-ivory transition-colors"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button
            className="w-9 h-9 hover:bg-ink hover:text-ivory transition-colors"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          className="btn btn-primary flex-1"
          onClick={() => {
            addItem(product, qty);
            setAdded(true);
          }}
        >
          Add to cart
        </button>
      </div>
      {added && (
        <p className="text-sm text-emerald">
          Added to cart.{" "}
          <Link href="/cart" className="underline">
            View cart
          </Link>{" "}
          or keep browsing.
        </p>
      )}
    </div>
  );
}
