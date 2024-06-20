import User from "../../Data/user.js";
import express from "express";
import mongoose from "mongoose";
const router = express.Router();
const Schema = mongoose.Schema;
const applyUserSchema = new Schema({
    userId: String,
    email: String,
    fullName: String,
    recruitmentId: String,
    linkcoverletter: String,
    linkcv: {
        type: String,
        required: true,
    }
});
const ApplyUser = mongoose.model('ApplyUser', applyUserSchema);
router.post('/apply', async (req, res) => {
    try {
        const { userId, fullName, email, recruitmentId, linkcv, linkcoverletter } = req.body;
        const user = await User.findById(userId);
        // Check if required fields are provided
        if (!userId) {
            return res.status(400).json({ message: 'Full name and email are required' });
        }
        // Find the recruitment document
        const recruitment = await Recruitment.findById(recruitmentId);
        if (!recruitment) {
            return res.status(404).json({ message: 'Recruitment not found' });
        }
        if (!linkcv) {
            return res.status(404).json({ message: 'You need choose your cv' });
        }
        // Check if the user has the role "RECRUITER"
        if (user.role === 'RECRUITER') {
            return res.status(403).json({ message: 'Recruiters are not allowed to apply' });
        }
        // Check if the user has already applied
        const existingUser = await ApplyUser.findOne({ email, recruitmentId });
        if (existingUser) {
            return res.status(400).json({ message: 'User has already applied for a recruitment' });
        }
        // Create a new applying user
        const newUser = new ApplyUser({
            fullName,
            email,
            userId,
            recruitmentId,
            linkcoverletter,
            linkcv
        });
        await newUser.save();

        // Add the user to the list of applied users
        recruitment.appliedUsers.push(newUser._id);
        await recruitment.save();

        res.status(200).json({ message: 'User applied successfully' });
    } catch (error) {
        console.error('Error applying:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/applied-users', async (req, res) => {
    try {
        // Query the database to retrieve all applied users
        const appliedUsers = await ApplyUser.find()

        // Send the retrieved data as a response
        res.status(200).json(appliedUsers);
    } catch (error) {
        console.error('Error fetching applied users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/applied-users/:recruitmentId', async (req, res) => {
    try {
        const recruitmentId = req.params.recruitmentId;

        // Query the database to retrieve applied users for the given recruitment ID
        const appliedUsers = await ApplyUser.find({ recruitmentId: recruitmentId })
        const promises = appliedUsers.map(async (v) => {
            const doc = await User.find({ email: v.email })
            return { ...v, ...doc }
        })
        const result = await Promise.all(promises)
        // Send the retrieved data as a response

        res.status(200).json({ result });
    } catch (error) {
        console.error('Error fetching applied users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;