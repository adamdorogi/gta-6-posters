import "server-only";
import { headers } from "next/headers";
import { getCurrencyForCountry } from "./pricing";

export async function getStoreCurrency() {
  const requestHeaders = await headers();
  return getCurrencyForCountry(requestHeaders.get("x-vercel-ip-country"));
}
