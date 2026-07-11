"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { event } from "./meta-pixel-events";

const MetaPixel = () => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;

    event("PageView");

    if (pathname.startsWith("/preview/")) {
      event("ViewContent", {
        content_name: "Canvas Print",
        content_type: "product",
        currency: "AUD",
      });
    }
  }, [pathname, loaded]);

  return <Script src="/scripts/meta-pixel.js" onLoad={() => setLoaded(true)} />;
};

export default MetaPixel;
