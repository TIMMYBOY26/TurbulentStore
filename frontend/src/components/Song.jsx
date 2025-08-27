import React from "react";
import { Link } from "react-router-dom";

const Song = ({ song }) => {
  return (
    <li className="song-item">
      <h3>{song.name}</h3>
      <p>{song.description}</p>
      <p>Release Date: {new Date(song.date).toLocaleDateString()}</p>
      <Link to={`/songs/${song._id}`}>View Details</Link>{" "}
      {/* Link to the single song view */}
      <h3>------------------</h3>
    </li>
  );
};

export default Song;
