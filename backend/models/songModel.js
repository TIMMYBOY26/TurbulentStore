import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date, // Corrected to Date
        required: true,
    },
    lyrics: {
        type: String,
        required: true,
    },
    youtubelink: {
        type: String,
        required: true,
    },
    image: {
        type: [String], // Changed to an array of strings to store image URLs or paths
        required: true,
    }
});

// Create the model
const songModel = mongoose.models.song || mongoose.model('song', songSchema);

export default songModel;
