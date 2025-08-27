import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const ListSong = ({ token }) => {
  const [list, setList] = useState([]);
  const [editLyricsId, setEditLyricsId] = useState(null); // State to track the lyrics being edited
  const [newLyrics, setNewLyrics] = useState(""); // State to track the new lyrics

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/song/list"); // Changed to songs endpoint

      if (response.data.success) {
        setList(response.data.songs);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateSong = async (id, lyrics) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/song/update", // Adjusted to match your API endpoint
        { id, lyrics },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Song updated!"); // Success toast for update
        setEditLyricsId(null); // Exit lyrics editing mode
        await fetchList(); // Refresh the list after update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message); // Error toast for catch block
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateSong(id, newLyrics);
    }
  };

  useEffect(() => {
    fetchList(); // Fetch the song list on component mount
  }, []);

  return (
    <>
      <ToastContainer /> {/* Add ToastContainer here */}
      <p className="mb-2">All Song List</p>
      <div className="flex flex-col gap-2">
        {/* List table title  */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Release Date</b>
          <b>Lyrics</b>
          <b className="text-center">Action</b>
        </div>

        {/* Song list */}
        {list.map((item) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={item._id}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.date}</p>
            {editLyricsId === item._id ? (
              <input
                type="text"
                value={newLyrics}
                onChange={(e) => setNewLyrics(e.target.value)}
                onBlur={() => updateSong(item._id, newLyrics)} // Update song on input blur
                onKeyDown={(e) => handleKeyDown(e, item._id)} // Handle Enter key
                className="border p-1 w-40"
                autoFocus
              />
            ) : (
              <p
                onClick={() => {
                  setEditLyricsId(item._id);
                  setNewLyrics(item.lyrics);
                }}
                className="cursor-pointer"
              >
                {item.lyrics}
              </p>
            )}
            <p
              onClick={() => removeSong(item._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListSong;
