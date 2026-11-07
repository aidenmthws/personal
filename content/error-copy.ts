/**
 * The error page has to be a client component, and importing landings.ts there
 * would ship all site copy in client JS. This is the only copy kept outside it.
 */
export const errorCopy = {
  title: "The ride stopped",
  body: "This part of the ride failed to load, but Dry Land has all the same content.",
  dryLand: "Dry Land",
  retry: "Try the ride again",
};
