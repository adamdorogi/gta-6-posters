export const pageView = () => {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("track", "PageView");
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options, customData) => {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("track", name, options, customData);
};

export const init = (options) => {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("init", "1725434085130628", options);
};
