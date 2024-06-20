import mongoose, { Schema } from "mongoose";
import User from "../../../Data/user.js";
import express from "express";
import Review from "../../../Data/Review/Services.js";

const router = express.Router();
const servicesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: String,
    title: String,
    category: String,
    searchtag: String,
    description: String,
    requirement: String,
    answertype: String,
    questions: String,
    answer: String,
    mandatory: String,
    file: String,
    img1: String,
    img2: String,
    img3: String,
    img4: String,
    dateupload: {
        type: Date,
        default: Date.now
    },
    standard: [{
        VAT1: String,
        note11: String,
        note21: String,
        note31: String,
        correctionwork1: String,
        available1: String,
        numberofdrafts1: String,
        workingday1: String,
        numberofmodifications1: String
    }],
    deluxe: [{
        VAT2: String,
        note12: String,
        note22: String,
        note32: String,
        correctionwork2: String,
        available2: String,
        numberofdrafts2: String,
        workingday2: String,
        numberofmodifications2: String
    }],
    premium: [{
        VAT3: String,
        note13: String,
        note23: String,
        note33: String,
        correctionwork3: String,
        available3: String,
        numberofdrafts3: String,
        workingday3: String,
        numberofmodifications3: String
    }]
});
const Services = mongoose.model('Services', servicesSchema)

router.post('/addservices', async (req, res) => {
    const {
        email,
        title,
        file,
        category,
        searchtag,
        description,
        requirement,
        answertype,
        questions,
        answer,
        mandatory,
        standard,
        deluxe,
        premium,
        img1,
        img2,
        img3,
        img4
    } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'RECRUITER') {
            return res.status(403).json({ message: 'Recruiters are not allowed to apply' });
        }
        const newServices = new Services({
            user: user._id,
            email,
            title,
            file,
            category,
            searchtag,
            description,
            requirement,
            answertype,
            questions,
            answer,
            img1,
            img2,
            img3,
            img4,
            mandatory,
            standard,
            deluxe,
            premium,
            rate: {
                value: 5
            }
        });
        await newServices.save();
        user.services = newServices._id;
        await user.save();

        res.status(201).json({ message: 'Services added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/services/:id', async (req, res) => {
    try {
        const servicesId = req.params.id;
        const service = await Services.findById(servicesId).populate('user', 'fullName avturl _id');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const reviews = await Review.find({ subjectType: 'SERVICES', subjectId: servicesId }).populate('createdBy', 'userId username email');

        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        // Add the reviews and rating info to the service object
        service._doc.reviews = {
            averageRating,
            totalReviews: reviews.length,
            details: reviews
        };

        res.status(200).json(service);
    } catch (error) {
        console.error("Error retrieving service and reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/getallservices', async (req, res) => {
    try {
        const { keyword, category, workingday, minBudget, maxBudget, vat } = req.query;
        let query = {};
        if (keyword) {
            query['$or'] = [
                { 'title': { $regex: new RegExp(keyword, 'i') } },
                { 'category': { $regex: new RegExp(keyword, 'i') } },
                { 'searchtag': { $regex: new RegExp(keyword, 'i') } },
                { 'description': { $regex: new RegExp(keyword, 'i') } },
                { 'requirement': { $regex: new RegExp(keyword, 'i') } },
                { 'questions': { $regex: new RegExp(keyword, 'i') } },
                { 'answer': { $regex: new RegExp(keyword, 'i') } },
                { 'standard.workingday1': keyword },
                { 'deluxe.workingday2': keyword },
                { 'premium.workingday3': keyword },
                { 'standard.note31': keyword },
                { 'deluxe.note32': keyword },
                { 'premium.note33': keyword },
                { 'standard.VAT1': { $gte: parseInt(keyword), $lte: parseInt(keyword) } },
                { 'deluxe.VAT2': { $gte: parseInt(keyword), $lte: parseInt(keyword) } },
                { 'premium.VAT3': { $gte: parseInt(keyword), $lte: parseInt(keyword) } },
                { 'standard.note11': keyword },
                { 'deluxe.note12': keyword },
                { 'premium.note13': keyword },
                { 'standard.note21': keyword },
                { 'deluxe.note22': keyword },
                { 'premium.note23': keyword },
            ];
        }
        if (category) {
            query['category'] = { $regex: new RegExp(category, 'i') };
        }
        if (workingday) {
            query['$or'] = [
                { 'standard.workingday1': workingday },
                { 'deluxe.workingday2': workingday },
                { 'premium.workingday3': workingday }
            ];
        }
        if (vat) {
            query['$or'] = [
                { 'standard.note31': vat },
                { 'deluxe.note32': vat },
                { 'premium.note33': vat }
            ];
        }
        if (minBudget && maxBudget) {
            query['$or'] = [
                { 'standard.VAT1': { $gte: parseInt(minBudget), $lte: parseInt(maxBudget) } },
                { 'deluxe.VAT2': { $gte: parseInt(minBudget), $lte: parseInt(maxBudget) } },
                { 'premium.VAT3': { $gte: parseInt(minBudget), $lte: parseInt(maxBudget) } }
            ];
        }
        let services = await Services.find(query).populate({
            path: 'user',
            select: 'fullName avturl _id'
        }).sort({ dateupload: -1 });
        res.status(200).send(services);
    } catch (error) {
        res.status(500).send("Lỗi server");
    }
});

router.get('/getservicesbyuser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Tìm người dùng
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Tìm toàn bộ thành viên của đội của người dùng
        const services = await Services.find({ user: user._id });

        res.status(200).json({ services });
    } catch (error) {
        console.error('Error getting services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/getservicesbyuser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Find user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Find services by userId
        const services = await Services.find({ user: user._id });
        // Loop through each service to find reviews and calculate average rating and total reviews
        for (let service of services) {
            const reviews = await Review.find({ subjectType: 'SERVICES', subjectId: service._id }).populate('createdBy', 'userId username email');
            let averageRating = 0;
            let totalReviews = reviews.length;

            if (totalReviews > 0) {
                let totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                averageRating = totalRating / totalReviews;
            }

            // Add review information to the service
            service._doc.reviews = {
                averageRating,
                totalReviews,
                reviews
            };
        }

        // Send the response with services containing embedded review information
        res.status(200).json({ services });
    } catch (error) {
        console.error('Error getting services and reviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.delete("/services/:id", async (req, res) => {
    try {
        const servicesId = req.params.id;
        const deletedServices = await Services.findByIdAndDelete(servicesId);
        if (!deletedServices) {
            return res.status(404).json({ message: "Services not found" });
        }
        res.status(200).json({ message: "Services deleted successfully" });
    } catch (error) {
        console.error("Error deleting :", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;