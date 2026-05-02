export const formatDate = (unixTimestamp) => {
  // Finnhub returns seconds, JS Date expects milliseconds
  return new Date(unixTimestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};