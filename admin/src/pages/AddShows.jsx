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
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [status, setStatus] = useState("upcoming");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("location", location);
      formData.append("ticketLink", ticketLink);
      formData.append("instagramLink", instagramLink);
      formData.append("status", status);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);

      const response = await axios.post(
        `${backendUrl}/api/shows/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Show added successfully!");
        // Optional: Reset fields here
      } else {
        toast.error(response.data.message || "Failed to add show.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred.");
    }
  };

  return (
    <div className="p-4 w-full">
      <ToastContainer />

      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6 pb-2 ">Add Show</h1>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-3"
      >
        <div>
          <p className="mb-2 font-medium">Upload Images</p>
          <div className="flex gap-2">
            {[image1, image2, image3].map((img, index) => (
              <label key={index} htmlFor={`image${index + 1}`}>
                <img
                  className="w-20 h-20 object-cover border cursor-pointer"
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt=""
                />
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (index === 0) setImage1(file);
                    if (index === 1) setImage2(file);
                    if (index === 2) setImage3(file);
                  }}
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium">Show Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            type="text"
            placeholder="Enter show name"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium">Show Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            placeholder="Write content here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium">Show Date</p>
          <input
            onChange={(e) => setDate(e.target.value)}
            value={date}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            type="date"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium">Location</p>
          <input
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            placeholder="Enter location"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium">Ticket Link</p>
          <input
            onChange={(e) => setTicketLink(e.target.value)}
            value={ticketLink}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            placeholder="Enter ticket link"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium">Instagram Link</p>
          <input
            onChange={(e) => setInstagramLink(e.target.value)}
            value={instagramLink}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            type="text"
            placeholder="Enter Instagram link"
          />
        </div>

        <div className="w-full">
          <p className="mb-2 font-medium">Show Status</p>
          <select
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            required
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button type="submit" className="w-full max-w-[500px] py-3 mt-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
          ADD SHOW
        </button>
      </form>
    </div>
  );
};

export default AddShow;
