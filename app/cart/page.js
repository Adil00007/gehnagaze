"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/site";

export default function CartPage() {
  const { items, updateQty, removeItem, total, hydrated } = useCart();

  if (hydrated && items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-3xl mb-4">Your cart is empty</h1>
        <p className="text-ink/60 mb-8">Nothing here yet — go find something you love.</p>
        <Link href="/shop" className="btn btn-primary">
          Shop the edit
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-16">
      <h1 className="text-3xl mb-10">Your cart</h1>

      <div className="grid md:grid-cols-[1fr_320px] gap-14">
        <div className="divide-y divide-ink/10">
          {items.map((item) => (
            <div key={item.id} className="flex gap-5 py-6 items-center">
              <div className="w-20 h-24 bg-ivory-dim shrink-0 overflow-hidden">
                {item.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <Link href={`/product/${item.id}`} className="font-display text-lg">
                  {item.name}
                </Link>
                <div className="text-sm text-ink/60 mt-1">{formatPrice(item.price)}</div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-ink/30">
                    <button
                      className="w-8 h-8 hover:bg-ink hover:text-ivory"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button
                      className="w-8 h-8 hover:bg-ink hover:text-ivory"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-xs text-ink/40 hover:text-rose underline"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-sm font-medium">
                {formatPrice(item.price * item.qty)}
              </div>
            </div>
          ))}
        </div>

        <div className="border border-ink/15 p-6 h-fit">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink/60">Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-ink/50 mb-5">
            Shipping is confirmed with you directly after checkout.
          </p>
          <Link href="/checkout" className="btn btn-primary w-full">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
