import Link from "next/link";
import { formatPrice } from "@/lib/site";

export default function ProductCard({ product, span }) {
  const hasDiscount =
    product.discounted_price && product.discounted_price < product.price;
  const displayPrice = hasDiscount ? product.discounted_price : product.price;

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group block ${span || ""}`}
    >
      <div className="relative overflow-hidden bg-ivory-dim aspect-[4/5] border border-ink/10">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-lg">
            Gehna Gaze
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-rose text-ivory text-xs px-3 py-1 tracking-wide">
            Sale
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute top-3 right-3 bg-ink/80 text-ivory text-xs px-3 py-1 tracking-wide">
            Sold out
          </span>
        )}
        <span className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-ivory/95 text-ink text-center text-xs tracking-[0.12em] uppercase py-3">
          View piece
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-snug truncate">{product.name}</h3>
          {product.category && (
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-ink/50 mt-1">
              {product.category}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          {hasDiscount ? (
            <>
              <div className="text-sm line-through text-ink/40">
                {formatPrice(product.price)}
              </div>
              <div className="text-sm text-rose font-medium whitespace-nowrap">
                {formatPrice(product.discounted_price)}
              </div>
            </>
          ) : (
            <div className="text-sm whitespace-nowrap">{formatPrice(displayPrice)}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
