alter table public.orders
  add column stripe_checkout_session_id text unique,
  add column stripe_payment_intent_id text,
  add column stripe_livemode boolean,
  add column referral_code text,
  add column stripe_promotion_code_id text,
  add column commission_rate_bps smallint not null default 0
    check (commission_rate_bps between 0 and 10000),
  add column commission_base_amount bigint not null default 0
    check (commission_base_amount >= 0 and commission_base_amount <= total_price),
  add column refunded_amount bigint not null default 0
    check (refunded_amount >= 0 and refunded_amount <= total_price),
  add column commission_paid_amount bigint not null default 0
    check (commission_paid_amount >= 0),
  add column commission_paid_at timestamptz,
  add column commission_payment_reference text,
  add column commission_amount bigint generated always as (
    case when total_price > 0 then
      round(
        commission_base_amount::numeric * commission_rate_bps
        * (total_price - refunded_amount) / (total_price::numeric * 10000)
      )::bigint
    else 0 end
  ) stored,
  add constraint orders_referral_details_check check (
    (referral_code is null and stripe_promotion_code_id is null
      and commission_rate_bps = 0 and commission_base_amount = 0)
    or
    (referral_code is not null and referral_code = upper(referral_code)
      and stripe_promotion_code_id is not null and commission_rate_bps > 0)
  );

create index orders_stripe_payment_intent_id_idx
  on public.orders (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

-- Earnings and the order are saved together. Manual payment details survive refunds.
create view public.referral_commissions
with (security_invoker = true) as
select
  id as order_id,
  order_number,
  created_at,
  stripe_checkout_session_id,
  stripe_payment_intent_id,
  stripe_livemode as livemode,
  referral_code,
  stripe_promotion_code_id,
  currency,
  total_price as sale_total,
  commission_base_amount,
  commission_rate_bps,
  refunded_amount,
  commission_amount,
  commission_paid_amount,
  commission_amount - commission_paid_amount as amount_due,
  commission_paid_at,
  commission_payment_reference,
  case
    when commission_paid_amount > commission_amount then 'overpaid'
    when commission_amount = 0 then 'reversed'
    when commission_paid_amount = commission_amount then 'paid'
    when commission_paid_amount > 0 then 'partially_paid'
    else 'pending'
  end as status
from public.orders
where referral_code is not null;

revoke all on public.referral_commissions from public, anon, authenticated;
grant select on public.referral_commissions to service_role;
