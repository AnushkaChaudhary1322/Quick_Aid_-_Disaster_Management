import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true }, 
  beds: { type: Number, required: true },
  specialties: { type: [String], required: true }, 
  availability: { type: Boolean, default: true }, 
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  emergency_services: { type: Boolean, required: true },
  photos: { type: [String], required: false },
  mapUrl: { type: String, required: false },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
