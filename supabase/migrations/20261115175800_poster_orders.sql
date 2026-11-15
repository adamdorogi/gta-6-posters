ALTER TABLE public.orders
  ADD COLUMN currency text CHECK (currency ~ '^[A-Z]{3}$'),
  ADD COLUMN print_format text CHECK (print_format = 'paper-poster'),
  ADD COLUMN phone text;
