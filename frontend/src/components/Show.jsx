import React from "react";
import { Link } from "react-router-dom";

const Show = ({ show }) => {
    const currentDate = new Date();
    const showDate = new Date(show.date);
    let status;

    if (showDate > currentDate) {
        status = "Upcoming !!";
    } else if (showDate < currentDate) {
        status = "Past";
    } else {
        status = "Ongoing";
    }

    return (
        // 最外層已經是一個連結了
        <Link to={`/shows/${show._id}`} className="block p-4 group">
            <div className="show-card flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 py-2">
                <div className="flex flex-col w-full sm:w-1/4 mb-2 sm:mb-0">
                    <div className="flex items-center">
                        <p className="text-gray-500 mr-2">{new Date(show.date).toLocaleDateString()}</p>
                        <p className={`text-sm font-semibold ${status === "Upcoming !!" ? "text-green-500" : status === "Ongoing" ? "text-blue-500" : "text-red-500"}`}>
                            {status}
                        </p>
                    </div>
                </div>

                <h2 className="text-xl font-bold flex-grow text-left mb-2 sm:mb-0 sm:mr-4">
                    {show.name}
                </h2>

                {/* 
                    修正處：將內部的 <Link> 改為 <div> 或 <span>
                    因為外層已經有 Link，這裡改為 div 視覺上仍像按鈕，且點擊會觸發外層 Link 跳轉 
                */}
                <div className="bg-black text-white px-4 py-2 text-center transition w-full sm:w-auto group-hover:bg-gray-800">
                    {status === "Past" ? "Details" : "Details / Reservation"}
                </div>
            </div>
        </Link>
    );
};

export default Show;
