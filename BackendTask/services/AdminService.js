import AdminRepository from "../repositories/AdminRepository.js";
import generateAdminTokken from "../utils/generateAdminToken.js";
import logger from "../config/logger.js";

class AdminService {
  static instance;

  constructor() {
    if (AdminService.instance) {
      return AdminService.instance;
    }
    AdminService.instance = this;
  }

  async authenticateAdmin({ email, password }, res) {
    try {
      const admin = await AdminRepository.findAdminByEmail({ email });
      if (admin && (await AdminRepository.matchPasswords(admin, password))) {
        generateAdminTokken(res, admin._id, "admin");
        return {
          statusCode: 201,
          data: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            image: admin.imagePath,
          },
        };
      } else {
        return {
          statusCode: 401,
          message: "Invalid email or password",
        };
      }
    } catch (error) {
      logger.error("Authentication error:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "Authentication failed",
      });
      throw new Error("Authentication failed");
    }
  }

  async logoutAdmin(res) {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    return { message: "Admin logged out successfully" };
  }
}

export default new AdminService();
