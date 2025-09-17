import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddShow = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // Ensure this is an initial empty string
  const [location, setLocation] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [instagramLink, setInstagramLink] = useState(""); // New state for Instagram link
  const [status, setStatus] = useState("upcoming"); // Default to 'upcoming'

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("date", date); // Ensure this is in YYYY-MM-DD format
      formData.append("location", location);
      formData.append("ticketLink", ticketLink);
      formData.append("instagramLink", instagramLink); // Append Instagram link
      formData.append("status", status);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);

      const response = await axios.post(
        `${backendUrl}/api/shows/add`, // Update with the correct backend URL
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Show added successfully!");
      } else {
        toast.error(response.data.message || "Failed to add show.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred.");
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-3"
      >
        <div>
          <p className="mb-2">Upload Image</p>
          <div className="flex gap-2">
            <label htmlFor="image1">
              <img
                className="w-20"
                src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
                alt=""
              />
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
              />
            </label>
            <label htmlFor="image2">
              <img
                className="w-20"
                src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
                alt=""
              />
              <input
                onChange={(e) => setImage2(e.target.files[0])}
                type="file"
                id="image2"
                hidden
              />
            </label>
            <label htmlFor="image3">
              <img
                className="w-20"
                src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
                alt=""
              />
              <input
                onChange={(e) => setImage3(e.target.files[0])}
                type="file"
                id="image3"
                hidden
              />
            </label>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2">Show Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Show Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2"
            placeholder="Write content here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Show Date</p>
          <input
            onChange={(e) => setDate(e.target.value)}
            value={date}
            className="w-full max-w-[500px] px-3 py-2"
            type="date"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Location</p>
          <input
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            className="w-full max-w-[500px] px-3 py-2"
            placeholder="Enter location"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Ticket Link</p>
          <input
            onChange={(e) => setTicketLink(e.target.value)}
            value={ticketLink}
            className="w-full max-w-[500px] px-3 py-2"
            placeholder="Enter ticket link"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Instagram Link</p>
          <input
            onChange={(e) => setInstagramLink(e.target.value)}
            value={instagramLink}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Enter Instagram link"
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Show Status</p>
          <select
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            className="w-full max-w-[500px] px-3 py-2"
            required
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
          ADD SHOW
        </button>
      </form>
    </>
  );
};

export default AddShow;
