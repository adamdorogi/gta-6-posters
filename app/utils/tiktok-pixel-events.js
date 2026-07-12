export const event = (name, options, customData) => {
if (typeof window === "undefined") return;
  if (typeof window.ttq === "undefined") return;
  if (typeof window.ttq.track !== "function") return;

  window.ttq.track(name, options, customData);
};
