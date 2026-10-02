import { site } from "@/lib/site";

export default function InstagramStrip() {
  return (
    <section className="border-t border-ink/10">
      <div className="container-x py-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl">As seen on Instagram</h2>
            <p className="text-ink/60 mt-1 text-sm">
              Follow @{site.instagramHandle} — every new drop lands here first.
            </p>
          </div>
          <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
            Follow along
          </a>
        </div>

        {site.instagramEmbedUrl ? (
          <div className="w-full overflow-hidden border border-ink/10">
            <iframe
              src={site.instagramEmbedUrl}
              title="Instagram feed"
              className="w-full min-h-[420px] border-0"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="border border-dashed border-ink/20 p-10 text-center text-ink/50 text-sm">
            Your live Instagram feed will appear here once it&apos;s connected — takes
            about two minutes, no coding. See “Connect Instagram” in the README,
            then set <code className="px-1 bg-ink/5">NEXT_PUBLIC_INSTAGRAM_EMBED_URL</code>.
          </div>
        )}
      </div>
    </section>
  );
}
