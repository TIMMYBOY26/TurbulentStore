import { v2 as cloudinary } from "cloudinary";
import showModel from "../models/showModel.js";

// 1. Add Show
const addShow = async (req, res) => {
  try {
    const {
      name,
      description,
      date,
      location,
      ticketLink,
      status,
      instagramLink,
    } = req.body;
    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];

    const images = [image1, image2, image3].filter(
      (item) => item !== undefined,
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const showData = {
      name,
      description,
      date,
      location,
      ticketLink,
      image: imagesUrl,
      status,
      instagramLink,
    };
    const show = new showModel(showData);
    await show.save();

    res.json({ success: true, message: "Show Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 2. List All Shows
const listShows = async (req, res) => {
  try {
    const shows = await showModel.find({});
    res.json({ success: true, shows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 3. Single Show Info
const singleShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await showModel.findById(id);
    res.json({ success: true, show });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 4. Remove Show
const removeShow = async (req, res) => {
  try {
    await showModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Show Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 5. Update Show
const updateShow = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    await showModel.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Show Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 6. Filter by Status
const filterShowsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const shows = await showModel.find({ status });
    res.json({ success: true, shows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// CRITICAL: All names here must match the const names above
export {
  addShow,
  listShows,
  singleShow,
  removeShow,
  updateShow,
  filterShowsByStatus,
};
