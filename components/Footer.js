import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer({ branding = {} }) {
  return (
    <footer className="bg-ink text-ivory mt-24">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          {branding.logo_url ? <img src={branding.logo_url} alt="Gehna Gaze" className="h-10 w-auto object-contain mb-3" /> : <div className="font-display text-2xl mb-3">Gehna <span className="text-gold-bright">Gaze</span></div>}
          <p className="text-sm text-ivory/70 max-w-xs">{site.tagline}</p>
        </div>

        <div className="text-sm">
          <div className="text-ivory/50 mb-3">Shop</div>
          <div className="flex flex-col gap-2">
            <Link href="/shop" className="hover:text-gold-bright">
              All pieces
            </Link>
            <Link href="/cart" className="hover:text-gold-bright">
              Your cart
            </Link>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold-bright"
            >
              @{site.instagramHandle}
            </a>
          </div>
        </div>

        <div className="text-sm">
          <div className="text-ivory/50 mb-3">Reach us</div>
          <div className="flex flex-col gap-2 text-ivory/80">
            <span>{site.contactEmail}</span>
            {site.whatsappNumber && <span>WhatsApp: {site.whatsappNumber}</span>}
            <Link href="/admin" className="text-ivory/40 hover:text-gold-bright mt-2">
              Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} Gehna Gaze. All pieces are handpicked and limited.
      </div>
    </footer>
  );
}
