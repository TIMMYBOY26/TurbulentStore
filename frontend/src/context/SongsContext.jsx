import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const SongsContext = createContext();

export const SongsProvider = ({ children }) => {
    const [songs, setSongs] = useState([]);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get("/api/song"); // Adjust API endpoint as necessary
                setSongs(response.data);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };

        fetchSongs();
    }, []);

    return (
        <SongsContext.Provider value={{ songs, search, setSearch, showSearch, setShowSearch }}>
            {children}
        </SongsContext.Provider>
    );
};
