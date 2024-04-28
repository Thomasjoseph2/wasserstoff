import asyncHandler from "express-async-handler";
import AdminService from "../services/AdminService.js";
import logger from "../config/logger.js";

const authAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AdminService.authenticateAdmin(
      { email, password },
      res
    );

    if (result.statusCode !== 201) {
      res.status(result.statusCode).json({ message: result.message });
    } else {
      res.status(result.statusCode).json(result.data);
    }
  } catch (error) {
    logger.error("Error handling admin authentication in controller:", {
      message: error.message,
      stack: error.stack,
      additionalInfo: `Request data: ${JSON.stringify(req.body)}`,
    });
    res
      .status(500)
      .json({ message: "An error occurred during admin authentication" });
  }
});

const logoutAdmin = asyncHandler(async (req, res) => {
  try {
    const message = await AdminService.logoutAdmin(res);
    res.status(200).json(message);
  } catch (error) {
    logger.error("Error handling admin logout in controller:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "An error occurred during admin logout" });
  }
});

export { authAdmin, logoutAdmin };
