"use client";

import { useEffect, useState } from "react";

export function useInterswitch() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_ISW_SCRIPT_URL;
    if (!url) {
      setError("ISW_SCRIPT_URL is not configured");
      return;
    }

    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => setError("Failed to load payment script");
    document.body.appendChild(script);
  }, []);

  return { ready, error };
}
