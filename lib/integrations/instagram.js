// ---------------------------------------------------------------------------
// Instagram sync — FRAME ONLY, not yet called anywhere.
// ---------------------------------------------------------------------------
// What works today with zero setup:
//   - A "Follow us on Instagram" button/link everywhere on the site (lib/site.js
//     instagramUrl), so visitors can tap through to @gehnagaze.
//   - An optional free embed widget on the homepage (see README §5) that shows
//     your latest posts automatically — no API keys, no app review, just an
//     embed URL from a free widget generator.
//
// What this file is for: TRUE two-way sync (posting a product on Instagram
// automatically creates/updates it on the site, and vice versa) requires
// Meta's official Instagram Graph API, which needs:
//   1. Your Instagram account converted to a Professional (Business/Creator)
//      account and linked to a Facebook Page.
//   2. A Meta developer app with the instagram_basic + instagram_content_publish
//      permissions, reviewed and approved by Meta (a few days to a few weeks).
//   3. A long-lived access token for that app.
//
// Once you have that, add to your env vars:
//   INSTAGRAM_ACCESS_TOKEN
//   INSTAGRAM_BUSINESS_ACCOUNT_ID
//
// and fetchRecentInstagramMedia() below will start working — call it from a
// scheduled task (e.g. a Vercel Cron Job hitting an /api/sync-instagram route)
// to pull new posts into the `products` table automatically.
// ---------------------------------------------------------------------------

export function isInstagramApiConfigured() {
  return Boolean(
    process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  );
}

export async function fetchRecentInstagramMedia(limit = 12) {
  if (!isInstagramApiConfigured()) {
    throw new Error(
      "Instagram Graph API isn't connected yet. Add INSTAGRAM_ACCESS_TOKEN and " +
        "INSTAGRAM_BUSINESS_ACCOUNT_ID to your env vars — see README §6."
    );
  }
  const id = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const fields = "id,caption,media_type,media_url,permalink,timestamp";
  const url = `https://graph.facebook.com/v20.0/${id}/media?fields=${fields}&limit=${limit}&access_token=${token}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Instagram API error (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.data || [];
}
