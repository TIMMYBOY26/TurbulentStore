import React from "react";

const SongDetail = ({ song }) => {
    return (
        <div className="song-detail flex">
            {/* Left side for YouTube player and images */}
            <div className="left-side w-1/2 pr-4">
                <h3>VIDEO</h3>
                {/* Embed the YouTube video player */}
                {song.youtubelink && (
                    <div className="youtube-player mb-4">
                        <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(song.youtubelink)}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                <div className="image-gallery grid grid-cols-2 gap-2">
                    {song.image.map((imgUrl, index) => (
                        <img key={index} src={imgUrl} alt={`Song image ${index + 1}`} className="w-full h-auto rounded shadow" />
                    ))}
                </div> {/* Display images */}
            </div>

            {/* Right side for song details */}
            <div className="right-side w-1/2 pl-4">
                <h2 className="text-2xl font mb-2">{song.name}</h2>                {/* Apply splitting logic to description */}
                <p>
                    {song.description.split('|').map((line, index) => (
                        <span key={index}>
                            {line.trim()}
                            {index < song.description.split('|').length - 1 && <br />} {/* Add line break except after the last line */}
                        </span>
                    ))}
                </p>
                <p>{new Date(song.date).toLocaleDateString()}</p>
                <br />
                <h2 className="text-xl font mb-2">Lyrics:</h2>
                <p>
                    {song.lyrics.split('|').map((line, index) => (
                        <span key={index}>
                            {line.trim()}
                            {index < song.lyrics.split('|').length - 1 && <br />} {/* Add line break except after the last line */}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
};

// Helper function to extract the video ID from a YouTube link
const getYouTubeVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
};

export default SongDetail;
