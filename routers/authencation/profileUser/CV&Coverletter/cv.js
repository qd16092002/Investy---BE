import User from "../../../Data/user.js";
import express from "express";
import mongoose from "mongoose";
const router = express.Router();
const Schema = mongoose.Schema;

//Cover Letter
const coverletterSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    namefile: String,
    urlfile: String,
});
const CoverLetterUser = mongoose.model('CoverLetter', coverletterSchema)

router.post('/addcoverletter', async (req, res) => {
    const {
        email,
        urlfile,
        namefile
    } = req.body;
    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Tạo thành viên của đội
        const newCv = new CoverLetterUser({
            user: user._id,
            email,
            urlfile,
            namefile
        });
        await newCv.save();
        // Liên kết thành viên với người dùng
        user.services = newCv._id;
        await user.save();
        res.status(201).json({ message: 'CoverLetter added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/coverletteruser/:id', async (req, res) => {
    try {
        const cvUserId = req.params.id;
        const cvuser = await CoverLetterUser.findById(cvUserId);
        res.status(200).json(cvuser);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/getcoverletteruser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const cvuser = await CoverLetterUser.find({ user: user._id });
        res.status(200).json({ cvuser });
    } catch (error) {
        console.error('Error getting CoverLetter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.delete("/coverletteruser/:id", async (req, res) => {
    try {
        const cvUserId = req.params.id;
        const deletedCvUser = await CoverLetterUser.findByIdAndDelete(cvUserId);
        if (!deletedCvUser) {
            return res.status(404).json({ message: "CoverLetter not found" });
        }
        res.status(200).json({ message: "CoverLetter deleted successfully" });
    } catch (error) {
        console.error("Error deleting :", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//CV 
const cvSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    namefile: String,
    urlfile: String,
});
const CvUser = mongoose.model('CVUser', cvSchema)

router.post('/addcvuser', async (req, res) => {
    const {
        email,
        urlfile,
        namefile
    } = req.body;
    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Tạo thành viên của đội
        const newCv = new CvUser({
            user: user._id,
            email,
            urlfile,
            namefile
        });
        await newCv.save();
        // Liên kết thành viên với người dùng
        user.services = newCv._id;
        await user.save();
        res.status(201).json({ message: 'CV added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/cvuser/:id', async (req, res) => {
    try {
        const cvUserId = req.params.id;
        const cvuser = await CvUser.findById(cvUserId);
        res.status(200).json(cvuser);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/getcvuser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const cvuser = await CvUser.find({ user: user._id });
        res.status(200).json({ cvuser });
    } catch (error) {
        console.error('Error getting CV:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.delete("/cvuser/:id", async (req, res) => {
    try {
        const cvUserId = req.params.id;
        const deletedCvUser = await CvUser.findByIdAndDelete(cvUserId);
        if (!deletedCvUser) {
            return res.status(404).json({ message: "CV not found" });
        }
        res.status(200).json({ message: "CV deleted successfully" });
    } catch (error) {
        console.error("Error deleting :", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;