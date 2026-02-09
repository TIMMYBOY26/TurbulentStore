import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  ticketLink: { type: String, default: "" }, // Changed from required: true to allow empty links for upcoming shows
  image: { type: [String], default: [] },
  status: {
    type: String,
    enum: ["upcoming", "past", "cancelled"],
    required: true,
  },
  instagramLink: { type: String },

  // --- NEW CONTROL FIELDS ---
  isTicketAvailable: {
    type: Boolean,
    default: false, // Prevents errors for old data (defaults to inactive)
  },
  ticketStatus: {
    type: String,
    enum: ["Available", "Sold Out", "Coming Soon"],
    default: "Coming Soon", // Prevents errors for old data
  },
});

const showModel = mongoose.model("Show", showSchema);
export default showModel;
