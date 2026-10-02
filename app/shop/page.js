import ProductCatalog from "@/components/ProductCatalog";
import { isDatabaseConfigured, query } from "@/lib/db";

export const revalidate = 0;

async function getProducts() {
  if (!isDatabaseConfigured) return [];
  try {
    const [products] = await query("SELECT * FROM products ORDER BY created_at DESC");
    return products;
  } catch {
    return [];
  }
}

export default async function ShopPage({ searchParams }) {
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const selectedCategory = (await searchParams)?.category || "";
  const filteredProducts = selectedCategory ? products.filter((product) => product.category === selectedCategory) : products;

  return (
    <div className="container-x py-16">
      <div className="mb-12">
        <p className="text-gold text-sm tracking-[0.15em] mb-2">THE FULL EDIT</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h1 className="text-4xl md:text-5xl">Shop all pieces</h1>
          <p className="max-w-xs text-sm text-ink/60 leading-relaxed">
            Small-batch jewelry selected for everyday shine and special occasions.
          </p>
        </div>
      </div>

      {!isDatabaseConfigured && (
        <div className="border border-dashed border-ink/20 p-8 text-sm text-ink/50 mb-10">
          The store isn&apos;t connected to a database yet. Add your MySQL settings to
          the env vars, then products added from the admin
          panel will appear here.
        </div>
      )}

      {filteredProducts.length === 0 && isDatabaseConfigured ? (
        <div className="border border-dashed border-ink/20 p-14 text-center text-ink/50">
          No pieces uploaded yet — check back soon.
        </div>
      ) : (
        <div id="new">
          <ProductCatalog products={filteredProducts} categories={categories} />
        </div>
      )}
    </div>
  );
}
