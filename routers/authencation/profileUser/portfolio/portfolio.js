import mongoose, { Schema } from "mongoose";
import User from "../../../Data/user.js";
import express from "express";

const router = express.Router();

//Portfolio

const PortfolioSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: String,
    title: String,
    price: String,
    hastag: String,
    detailed_page: String,
    participantperiod: Date,
    client: String,
    sector: String,
    style: String,
    price: String,
    file1: String,
    file2: String,
    file3: String,
    file4: String,
    img1: String,
    img2: String,
    img3: String,
    img4: String,
    video: String,
    dateupload: {
        type: Date,
        default: Date.now
    },
});
const Portfolio = mongoose.model('Portfolio', PortfolioSchema)

router.post('/addportfolio', async (req, res) => {
    const {
        email,
        title,
        hastag,
        detailed_page,
        participantperiod,
        client,
        sector,
        style,
        price,
        file1,
        file2,
        file3,
        file4,
        img1,
        img2,
        img3,
        img4,
        video,
    } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'RECRUITER') {
            return res.status(403).json({ message: 'Recruiters are not allowed to apply' });
        }
        const newPortfolio = new Portfolio({
            user: user._id,
            email,
            title,
            hastag,
            detailed_page,
            participantperiod,
            client,
            sector,
            style,
            price,
            file1,
            file2,
            file3,
            file4,
            img1,
            img2,
            img3,
            img4,
            video,
        });
        await newPortfolio.save();
        user.portfolio = newPortfolio._id;
        await user.save();

        res.status(201).json({ message: 'Portfolio added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/portfolio/:id', async (req, res) => {
    try {
        const portfolioId = req.params.id;
        const portfolio = await Portfolio.findById(portfolioId);

        res.status(200).json(portfolio);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/getallportfolio', async (req, res) => {
    try {
        let portfolio = await Portfolio.find(query)
        res.status(200).send(portfolio);
    } catch (error) {
        res.status(500).send("Lỗi server");
    }
});

router.get('/getportfoliobyuser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const portfolio = await Portfolio.find({ user: user._id });
        res.status(200).json({ portfolio });
    } catch (error) {
        console.error('Error getting portfolio:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.delete("/portfolio/:id", async (req, res) => {
    try {
        const portfolioId = req.params.id;
        const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId);
        if (!deletedPortfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        res.status(200).json({ message: "Portfolio deleted successfully" });
    } catch (error) {
        console.error("Error deleting :", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;