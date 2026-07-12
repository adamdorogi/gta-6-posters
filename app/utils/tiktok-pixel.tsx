"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { event } from "./tiktok-pixel-events";

const TikTokPixel = () => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;

    if (pathname.startsWith("/preview/")) {
      event("ViewContent", {
        contents: [
          {
            content_id: "personalised-canvas",
            content_type: "product",
            content_name: "Personalised Canvas",
          },
        ],
      });
    }
  }, [pathname, loaded]);

  return (
    <Script src="/scripts/tiktokt-pixel.js" onLoad={() => setLoaded(true)} />
  );
};

export default TikTokPixel;
