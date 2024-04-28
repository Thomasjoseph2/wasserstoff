import logger from "../config/logger.js";
import UserService from "../services/UserService.js";

// register user controller
// Route: POST /api/users/register
// Access: Public

const registerUser = async (req, res) => {
  try {
    const result = await UserService.registerUser(req.body, res);
    res.status(200).json(result);
  } catch (error) {
    // Handling errors and logging them
    console.log(error, "registration function");
    logger.error("Registration error", {
      message: error.message,
      stack: error.stack,
      additionalInfo: "error in auth controller",
    });
  }
};

// Auth user controller and token setter
// Route: POST /api/users/auth
// Access: Public

const authUser = async (req, res) => {
  try {
    // Extracting email and password from the request body
    const { email, password } = req.body;

    // Calling the userLogin function from the UserService
    const result = await UserService.userLogin(email, password, res);

    // Sending the response based on the result
    res.status(result.statusCode).json(result.data);
  } catch (error) {
    // Handling errors and logging them
    console.log(error, "auth user controller");

    logger.error("Authentication error", {
      message: error.message,
      stack: error.stack,
      additionalInfo: "error in auth controller",
    });

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for logging out user and expiring JWT
// Route: POST /api/users/logout
// Access: Public
const logoutUser = async (req, res) => {
  try {
    res.cookie("userjwt", "", { httpOnly: true, expires: new Date(0) });

    res.status(200).json({ message: "user logged out" });
  } catch (error) {
    console.log(error, "logout controller");
    logger.error("Error in logout", {
      message: error.message,
      stack: error.stack,
      additionalInfo: "error occured during logout",
    });
  }
};

// Exporting the controllers
export { authUser, logoutUser, registerUser };
