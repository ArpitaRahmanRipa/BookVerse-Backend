const express = require("express");

const {
  createReport,
  getAllReports,
  getReportsByUser,
  getSingleReport,
  moderateReport,
  deleteReport,
} = require("../controllers/reportController");

const router = express.Router();

// Submit a new report
router.post("/", createReport);

// Get all reports
// Optional filters:
// ?status=Pending
// ?targetType=review
router.get("/", getAllReports);

// Get reports submitted by one user
router.get(
  "/user/:userId",
  getReportsByUser
);

// Get one report
router.get(
  "/:reportId",
  getSingleReport
);

// Moderator/Admin action
router.patch(
  "/:reportId/moderate",
  moderateReport
);

// Delete report
router.delete(
  "/:reportId",
  deleteReport
);

module.exports = router;