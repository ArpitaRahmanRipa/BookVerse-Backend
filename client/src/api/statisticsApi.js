import API_BASE_URL from "./config.js";

export async function fetchReadingStatistics(userId, year = null) {
  const params = new URLSearchParams();

  if (year) {
    params.set("year", String(year));
  }

  const query = params.toString();
  const url = `${API_BASE_URL}/api/reading-statistics/${encodeURIComponent(userId)}${query ? `?${query}` : ""}`;

  const response = await fetch(url);

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Failed to fetch reading statistics");
  }

  return payload;
}
