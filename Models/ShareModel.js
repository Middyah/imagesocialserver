import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ShareSchema = new Schema({
    post_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Share = mongoose.model('Share', ShareSchema);

export default Share;
