import logger from "../config/logger.js";
import UserService from "../services/UserService.js";
import getVisionClient from "../utils/vision-client.js";
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

const addImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No image file provided.");
    }

    const imageBuffer = req.file.buffer;

    // Call functions for desired annotations (replace with actual functions)
    const objects = await detectObjects(imageBuffer);
    const labels = await detectLabels(imageBuffer); // Assuming a separate function for labels

    const predictions = {
      objects: objects,
      labels: labels, // Combine results
    };
    console.log(predictions);
    res.status(200).json({
      message: "Image processed successfully",
      predictions: predictions,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error processing image", error: error.message });
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

async function detectObjects(imageBuffer) {
  const request = {
    image: {
      content: imageBuffer.toString("base64"),
    },
    features: [
      { type: 'OBJECT_LOCALIZATION' },
      { type: 'LABEL_DETECTION' }, // Add additional features here (text detection, landmark detection, etc.)
    ],
  };

  const visionClient = getVisionClient();

  try {
    const response = await visionClient.annotateImage(request);
    const objects = response.localizedObjectAnnotations.map((obj) => ({
      name: obj.name,
      score: obj.score,
      boundingPoly: {
        x: obj.boundingPoly.normalizedVertices[0].x,
        y: obj.boundingPoly.normalizedVertices[0].y,
        width: obj.boundingPoly.normalizedVertices[1].x - obj.boundingPoly.normalizedVertices[0].x,
        height: obj.boundingPoly.normalizedVertices[3].y - obj.boundingPoly.normalizedVertices[0].y,
      },
    }));
    const labels = response.labelAnnotations.map((label) => ({ description: label.description, score: label.score })); // Extract labels

    return { objects, labels }; // Return both objects and labels
  } catch (error) {
    throw new Error(`Error detecting objects: ${error}`);
  }
}


// Exporting the controllers
export { authUser, logoutUser, registerUser, addImage };
