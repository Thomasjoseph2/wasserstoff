import mongoose from "mongoose";
const annotationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    confidence: { type: Number, required: true },
    boundingBox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true }, // URL to image stored in cloud storage
  annotations: [annotationSchema],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  uploadedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
