const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:9208/api";


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