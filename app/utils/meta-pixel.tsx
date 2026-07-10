"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import * as pixel from "./meta-pixel-helper";

const MetaPixel = () => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;

    pixel.pageView();
  }, [pathname, loaded]);

  return (
    <div>
      <Script src="/scripts/meta-pixel.js" onLoad={() => setLoaded(true)} />
    </div>
  );
};

export default MetaPixel;
