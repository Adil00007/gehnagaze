import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import InstagramStrip from "@/components/InstagramStrip";
import { isDatabaseConfigured, query } from "@/lib/db";
import { getCategories, getSiteContent } from "@/lib/siteContent";

export const revalidate = 0;

async function getFeatured() {
  if (!isDatabaseConfigured) return [];
  try {
    const [products] = await query("SELECT * FROM products ORDER BY created_at DESC LIMIT 6");
    return products;
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getFeatured();
  const [categories, content] = await Promise.all([getCategories(), getSiteContent()]);

  return (
    <div>
      <section className="relative bg-ink text-ivory overflow-hidden">
        <div className="container-x py-28 md:py-36 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-bright text-sm tracking-[0.15em] mb-5">
              THE INSTAGRAM EDIT, NOW SHOPPABLE
            </p>
            <h1 className="text-5xl md:text-6xl leading-[1.05] mb-6">{content.banner_title || "Jewelry worth looking twice at."}</h1>
            <p className="text-ivory/70 max-w-md mb-9 leading-relaxed">
              {content.banner_subtitle || "Fine jewelry, handpicked from our Instagram edit."}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/shop" className="btn btn-gold">
                Shop the edit
              </Link>
              <Link href="/shop#new" className="btn btn-outline !border-ivory !text-ivory hover:!bg-ivory hover:!text-ink">
                New arrivals
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-gradient-to-br from-emerald via-emerald-deep to-ink border border-ivory/10 overflow-hidden">
            {content.banner_url && <img src={content.banner_url} alt="Gehna Gaze collection" className="absolute inset-0 w-full h-full object-cover opacity-75" />}
            <div className="absolute inset-8 border border-gold-bright/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl text-gold-bright/90 text-center px-10 leading-snug">
                Gehna Gaze
                <span className="block text-sm tracking-[0.2em] text-ivory/50 mt-3">
                  EST. INSTAGRAM
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && <section className="container-x py-16"><div className="flex items-end justify-between mb-8"><div><p className="text-gold text-sm tracking-[0.15em] mb-2">SHOP BY MOOD</p><h2 className="text-3xl">Find your next piece</h2></div><Link href="/shop" className="text-sm underline underline-offset-4">Browse all</Link></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{categories.map((category) => <Link href={`/shop?category=${encodeURIComponent(category.name)}`} key={category.id} className="group"><div className="aspect-square bg-ivory-dim overflow-hidden border border-ink/10">{category.image_url ? <img src={category.image_url} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center font-display text-xl text-ink/40">{category.name}</div>}</div><p className="font-display text-xl mt-3">{category.name}</p></Link>)}</div></section>}

      <section className="container-x py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <h2 className="text-3xl">Fresh from the edit</h2>
          <Link href="/shop" className="text-sm underline underline-offset-4">
            View all pieces
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="border border-dashed border-ink/20 p-14 text-center text-ink/50">
            No pieces uploaded yet. Add your first product from{" "}
            <Link href="/admin" className="underline">
              the admin panel
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <InstagramStrip />

      <section className="container-x py-20 grid md:grid-cols-3 gap-10 border-t border-ink/10">
        <div>
          <div className="text-gold mb-2 font-display text-xl">01</div>
          <h3 className="text-lg mb-2">Browse the edit</h3>
          <p className="text-sm text-ink/60">
            Everything here is also on our Instagram — what you see is what&apos;s in hand.
          </p>
        </div>
        <div>
          <div className="text-gold mb-2 font-display text-xl">02</div>
          <h3 className="text-lg mb-2">Pay your way</h3>
          <p className="text-sm text-ink/60">
            Bank transfer or JazzCash — send payment, share the transaction ID, done.
          </p>
        </div>
        <div>
          <div className="text-gold mb-2 font-display text-xl">03</div>
          <h3 className="text-lg mb-2">We confirm &amp; ship</h3>
          <p className="text-sm text-ink/60">
            We verify your payment and message you on WhatsApp or Instagram to confirm delivery.
          </p>
        </div>
      </section>
    </div>
  );
}
