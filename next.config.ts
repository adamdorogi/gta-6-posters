import type { NextConfig } from "next";

const supabaseUrl = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL)
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: supabaseUrl.protocol === "http:" ? "http" : "https",
            hostname: supabaseUrl.hostname,
            port: supabaseUrl.port,
            pathname: `${supabaseUrl.pathname.replace(/\/$/, "")}/storage/v1/object/public/**`,
          },
        ]
      : [],
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV === "development" &&
      (supabaseUrl?.hostname === "127.0.0.1" ||
        supabaseUrl?.hostname === "localhost"),
  },
};

export default nextConfig;
