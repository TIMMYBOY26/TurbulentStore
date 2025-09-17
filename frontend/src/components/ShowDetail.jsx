import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchShowDetail = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shows/${id}`);
        setShow(response.data.show);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetail();
  }, [API_URL, id]);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!show) return <p className="text-center">Show not found</p>;

  // Determine if the show is in the past or upcoming
  const isPastEvent = new Date(show.date) < new Date();
  const instagramButtonText = isPastEvent
    ? "View on Instagram"
    : "View show details on Instagram";

  return (
    <div className="show-detail container mx-auto p-4 md:p-8">
      {/* Flex container for large screens */}
      <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
        <div className="flex justify-center flex-wrap mb-4 lg:w-1/2">
          {show.image.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${show.name} image ${index + 1}`}
              className="w-full h-auto object-cover p-1"
            />
          ))}
        </div>

        <div className="lg:w-1/2">
          {/* Past Event Indicator */}
          {isPastEvent && (
            <div className="bg-gray-200 text-gray-700 text-sm px-4 py-1 mb-4">
              <strong>Past Event:</strong> This event has already taken place.
            </div>
          )}
          <h1 className="text-3xl sm:text-2xl font-bold mb-2">{show.name}</h1>
          <p>
            <span className="font-medium">
              {new Date(show.date).toLocaleDateString()}
            </span>
          </p>
          <p className="text-lg mb-4 whitespace-pre-wrap break-words">
            {show.description}
          </p>
          <div className="text-gray-600 mb-4">
            <p>
              Location: <span className="font-medium">{show.location}</span>
            </p>
            <p>
              Status: <span className="font-medium">{show.status}</span>
            </p>
          </div>

          {/* Instagram Share Link Section */}
          {show.instagramLink && (
            <div className="mt-4">
              <a
                href={show.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white px-4 py-2 transition duration-200"
              >
                {instagramButtonText}
              </a>
            </div>
          )}

          <a
            href={show.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-4 py-2 transition duration-200 mb-2"
          >
            Tickets / Reservation
          </a>

          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-block bg-gray-300 text-black px-4 py-2 transition duration-200"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetail;
