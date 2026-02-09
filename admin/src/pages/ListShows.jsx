import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { ToastContainer, toast } from "react-toastify";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Check,
  X,
  Ticket,
} from "lucide-react";

const ListShows = () => {
  const [list, setList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/shows/list`);
      if (response.data.success) setList(response.data.shows);
    } catch (error) {
      toast.error("Error fetching list");
    }
  };

  const removeShow = async (id) => {
    if (window.confirm("Delete this show?")) {
      try {
        const response = await axios.post(`${backendUrl}/api/shows/remove`, {
          id,
        });
        if (response.data.success) {
          toast.success("Deleted");
          fetchList();
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/shows/update`, {
        id,
        ...editData,
      });
      if (response.data.success) {
        toast.success("Updated");
        setEditId(null);
        fetchList();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Show Management</h2>
      <div className="flex flex-col gap-4">
        {list.map((show) => {
          const isExpanded = expandedId === show._id;
          const isEditing = editId === show._id;

          return (
            <div
              key={show._id}
              className="border rounded-xl bg-white shadow-sm overflow-hidden border-gray-100"
            >
              <div className="flex justify-between items-center p-4">
                <div
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => setExpandedId(isExpanded ? null : show._id)}
                >
                  <img
                    className="w-14 h-14 object-cover rounded-lg shadow-inner"
                    src={show.image[0]}
                    alt=""
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {show.name}
                      {/* STATUS BADGE */}
                      {show.isTicketAvailable && (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tighter ${show.ticketStatus === "Sold Out" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                        >
                          {show.ticketStatus || "Active"}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(show.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditId(show._id);
                      setEditData(show);
                    }}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => removeShow(show._id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : show._id)}
                    className="p-2 text-gray-400"
                  >
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t bg-gray-50">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      <input
                        className="border p-2 rounded text-sm"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        placeholder="Name"
                      />
                      <input
                        className="border p-2 rounded text-sm"
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({ ...editData, location: e.target.value })
                        }
                        placeholder="Location"
                      />
                      <textarea
                        className="border p-2 rounded text-sm md:col-span-2"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description"
                      />

                      {/* NEW TICKET CONTROLS */}
                      <div className="md:col-span-2 p-3 bg-white rounded-lg border border-dashed flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="ticket-active"
                            checked={editData.isTicketAvailable || false}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                isTicketAvailable: e.target.checked,
                              })
                            }
                            className="w-4 h-4 accent-black"
                          />
                          <label
                            htmlFor="ticket-active"
                            className="text-xs font-bold uppercase"
                          >
                            Enable Ticket Button
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="border p-2 rounded text-xs bg-gray-50"
                            value={editData.ticketStatus || "Coming Soon"}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                ticketStatus: e.target.value,
                              })
                            }
                          >
                            <option value="Coming Soon">Coming Soon</option>
                            <option value="Available">Available</option>
                            <option value="Sold Out">Sold Out</option>
                          </select>
                          <input
                            className="border p-2 rounded text-xs"
                            value={editData.ticketLink || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                ticketLink: e.target.value,
                              })
                            }
                            placeholder="Ticket Link (URL)"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(show._id)}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-1 hover:bg-blue-700"
                        >
                          <Check size={14} /> Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm flex items-center gap-1 hover:bg-gray-300"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Location
                        </p>
                        <p className="text-gray-700">{show.location}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Ticket Status
                        </p>
                        <p className="text-gray-700 flex items-center gap-1">
                          <Ticket size={14} />{" "}
                          {show.isTicketAvailable
                            ? show.ticketStatus || "Active"
                            : "Inactive"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Description
                        </p>
                        <p className="text-gray-700 whitespace-pre-line">
                          {show.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListShows;
