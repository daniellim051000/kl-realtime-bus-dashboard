"use client";

import { useState, useEffect } from "react";

interface RefreshIndicatorProps {
  fetchedAt: number | null;
}

export default function RefreshIndicator({ fetchedAt }: RefreshIndicatorProps) {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!fetchedAt) return;

    const update = () => {
      setSecondsAgo(Math.floor((Date.now() - fetchedAt) / 1000));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [fetchedAt]);

  if (!fetchedAt) return null;

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-[1000] rounded-lg bg-white/90 px-3 py-1.5 text-xs text-gray-600 shadow-sm backdrop-blur-sm">
      Updated {secondsAgo}s ago
    </div>
  );
}
