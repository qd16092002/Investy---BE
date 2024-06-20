
import express from "express";
import User from "../../Data/user.js";
import Recruitment from "../../Data/REC/recruitment.js";
import mongoose from "mongoose";

const router = express.Router();

router.post('/addrecruitment', async (req, res) => {
    const {
        email,
        companyType,
        companyScale,
        businessArea,
        poster,
        avtcompany,
        RecruitmentTitle,
        Nameofthecompany,
        Logoofthecompany,
        CompanyIntroduction,
        Emailreceiving,
        Nameofthejobposition,
        Jobcategory,
        Specialization,
        Location,
        Salary,
        Workexperience,
        Jobdescription,
        Requirement,
        Remunerationpolicy,
        Language,
        RecruitmentDeadline,
    } = req.body;
    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'APPLICANT') {
            return res.status(403).json({ message: 'Applicant are not allowed to apply' });
        }
        const newRecruitment = new Recruitment({
            user: user._id,
            companyType,
            companyScale,
            businessArea,
            poster,
            avtcompany,
            RecruitmentTitle,
            Nameofthecompany,
            Logoofthecompany,
            CompanyIntroduction,
            Emailreceiving,
            Nameofthejobposition,
            Jobcategory,
            Specialization,
            Location,
            Salary,
            Workexperience,
            Jobdescription,
            Requirement,
            Remunerationpolicy,
            Language,
            RecruitmentDeadline
        });
        await newRecruitment.save();
        // Liên kết thành viên với người dùng
        user.recuitment = newRecruitment._id;
        await user.save();

        res.status(201).json(newRecruitment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/recruitment/:id', async (req, res) => {
    try {
        const recruitmentId = req.params.id;
        const recruitment = await Recruitment.findById(recruitmentId);

        if (!recruitment) {
            return res.status(404).json({ message: "Recruitment not found" });
        }

        const userId = recruitment.user;
        const userlist = await User.findById(userId).select('_id name introduction');

        if (!userlist) {
            return res.status(404).json({ message: "User not found" });
        }
        // Tính toán số ngày còn lại và thời gian đã đăng
        const deadline = new Date(recruitment.RecruitmentDeadline);
        const deadlineTimeLeft = getRemainingTimeMessage(deadline);
        const timePosted = getTimePosted(recruitment.dateupload);

        // Thêm các thông tin tính toán vào đối tượng recruitment
        const recruitmentWithExtraInfo = {
            ...recruitment.toJSON(),
            deadlineTimeLeft,
            timePosted
        };

        res.status(200).json({ recruitment: recruitmentWithExtraInfo, userlist });
    } catch (error) {
        console.error("Error retrieving recruitment or user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Hàm tính số ngày còn lại đến hạn chót
function getRemainingTimeMessage(deadline) {
    const currentDate = new Date();
    const timeDiff = deadline.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft > 0) {
        return `${daysLeft} days left`;
    } else if (daysLeft === 0) {
        return "Today";
    } else {
        return `Overdue by ${Math.abs(daysLeft)} days`;
    }
}
function getTimePosted(timestamp) {
    const currentTime = new Date();
    const postedTime = new Date(timestamp);
    const timeDiff = currentTime.getTime() - postedTime.getTime();

    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (daysDiff > 3) {
        return `Posted on ${postedTime.toLocaleDateString()}`;
    } else if (daysDiff > 0) {
        return `Posted ${daysDiff} days ago`;
    } else if (hoursDiff > 0) {
        return `Posted ${hoursDiff} hours ago`;
    } else {
        return `Posted ${minutesDiff} minutes ago`;
    }
}


// API lấy tất cả các thông tin tuyển dụng
router.get('/getallrecruitment', async (req, res) => {
    try {
        const { query } = req;
        let recruitment = await Recruitment.find(query).sort({ date: -1 });

        const recruitmentWithCount = await Promise.all(recruitment.map(async entry => {
            const count = entry.appliedUsers.length;
            const entryWithCount = { ...entry.toJSON(), applyUsersCount: count };

            // Lấy ngày hạn cuối
            const deadline = new Date(entry.RecruitmentDeadline);

            // Tạo thông điệp dựa trên số ngày còn lại
            const timeMessage = getRemainingTimeMessage(deadline);
            entryWithCount.deadlineTimeLeft = timeMessage;

            // Tính thời gian đã đăng
            const timePosted = getTimePosted(entry.dateupload);
            entryWithCount.timePosted = timePosted;

            return entryWithCount;
        }));

        res.status(200).send(recruitmentWithCount);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// API tìm kiếm thông tin tuyển dụng
router.get('/getallrecruitmentsearch', async (req, res) => {
    try {
        const { keyword, Location, CompanyIntroduction, Jobcategory, Specialization, Salary, Workexperience } = req.query;
        const prioritizedIds = [
            new mongoose.Types.ObjectId('665fec3f9a9641b7af3c6fb0'),
            new mongoose.Types.ObjectId('665fe6b49a9641b7af3c6f89'),
            new mongoose.Types.ObjectId('665fdea49a9641b7af3c6f18')
        ];

        let query = {};

        if (keyword) {
            query['$or'] = [
                { 'RecruitmentTitle': { $regex: new RegExp(keyword, 'i') } },
                { 'Nameofthecompany': { $regex: new RegExp(keyword, 'i') } },
                { 'CompanyIntroduction': { $regex: new RegExp(keyword, 'i') } },
                { 'Nameofthejobposition': { $regex: new RegExp(keyword, 'i') } },
                { 'Jobcategory': { $regex: new RegExp(keyword, 'i') } },
                { 'Specialization': { $regex: new RegExp(keyword, 'i') } },
                { 'Location': { $regex: new RegExp(keyword, 'i') } },
                { 'Salary': { $regex: new RegExp(keyword, 'i') } },
                { 'Workexperience': { $regex: new RegExp(keyword, 'i') } },
                { 'Jobdescription': { $regex: new RegExp(keyword, 'i') } },
                { 'Requirement': { $regex: new RegExp(keyword, 'i') } },
                { 'Remunerationpolicy': { $regex: new RegExp(keyword, 'i') } },
            ];
        }
        if (Location) {
            query['Location'] = { $regex: new RegExp(Location, 'i') };
        }
        if (CompanyIntroduction) {
            query['CompanyIntroduction'] = { $regex: new RegExp(CompanyIntroduction, 'i') };
        }
        if (Jobcategory) {
            query['Jobcategory'] = { $regex: new RegExp(Jobcategory, 'i') };
        }
        if (Specialization) {
            query['Specialization'] = { $regex: new RegExp(Specialization, 'i') };
        }
        if (Salary) {
            query['Salary'] = { $regex: new RegExp(Salary, 'i') };
        }
        if (Workexperience) {
            query['Workexperience'] = { $regex: new RegExp(Workexperience, 'i') };
        }

        let recruitment = await Recruitment.find({
            $or: [
                { _id: { $in: prioritizedIds } },
                { _id: { $nin: prioritizedIds } }
            ],
            ...query
        }).sort({ dateupload: -1 });

        const recruitmentWithCount = await Promise.all(recruitment.map(async entry => {
            const count = entry.appliedUsers.length;
            const entryWithCount = { ...entry.toJSON(), applyUsersCount: count };

            // Lấy ngày hạn cuối
            const deadline = new Date(entry.RecruitmentDeadline);

            // Tạo thông điệp dựa trên số ngày còn lại
            const timeMessage = getRemainingTimeMessage(deadline);
            entryWithCount.deadlineTimeLeft = timeMessage;

            // Tính thời gian đã đăng
            const timePosted = getTimePosted(entry.dateupload);
            entryWithCount.timePosted = timePosted;

            return entryWithCount;
        }));

        res.status(200).send(recruitmentWithCount);
    } catch (error) {
        res.status(500).send(`Server error: ${error.message}`);
    }
});

router.delete("/recruitment/:id", async (req, res) => {
    try {
        const recruitmentId = req.params.id;
        const deletedRecuirment = await Recruitment.findByIdAndDelete(recruitmentId);
        if (!deletedRecuirment) {
            return res.status(404).json({ message: "Recruitment not found" });
        }
        res.status(200).json({ message: "Recruitment deleted successfully" });
    } catch (error) {
        console.error("Error deleting :", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;