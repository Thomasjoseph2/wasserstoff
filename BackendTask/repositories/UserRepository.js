import User from "../models/userModel.js";
import logger from "../config/logger.js";
class UserRepository {
  static instance;

  constructor() {
    if (UserRepository.instance) {
      return UserRepository.instance;
    }

    UserRepository.instance = this;
  }
  async createUser(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    try {
      return await User.findOne(email);
    } catch (error) {
      logger.error("Error in findByEmail:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "Failed to find user by email",
      });
      throw new Error("Failed to find user by email");
    }
  }

  async findUserByIdForMiddleWare(userId) {
    try {
      return await User.findById(userId).select("-password");
    } catch (error) {
      logger.error("Error in findUserByIdForMiddleWare:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "Failed to find user by ID for middleware",
      });
      throw new Error("Failed to find user by ID for middleware");
    }
  }

  async findUserById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      logger.error("Error in findUserById:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "Error in findUserById:",
      });
      throw new Error("Failed to find user by ID");
    }
  }

  async matchPasswords(user, enteredPassword) {
    try {
      return await user.matchPasswords(enteredPassword);
    } catch (error) {
      logger.error("Error in matchPasswords:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "Failed to match passwords",
      });
      throw new Error("Failed to match passwords");
    }
  }
  async getUser(userId) {
    return await User.findById(userId);
  }
}

export default new UserRepository();
