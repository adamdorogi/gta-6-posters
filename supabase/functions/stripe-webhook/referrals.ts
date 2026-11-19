import type { Stripe } from "npm:stripe@22.5.0";

export async function getReferralCommission(stripe: Stripe, session: Stripe.Checkout.Session) {
  if (!session.total_details?.amount_discount) return {};

  const checkout = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["discounts.promotion_code"],
  });
  if (checkout.payment_status !== "paid" || checkout.amount_total === null || !checkout.total_details) {
    throw new Error("Paid checkout details are unavailable for referral attribution.");
  }

  for (const discount of checkout.discounts ?? []) {
    const reference = discount.promotion_code;
    if (!reference) continue;
    const promotion = typeof reference === "string"
      ? await stripe.promotionCodes.retrieve(reference)
      : reference;

    if (promotion.code.toUpperCase() !== "SZONJA10") continue;

    const productAmount = checkout.amount_total
      - checkout.total_details.amount_tax
      - (checkout.total_details.amount_shipping ?? 0);

    return {
      referral_code: "SZONJA10",
      stripe_promotion_code_id: promotion.id,
      commission_rate_bps: 1500,
      commission_base_amount: Math.max(0, productAmount),
    };
  }

  return {};
}
