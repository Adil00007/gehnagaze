import { notFound } from "next/navigation";
import { formatPrice, site } from "@/lib/site";
import { isDatabaseConfigured, query } from "@/lib/db";
import AddToCart from "@/components/AddToCart";

export const revalidate = 0;

async function getProduct(id) {
  if (!isDatabaseConfigured) return null;
  try {
    const [products] = await query("SELECT * FROM products WHERE id = ?", [id]);
    return products[0] || null;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const hasDiscount = product.discounted_price && product.discounted_price < product.price;

  return (
    <div className="container-x py-10 md:py-16">
      <div className="text-xs text-ink/45 mb-8">
        <a href="/shop" className="hover:text-gold transition-colors">Shop</a>
        <span className="mx-2">/</span>
        <span>{product.category || "Piece"}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
      <div className="aspect-[4/5] bg-ivory-dim overflow-hidden border border-ink/10">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-xl">
            Gehna Gaze
          </div>
        )}
      </div>

      <div className="max-w-md md:pt-5">
        {product.category && (
          <p className="text-xs tracking-[0.15em] text-ink/50 mb-3">
            {product.category.toUpperCase()}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl leading-[0.98] mb-5">{product.name}</h1>

        <div className="mb-6">
          {hasDiscount ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl text-rose font-medium">
                {formatPrice(product.discounted_price)}
              </span>
              <span className="text-base line-through text-ink/40">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-2xl">{formatPrice(product.price)}</span>
          )}
        </div>

        <p className={`text-xs uppercase tracking-[0.14em] mb-7 ${product.in_stock ? "text-emerald" : "text-rose"}`}>
          {product.in_stock ? "Available to order" : "Currently sold out"}
        </p>

        {product.description && (
          <p className="text-ink/70 leading-relaxed mb-8">{product.description}</p>
        )}

        <AddToCart product={product} />

        <div className="mt-10 pt-8 border-t border-ink/10 text-sm text-ink/60 space-y-2">
          <p>Pay by bank transfer or JazzCash at checkout — no online account needed.</p>
          <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="underline">
            See it on Instagram
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}
