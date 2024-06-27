import express from "express";
import User from "../../Data/user.js";

const router = express.Router();
// API endpoint để gán một APPLICANT cho một RECRUITER
router.post("/recruiters/select-talentpool", async (req, res) => {
    const { recruiterId, applicantId } = req.body;
    try {
        // Kiểm tra xem RECRUITER có tồn tại không
        const recruiter = await User.findById(recruiterId);
        if (!recruiter || recruiter.role !== "RECRUITER") {
            return res.status(404).json({ message: "Recruiter not found" });
        }
        // Kiểm tra xem RECRUITER đã chọn một APPLICANT trước đó chưa
        if (recruiter.selectedApplicants.includes(applicantId)) {
            return res.status(400).json({ message: "Recruiter has already selected this applicant" });
        }

        // Kiểm tra xem APPLICANT có tồn tại không
        const applicant = await User.findById(applicantId);
        if (!applicant || applicant.role !== "APPLICANT") {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Gán APPLICANT cho RECRUITER
        recruiter.selectedApplicants.push(applicantId);
        await recruiter.save();
        res.status(200).json({ message: "Applicant selected successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// API endpoint để lấy danh sách các APPLICANT của một RECRUITER
router.get("/recruiters/applicants/:recruiterId", async (req, res) => {
    const { recruiterId } = req.params;
    try {
        // Kiểm tra xem RECRUITER có tồn tại không
        const recruiter = await User.findById(recruiterId);
        if (!recruiter || recruiter.role !== "RECRUITER") {
            return res.status(404).json({ message: "Recruiter not found" });
        }
        // Lấy danh sách các APPLICANT đã được gán cho RECRUITER
        const applicants = await User.find({ _id: { $in: recruiter.selectedApplicants } })
            .select('fullName email avturl introduction.location introduction.yearofexperience introduction.specialization'); // Chỉ chọn các trường thông tin cần thiết
        res.status(200).json({ applicants });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// API endpoint để gỡ bỏ một APPLICANT khỏi danh sách được chọn của một RECRUITER
router.delete("/recruiters/remove-applicant", async (req, res) => {
    const { recruiterId, applicantId } = req.body;
    try {
        // Kiểm tra xem RECRUITER có tồn tại không
        const recruiter = await User.findById(recruiterId);
        if (!recruiter || recruiter.role !== "RECRUITER") {
            return res.status(404).json({ message: "Recruiter not found" });
        }
        // Kiểm tra xem APPLICANT có tồn tại trong danh sách được chọn của RECRUITER không
        const index = recruiter.selectedApplicants.indexOf(applicantId);
        if (index === -1) {
            return res.status(404).json({ message: "Applicant is not selected by this recruiter" });
        }
        // Gỡ bỏ APPLICANT khỏi danh sách được chọn của RECRUITER
        recruiter.selectedApplicants.splice(index, 1);
        await recruiter.save();
        res.status(200).json({ message: "Applicant removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint để kiểm tra xem một APPLICANT có phải là talent pool của một RECRUITER hay không
router.get(`/recruiters/check-talentpool/:recruiterId/:applicantId`, async (req, res) => {
    const { recruiterId, applicantId } = req.params;
    try {
        // Kiểm tra xem RECRUITER có tồn tại không
        const recruiter = await User.findById(recruiterId);
        if (!recruiter || recruiter.role !== "RECRUITER") {
            return res.status(404).json({ message: "Recruiter not found" });
        }
        // Kiểm tra xem APPLICANT có tồn tại trong danh sách talent pools của RECRUITER không
        const isTalentPool = recruiter.selectedApplicants.includes(applicantId);
        res.status(200).json({ isTalentPool });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
