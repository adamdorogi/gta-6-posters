"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { event, pageView, init } from "./meta-pixel-events";

const MetaPixel = ({ userId }: { userId: string }) => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;

    init({ external_id: userId });
    pageView();

    if (pathname.startsWith("/preview/")) {
      event("ViewContent", {
        content_ids: ["personalised-canvas"],
        content_name: "Personalised Canvas",
        content_type: "product",
      });
    }
  }, [pathname, loaded, userId]);

  return <Script src="/scripts/meta-pixel.js" onLoad={() => setLoaded(true)} />;
};

export default MetaPixel;
