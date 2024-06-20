import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    content: String,
    image: String,
    rating: Number,
    subjectId: String,
    subjectType: String, //USER,RECRUITMENT,FREELANCE
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);
export default Review;
