import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListShows = () => {
    const [list, setList] = useState([]);


    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/shows/list");
            if (response.data.success) {
                setList(response.data.shows);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleKeyDown = (e, id) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // Assuming updateShow is a function you have defined elsewhere
            updateShow(id, newShowName, newShowDate);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <>
            <ToastContainer />
            <h2>Show List</h2>
            <div className="flex flex-col gap-2">
                {list.map((show, index) => (
                    <div className="flex justify-between items-center border p-2" key={show.id || index}>
                        <img className="w-12" src={show.image[0]} alt="" />
                        <span>{show.name}</span>
                        <span>{show.date}</span>
                        <span>{show.description}</span>
                        <span>{show.location}</span>
                        <span>{show.status}</span>

                    </div>
                ))}
            </div>
        </>
    );
};

export default ListShows;
