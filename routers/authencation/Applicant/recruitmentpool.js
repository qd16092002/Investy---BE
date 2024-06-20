import express from "express";
import User from "../../Data/user.js";
import Recruitment from "../../Data/REC/recruitment.js";

const router = express.Router();

// API endpoint để gán một Job cho một Applicant
router.post("/select-recruitmentpool", async (req, res) => {
    const { recruitmentId, applicantId } = req.body;
    try {
        // Kiểm tra xem APPLICANT có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Kiểm tra xem Job có tồn tại không
        const recruitment = await Recruitment.findById(recruitmentId);
        if (!recruitment) {
            return res.status(404).json({ message: "Recruitment not found" });
        }
        // Kiểm tra xem APPLICANT đã chọn một RECRUITMENT trước đó chưa
        if (applicant.selectedRecruitments.includes(recruitmentId)) {
            return res.status(400).json({ message: "Applicant has already selected this Recruitment" });
        }
        // Gán RECRUITMENT cho APPLICANT
        applicant.selectedRecruitments.push(recruitmentId);
        await applicant.save();
        res.status(200).json({ message: "Recruitment selected successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint để lấy danh sách các RECRUITMENT của một APPLICANT
router.get("/recruitments/:applicantId", async (req, res) => {
    const { applicantId } = req.params;
    try {
        // Kiểm tra xem APPLICANT có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Lấy danh sách các RECRUITMENT đã được gán cho APPLICANT
        const recruitments = await Recruitment.find({ _id: { $in: applicant.selectedRecruitments } });
        res.status(200).json({ recruitments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint để gỡ bỏ một RECRUITMENT khỏi danh sách được chọn của một APPLICANT
router.delete("/remove-recruitment", async (req, res) => {
    const { recruitmentId, applicantId } = req.body;
    try {
        // Kiểm tra xem APPLICANT có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Kiểm tra xem RECRUITMENT có tồn tại trong danh sách được chọn của APPLICANT không
        const index = applicant.selectedRecruitments.indexOf(recruitmentId);
        if (index === -1) {
            return res.status(404).json({ message: "Recruitment is not selected by this applicant" });
        }
        // Gỡ bỏ RECRUITMENT khỏi danh sách được chọn của APPLICANT
        applicant.selectedRecruitments.splice(index, 1);
        await applicant.save();
        res.status(200).json({ message: "Recruitment removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint để kiểm tra xem một APPLICANT có phải là talent pool của một RECRUITMENT hay không
router.get(`/check-recruitmentpool/:recruitmentId/:applicantId`, async (req, res) => {
    const { recruitmentId, applicantId } = req.params;
    try {
        // Kiểm tra xem APPLICANT có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Kiểm tra xem RECRUITMENT có tồn tại trong danh sách talent pools của APPLICANT không
        const isRecruitmentPool = applicant.selectedRecruitments.includes(recruitmentId);
        res.status(200).json({ isRecruitmentPool });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
