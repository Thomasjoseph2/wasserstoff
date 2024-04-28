import UserRepository from "../repositories/UserRepository.js";
import logger from "../config/logger.js";
import { isStrongPassword } from "../utils/passwordValidator.js";
import generateToken from "../utils/generateToken.js";
class UserServices {
  static instance;

  constructor() {
    if (UserServices.instance) {
      return UserServices.instance;
    }

    UserServices.instance = this;
  }
  async registerUser({ name, email, password }, res) {
    try {
      if (!isStrongPassword(password)) {
        res
          .status(400)
          .json({ error: "Weak password. Please use a stronger password." });
        return;
      }
      const userExists = await UserRepository.findByEmail({ email });

      if (userExists) {
        res.status(409).json({ error: "User already exists" });
        return;
      } else {
        // Create a new user
        const user = await UserRepository.createUser({ name, email, password });

        if (user) {
          // Generate token and send response for successful registration
          generateToken(res, user._id, "user");
          return {
            statusCode: 201,
            data: {
              _id: user._id,
              name: user.name,
              email: user.email,
            },
          };
        }
      }
    } catch (error) {
      // Handle errors and log them
      console.log(error, "register user service");
      logger.error("Error in registerUser:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "User registration failed",
      });
    }
  }
  // Service method to handle user login
  async userLogin(email, password, res) {
    try {
      // Finding the user by email in the UserRepository
      const user = await UserRepository.findByEmail({ email });
      // Checking if the user exists, passwords match, and the user is verified
      if (user && (await UserRepository.matchPasswords(user, password))) {
        // Generating a token and sending it in the response
        generateToken(res, user._id, "user");

        // Returning success response with user details
        return {
          statusCode: 201,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        };
      } else {
        // Returning unauthorized response for invalid email or password
        return {
          statusCode: 401,
          data: { message: "Invalid email or password" },
        };
      }
    } catch (error) {
      // Logging and throwing an error for failed user login
      console.log(error, "user login service");
      logger.error("Error in userLogin:", {
        message: error.message,
        stack: error.stack,
        additionalInfo: "User login failed",
      });
      throw new Error("User login failed");
    }
  }
}

// Exporting an instance of the UserServices class
export default new UserServices();
