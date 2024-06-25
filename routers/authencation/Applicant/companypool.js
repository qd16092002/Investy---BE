import express from "express";
import User from "../../Data/user.js";

const router = express.Router();
// API endpoint để gán một APPLICANT cho một RECRUITER
router.post("/select-companypool", async (req, res) => {
    const { recruiterId, applicantId } = req.body;
    try {
        // Kiểm tra xem APPLICANT có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Kiểm tra xem RECRUITER có tồn tại không
        const recruiter = await User.findById(recruiterId);
        if (!recruiter || recruiter.role !== "RECRUITER") {
            return res.status(404).json({ message: "Company not found" });
        }
        // Kiểm tra xem APPLICANT đã chọn một RECRUITER trước đó chưa
        if (applicant.selectedRecruiters.includes(recruiterId)) {
            return res.status(400).json({ message: "Applicant has already selected this Company" });
        }
        // Gán RECRUITER cho APPLICANT
        applicant.selectedRecruiters.push(recruiterId);
        await applicant.save();
        res.status(200).json({ message: "Company selected successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// API endpoint để lấy danh sách các Company của một APPLICANT
router.get("/recruitments/:applicantId", async (req, res) => {
    const { applicantId } = req.params;
    try {
        // Kiểm tra xem APPLICANT có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Lấy danh sách các RECRUITER đã được gán cho APPLICANT
        const recruiters = await User.find({ _id: { $in: applicant.selectedRecruiters } })
            .select('companyName email avturl videointroduction introduction')
        res.status(200).json({ recruiters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// API endpoint để gỡ bỏ một RECRUITER khỏi danh sách được chọn của một APPLICANT
router.delete("/remove-company", async (req, res) => {
    const { recruiterId, applicantId } = req.body;
    try {
        // Kiểm tra xem APPLICANT có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Kiểm tra xem RECRUITER có tồn tại trong danh sách được chọn của APPLICANT không
        const index = applicant.selectedRecruiters.indexOf(recruiterId);
        if (index === -1) {
            return res.status(404).json({ message: "Company is not selected by this recruiter" });
        }
        // Gỡ bỏ APPLICANT khỏi danh sách được chọn của RECRUITER
        applicant.selectedRecruiters.splice(index, 1);
        await applicant.save();
        res.status(200).json({ message: "Company removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint để kiểm tra xem một APPLICANT có phải là talent pool của một RECRUITER hay không
router.get(`/check-companypool/:recruiterId/:applicantId`, async (req, res) => {
    const { recruiterId, applicantId } = req.params;
    try {
        // Kiểm tra xem RECRUITER có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Kiểm tra xem APPLICANT có tồn tại trong danh sách talent pools của RECRUITER không
        const iscompanypool = applicant.selectedRecruiters.includes(recruiterId);
        res.status(200).json({ iscompanypool });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
