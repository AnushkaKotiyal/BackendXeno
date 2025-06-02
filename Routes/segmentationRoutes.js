const express = require("express");
const segmentationRouter = express.Router();

const {
  createSegment,
  getAllSegments,
  getSegmentById,
  previewSegmentAudience,
  deleteSegment,
} = require("../Controllers/segmentationController");
const { authenticateUser } = require("../Middleware/auth");
segmentationRouter.post("/",authenticateUser, createSegment);

segmentationRouter.get("/",authenticateUser, getAllSegments);

segmentationRouter.get("/:id",authenticateUser, getSegmentById);

segmentationRouter.post("/preview",authenticateUser, previewSegmentAudience);

segmentationRouter.delete("/:id",authenticateUser,deleteSegment);

module.exports = segmentationRouter;
 