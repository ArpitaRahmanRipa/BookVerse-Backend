import { API_BASE_URL } from "../config/api.js";
const handleResponse = async (response) => {
  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

// Submit a report
export const createReport = async (payload) => {
  const response = await fetch(
    `${API_BASE_URL}/reports`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
};

// Get all reports
export const getAllReports = async (
  status = ""
) => {
  const url = status
    ? `${API_BASE_URL}/reports?status=${encodeURIComponent(
        status
      )}`
    : `${API_BASE_URL}/reports`;

  const response = await fetch(url);

  return handleResponse(response);
};

// Get one report
export const getSingleReport = async (
  reportId
) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}`
  );

  return handleResponse(response);
};

// Get reports submitted by a reader
export const getReportsByUser = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/user/${userId}`
  );

  return handleResponse(response);
};

// Take moderator/admin action
export const moderateReport = async (
  reportId,
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}/moderate`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
};

// Delete report
export const deleteReport = async (
  reportId
) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/${reportId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};