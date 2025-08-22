import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSong = ({ token }) => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(""); // Ensure this is an empty string initially
    const [lyrics, setLyrics] = useState("");
    const [youtubelink, setYoutubelink] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("date", date); // Ensure this is in the format YYYY-MM-DD
            formData.append("lyrics", lyrics);
            formData.append("youtubelink", youtubelink);

            if (image1) formData.append("image1", image1);
            if (image2) formData.append("image2", image2);
            if (image3) formData.append("image3", image3);

            const response = await axios.post(
                `${backendUrl}/api/song/add`,
                formData,
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Song added successfully!");
            } else {
                toast.error(response.data.message || "Failed to add song.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "An error occurred.");
        }
    };

    return (
        <>
            <ToastContainer />
            <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
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
                    <p className="mb-2">Song Name</p>
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
                    <p className="mb-2">Song Description</p>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="w-full max-w-[500px] px-3 py-2"
                        placeholder="Write content here"
                        required
                    />
                </div>

                <div className="w-full">
                    <p className="mb-2">Release Date</p>
                    <input
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                        className="w-full max-w-[500px] px-3 py-2"
                        type="date"
                        required
                    />
                </div>

                <div className="w-full">
                    <p className="mb-2">Lyrics</p>
                    <textarea
                        onChange={(e) => setLyrics(e.target.value)}
                        value={lyrics}
                        className="w-full max-w-[500px] px-3 py-2"
                        placeholder="Write lyrics here"
                        required
                    />
                </div>

                <div className="w-full">
                    <p className="mb-2">YouTube Link</p>
                    <input
                        onChange={(e) => setYoutubelink(e.target.value)}
                        value={youtubelink}
                        className="w-full max-w-[500px] px-3 py-2"
                        placeholder="Enter YouTube link"
                        required
                    />
                </div>

                <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
                    ADD SONG
                </button>
            </form>
        </>
    );
};

export default AddSong;
