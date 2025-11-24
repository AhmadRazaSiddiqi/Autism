export const formatHumanDate = (isoDate, mode = "human") => {
  if (!isoDate) return "N/A";

  const dateObj = new Date(isoDate);

  if (mode === "year") {
    return dateObj.getFullYear(); // e.g. 2022
  }

  if (mode === "date") {
    // YYYY-MM-DD format
    return dateObj.toISOString().split("T")[0];
    // e.g. 2022-01-15
  }

  // ✅ default: full human-readable format
  return dateObj.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
