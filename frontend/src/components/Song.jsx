import React from "react";
import { Link } from "react-router-dom";

const Song = ({ song }) => {
  return (
    <li className="song-item relative flex flex-col items-center p-4">
      {/* Container for image and title */}
      <Link to={`/songs/${song._id}`} className="relative group">
        {/* Display the first image if it exists */}
        {song.image && song.image.length > 0 && (
          <img
            src={song.image[0]}
            alt={`${song.name} cover`}
            className="w-96 h-96 object-contain rounded-lg transition-transform duration-300 transform group-hover:scale-105" // Scale effect on hover
          />
        )}

        {/* Song name positioned at the bottom left of the image */}
        <span className="absolute bottom-2 left-2 text-black text-lg bg-transparent px-2 py-1 rounded transition-opacity duration-300 group-hover:opacity-80">
          {song.name}
        </span>
      </Link>
    </li>
  );
};

export default Song;
