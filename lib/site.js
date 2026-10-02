// Central place for the "fill in your own details" config, so the rest of
// the app never hardcodes brand-specific values. Every value here is meant
// to be overridden with an env var when you deploy — see .env.example.

export const site = {
  name: "Gehna Gaze",
  tagline: "Fine jewelry, handpicked from our Instagram edit.",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "gehnagaze",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://instagram.com/gehnagaze",
  // Optional: paste an embed URL from a free widget (SnapWidget / LightWidget /
  // Elfsight "Instagram Feed") here once you've made one — see README §5.
  // Until it's set, the homepage shows a "connect your feed" placeholder instead.
  instagramEmbedUrl: process.env.NEXT_PUBLIC_INSTAGRAM_EMBED_URL || "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@gehnagaze.com",

  payments: {
    bank: {
      enabled: Boolean(process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER),
      bankName: process.env.NEXT_PUBLIC_BANK_NAME || "",
      accountTitle: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE || "",
      accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "",
      iban: process.env.NEXT_PUBLIC_BANK_IBAN || "",
    },
    jazzcash: {
      enabled: Boolean(process.env.NEXT_PUBLIC_JAZZCASH_NUMBER),
      accountTitle: process.env.NEXT_PUBLIC_JAZZCASH_TITLE || "",
      number: process.env.NEXT_PUBLIC_JAZZCASH_NUMBER || "",
    },
  },

  currency: process.env.NEXT_PUBLIC_CURRENCY || "PKR",
};

export function formatPrice(amount) {
  const n = Number(amount || 0);
  return `${site.currency} ${n.toLocaleString("en-PK")}`;
}
