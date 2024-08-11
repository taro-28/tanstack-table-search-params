export const getQuery = () =>
  Object.fromEntries(new URLSearchParams(window.location.search).entries());
