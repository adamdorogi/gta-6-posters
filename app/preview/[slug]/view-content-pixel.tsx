"use client";

import { useEffect } from "react";
import { event } from "@/app/utils/meta-pixel-events";

export default function ViewContentPixel() {
  useEffect(() => {
    event("ViewContent", {
      content_name: "Canvas Print",
      content_type: "product",
      currency: "AUD",
    });
  }, []);

  return null;
}
