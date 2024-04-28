import Admin from "../models/adminModel.js";
import logger from "../config/logger.js";

class AdminRepository {
  static instance;

  constructor() {
    if (AdminRepository.instance) {
      return AdminRepository.instance;
    }
    AdminRepository.instance = this;
  }

  async findAdminByEmail(email) {
    try {
      return await Admin.findOne(email);
    } catch (error) {
      logger.error("Error in findAdminByEmail:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "Failed to find admin by email",
      });
      throw new Error("Failed to find admin by email");
    }
  }

  async matchPasswords(admin, enteredPassword) {
    try {
      return await admin.matchPasswords(enteredPassword);
    } catch (error) {
      logger.error("Error in matchPasswords:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "Failed to match passwords",
      });
      throw new Error("Failed to match passwords");
    }
  }
}

export default new AdminRepository();
