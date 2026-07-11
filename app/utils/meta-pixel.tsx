"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { event, pageView } from "./meta-pixel-events";

const MetaPixel = () => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;

    pageView();

    if (pathname.startsWith("/preview/")) {
      event("ViewContent", {
        content_ids: ["personalised-canvas"],
        content_name: "Personalised Canvas",
        content_type: "product",
        currency: "AUD",
      });
    }
  }, [pathname, loaded]);

  return <Script src="/scripts/meta-pixel.js" onLoad={() => setLoaded(true)} />;
};

export default MetaPixel;
