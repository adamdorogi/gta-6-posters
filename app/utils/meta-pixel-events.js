// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("track", name, options);
};

// fbq('track', 'ViewContent');
// fbq('track', 'InitiateCheckout');
// fbq('track', 'Purchase', {value: 0.00, currency: 'GBP'});
