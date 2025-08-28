import React from "react";

const SongDetail = ({ song }) => {
    return (
        <div className="song-detail">
            <h2>{song.name}</h2>
            <p>{song.description}</p>
            <p>Release Date: {new Date(song.date).toLocaleDateString()}</p>
            <p>Artist: {song.artist}</p> {/* Assuming you have an artist field */}
            <p>Genre: {song.genre}</p> {/* Assuming you have a genre field */}

            <h3>Lyrics:</h3>
            <p>{song.lyrics}</p> {/* Display lyrics */}

            <h3>Watch on YouTube:</h3>
            <a href={song.youtubelink} target="_blank" rel="noopener noreferrer">
                {song.youtubelink}
            </a> {/* Link to the YouTube video */}

            <h3>Images:</h3>
            <div className="image-gallery">
                {song.image.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`Song image ${index + 1}`} />
                ))}
            </div> {/* Display images */}
        </div>
    );
};

export default SongDetail;
