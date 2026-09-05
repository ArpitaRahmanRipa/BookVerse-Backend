import { API_BASE_URL } from "../config/api.js";

// =====================================
// Get Yearly Reading Wrapped
// =====================================

export const getYearlyReadingWrapped = async (
  userId,
  year
) => {

  const response = await fetch(
    `${API_BASE_URL}/reading-wrapped/user/${userId}?year=${year}`
  );


  const data = await response.json();


  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to fetch reading wrapped."
    );
  }


  return data;
};