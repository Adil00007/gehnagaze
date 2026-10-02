"use client";

import { useEffect, useState } from "react";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const response = await fetch("/api/discounts", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      if (active) setAnnouncement(data.discounts?.find((discount) => discount.active) || null);
    }
    load();
    const interval = setInterval(load, 60_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!announcement) return null;

  return (
    <div className="bg-emerald-deep text-ivory">
      <div className="container-x py-2.5 text-center text-[0.82rem] tracking-wide">
        <span className="font-medium">{announcement.title}</span>
        {announcement.description ? (
          <span className="opacity-80"> — {announcement.description}</span>
        ) : null}
        {announcement.percentage ? (
          <span className="ml-2 text-gold-bright">{announcement.percentage}% off</span>
        ) : null}
      </div>
    </div>
  );
}
