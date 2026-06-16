import { useEffect, useRef } from "react";

export function useInterswitch() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const existing = document.querySelector(
      `script[src="${process.env.NEXT_PUBLIC_ISW_SCRIPT_URL}"]`
    );
    if (existing) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_ISW_SCRIPT_URL!;
    script.async = true;
    script.onload = () => { scriptLoaded.current = true; };
    document.body.appendChild(script);

    return () => {
      // don't remove on unmount — other pages may still need it
    };
  }, []);
}
