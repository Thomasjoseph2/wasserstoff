import vision from "@google-cloud/vision";

let visionClient;
function getVisionClient() {
  if (!visionClient) {
    visionClient = new vision.ImageAnnotatorClient(); // Create client on first call
  }
  return visionClient;
}

 export default getVisionClient 
