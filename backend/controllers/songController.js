import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

// function for add song
const addSong = async (req, res) => {
    try {
        const { name, description, date, lyrics, youtubelink } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]

        const images = [image1, image2, image3].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )
        const songData = {
            name,
            description,
            date,
            lyrics,
            youtubelink,
            image: imagesUrl,
        };
        console.log(songData)
        const song = new songModel(songData);
        await song.save()

        res.json({ success: true, message: "song Added" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// function for list song
const listSong = async (req, res) => {
    try {
        const songs = await songModel.find({});
        res.json({ success: true, songs });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for single song info
const singleSong = async (req, res) => {
    try {
        const { songId } = req.body;
        const song = await songModel.findById(songId);
        res.json({ success: true, song });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listSong, addSong, singleSong }