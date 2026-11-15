import { Resend } from "npm:resend@6.26.0";
import { storeName, storeOrigin, supportEmail } from "./store.ts";

type Order = {
  orderNumber: number;
  name: string;
  item?: string | null;
  artworkUrl?: string;
};

type Tracking = { carrier?: string; number?: string; url?: string };

type OrderEmail =
  | { kind: "confirmed"; amount: number; currency: string | null }
  | { kind: "download"; downloadUrl: string }
  | { kind: "production" }
  | { kind: "shipped" | "delivered"; tracking?: Tracking };

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => htmlEscapes[character]);
}

function httpsUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password) return url.href;
  } catch {
    return undefined;
  }
}

export function renderOrderEmail(order: Order, message: OrderEmail) {
  const firstName = order.name.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const reference = `Order #${order.orderNumber}`;
  const details = [reference];
  if (order.item) details.push(order.item);

  let title: string;
  let description: string;
  let link: { label: string; url: string } | undefined;
  const artwork = httpsUrl(order.artworkUrl);
  if (artwork) link = { label: "View your artwork", url: artwork };

  switch (message.kind) {
    case "confirmed":
      title = "Thanks for your order";
      description = "We’ll email your digital download link as soon as your artwork is ready.";
      if (message.currency && /^[A-Z]{3}$/i.test(message.currency)) {
        const total = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: message.currency,
          currencyDisplay: "code",
        }).format(message.amount / 100);
        details.push(`Total paid ${total}`);
      }
      break;
    case "download": {
      title = "Your digital poster is ready";
      description = "Your high-resolution artwork is ready to download without the preview watermark.";
      const url = httpsUrl(message.downloadUrl);
      if (!url) throw new Error("The poster download needs an HTTPS URL.");
      link = { label: "Download your poster", url };
      break;
    }
    case "production":
      title = "Your print is in production";
      description = "We’re preparing your order. We’ll send tracking details when it ships.";
      break;
    case "shipped":
    case "delivered": {
      title = message.kind === "shipped" ? "Your print has shipped" : "Your print was delivered";
      description = message.kind === "shipped"
        ? "Your order is on its way."
        : "The carrier has marked your order as delivered. Reply here if you need help finding it.";
      const tracking = message.tracking;
      if (tracking?.number) {
        details.push(`Tracking ${[tracking.carrier, tracking.number].filter(Boolean).join(" ")}`);
      }
      const url = httpsUrl(tracking?.url);
      if (url) link = { label: "Track your shipment", url };
      break;
    }
  }

  const subject = `${title} · ${reference}`;
  const contact = `Questions? Email ${supportEmail}.`;
  const text = [
    greeting,
    description,
    details.join("\n"),
    link && `${link.label}\n${link.url}`,
    contact,
    storeName,
  ].filter(Boolean).join("\n\n");
  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;background:#171220;color:#fff7f0;font:16px/1.5 Arial,sans-serif">
  <div style="max-width:540px;margin:0 auto;padding:32px 24px">
    <p style="margin:0 0 24px"><a href="${storeOrigin}" style="color:#f8aed0;font-weight:bold;text-decoration:none">${storeName}</a></p>
    <h1 style="font-size:27px;line-height:1.2">${escapeHtml(title)}</h1>
    <p>${escapeHtml(greeting)}</p>
    <p>${escapeHtml(description)}</p>
    <div style="padding:14px 18px;border:1px solid #614766;border-radius:8px">${details.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>
    ${link ? `<p style="margin:26px 0"><a href="${escapeHtml(link.url)}" style="background:#f8aed0;color:#211428;border-radius:8px;padding:12px 16px;font-weight:bold;text-decoration:none">${escapeHtml(link.label)}</a></p>` : ""}
    <p style="margin-top:24px;color:#ead9ed">Questions? Email <a href="mailto:${supportEmail}" style="color:#f8aed0">${supportEmail}</a>.</p>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

export async function sendOrderEmail(
  to: string,
  order: Order,
  message: OrderEmail,
  idempotencyKey: string,
  bcc?: string,
) {
  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
    const { error } = await resend.emails.send({
      ...renderOrderEmail(order, message),
      from: `${storeName} <${supportEmail}>`,
      replyTo: supportEmail,
      to,
      bcc,
    }, { idempotencyKey });
    if (!error) return true;
    console.error(`Failed to send ${message.kind} email for order #${order.orderNumber}:`, error.name);
  } catch (error) {
    console.error(`Failed to send ${message.kind} email for order #${order.orderNumber}:`, error);
  }
  return false;
}
