import React, { useContext, useEffect, useState } from "react";
import { SongsContext } from "../context/SongsContext"; // Import the SongsContext
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { SongItem } from "../components/SongItem"; // Create a SongItem component similar to ProductItem

const SongsCollection = () => {
    const { songs, search, showSearch } = useContext(SongsContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterSongs, setFilterSongs] = useState([]);
    const [category, setCategory] = useState([]);
    const [sortType, setSortType] = useState("relevant");

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setCategory((prev) => [...prev, e.target.value]);
        }
    };

    const applyFilter = () => {
        let songsCopy = songs.slice();

        if (showSearch && search) {
            songsCopy = songsCopy.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category.length > 0) {
            songsCopy = songsCopy.filter((item) =>
                category.includes(item.category)
            );
        }

        setFilterSongs(songsCopy.reverse());
    };

    const sortSongs = () => {
        let fsCopy = filterSongs.slice();

        switch (sortType) {
            case "low-high":
                setFilterSongs(fsCopy.sort((a, b) => a.price - b.price).reverse());
                break;

            case "high-low":
                setFilterSongs(fsCopy.sort((a, b) => b.price - a.price).reverse());
                break;

            default:
                applyFilter();
                break;
        }
    };

    useEffect(() => {
        applyFilter();
    }, [category, search, showSearch, songs]);

    useEffect(() => {
        sortSongs();
    }, [sortType]);

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            {/* Filter Options */}
            <div className="min-w-60">
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                >
                    FILTERS
                    <img
                        className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
                        src={assets.dropdown_icon}
                        alt=""
                    />
                </p>
                {/* Category Filter */}
                <div
                    className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
                        } sm:block`}
                >
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                type="checkbox"
                                value={"POP"} // Example category
                                onChange={toggleCategory}
                            />
                            Pop
                        </p>
                        <p className="flex gap-2">
                            <input
                                className="w-3"
                                type="checkbox"
                                value={"ROCK"} // Example category
                                onChange={toggleCategory}
                            />
                            Rock
                        </p>
                        {/* Add more categories as needed */}
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={"All"} text2={"SONGS"} />
                    {/* Song sort */}
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className="border-2 border-gray-300 text-sm px-2"
                    >
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="high-low">Sort by: Price low to high</option>
                        <option value="low-high">Sort by: Price high to low</option>
                    </select>
                </div>

                {/* Map song */}
                <div className="grid grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-6">
                    {filterSongs.map((item, index) => (
                        <SongItem
                            key={index}
                            name={item.name}
                            id={item._id}
                            price={item.price} // Assuming songs have a price, adjust as necessary
                            image={item.image} // Assuming songs have an image
                            date={item.date} // Add additional props as needed
                            lyrics={item.lyrics}
                            youtubelink={item.youtubelink}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SongsCollection;
