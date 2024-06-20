import express from "express";
import User from "../../Data/user.js";
import Template from "../../Data/CVBuild/template.js";

const router = express.Router();

router.post('/createtemplate', async (req, res) => {
    const {
        email,
        typeId,
        fullName,
        bio,
        location,
        country,
        phoneNumber,
        website,
        socialAccount1,
        socialAccount2,
        socialAccount3,
        experience,
        education,
        project,
        cert,
        skills,
        summary,
    } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'RECRUITER') {
            return res.status(403).json({ message: 'Recruiters are not allowed to create CVs' });
        }
        const newTemplate = new Template({
            user: user._id,
            email,
            typeId,
            fullName,
            bio,
            location,
            country,
            phoneNumber,
            website,
            socialAccount1,
            socialAccount2,
            socialAccount3,
            experience,
            education,
            project,
            cert,
            skills,
            summary,
        });
        await newTemplate.save();
        user.template = newTemplate._id;
        await user.save();
        res.status(201).json({ message: 'CV was created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const templateId = req.params.id;
        const template = await Template.findById(templateId);
        res.status(200).json(template);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/getalltemplate', async (req, res) => {
    try {
        let template = await Template.find(query)
        res.status(200).send(template);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

router.get('/gettemplatebyuser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const template = await Template.find({ user: user._id });
        res.status(200).json({ template });
    } catch (error) {
        console.error('Error getting portfolio:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const templateId = req.params.id;
        const deletedTemplate = await Template.findByIdAndDelete(templateId);
        if (!deletedTemplate) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        res.status(200).json({ message: "Portfolio deleted successfully" });
    } catch (error) {
        console.error("Error deleting :", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;

