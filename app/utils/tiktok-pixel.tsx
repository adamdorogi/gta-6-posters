"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { event, identify } from "./tiktok-pixel-events";
import { site } from "./site";

const TikTokPixel = ({ userId }: { userId: string }) => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;

    identify({ external_id: userId });

    if (pathname.startsWith("/preview/")) {
      event("ViewContent", {
        contents: [
          {
            content_id: "personalized-poster",
            content_type: "product",
            content_name: "Personalized Poster",
            brand: site.name,
          },
        ],
      });
    }
  }, [pathname, loaded, userId]);

  return (
    <Script src="/scripts/tiktok-pixel.js" onLoad={() => setLoaded(true)} />
  );
};

export default TikTokPixel;
