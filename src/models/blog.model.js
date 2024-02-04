import mongoose, {Schema} from "mongoose";

const blogSchema = new Schema(
    {
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date_posted: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}
);

export const Blog = mongoose.model('Blog', blogSchema);

