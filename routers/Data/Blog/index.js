import mongoose from "mongoose";
const Schema = mongoose.Schema;
const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    coverimage: {
        type: String,
        required: true
    },
    type: {
        type: String,
        require: true
    },
    content: [
        {
            type: {
                type: String,
                enum: ['text', 'image'],
                required: true
            },
            data: {
                type: String,
                required: true
            }
        }
    ],
    date: {
        type: Date,
    }
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;