import User from "../../Data/user.js";
import express from "express";
import authenticateToken from "../../componets/authenticateToken.js";
const router = express.Router();
//workingexperience
router.post("/workingexperience", async (req, res) => {
    try {
        // const userId = req.user._id; // Lấy userId từ token hoặc session đã được xác thực
        const { userId, avtworking, company, position, startingtimemonth, startingtimeyear, finishingtimemonth, finishingtimeyear, description } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("Người dùng không tồn tại");
        }

        // Thêm kinh nghiệm làm việc mới
        const newExperience = {
            company,
            avtworking,
            position,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            description
        };
        user.workingexperience.push(newExperience);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Thêm kinh nghiệm làm việc thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.delete("/workingexperience", async (req, res) => {
    try {
        const { email, expId } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("Người dùng không tồn tại");
        }

        // Tìm kiếm kinh nghiệm làm việc dựa trên _id
        const experienceIndex = user.workingexperience.findIndex(exp => exp._id.toString() === expId);
        if (experienceIndex === -1) {
            return res.status(404).send("Kinh nghiệm làm việc không tồn tại");
        }

        // Xóa kinh nghiệm làm việc khỏi mảng
        user.workingexperience.splice(experienceIndex, 1);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Xóa kinh nghiệm làm việc thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.put("/workingexperience", async (req, res) => {
    try {
        const { userId, expId } = req.body;
        //const userId = req.user._id;
        // Lấy userId từ token hoặc session đã được xác thực
        const { avtworking, company, position, startingtimemonth, startingtimeyear, finishingtimemonth, finishingtimeyear, description } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("Người dùng không tồn tại");
        }

        // Tìm kiếm và cập nhật kinh nghiệm làm việc
        const Workingexperience = user.workingexperience.id(expId);
        if (!Workingexperience) {
            return res.status(404).send("Kinh nghiệm làm việc không tồn tại");
        }

        // Cập nhật thông tin kinh nghiệm làm việc

        Workingexperience.avtworking = avtworking || Workingexperience.avtworking;
        Workingexperience.company = company || Workingexperience.company;
        Workingexperience.position = position || Workingexperience.position;
        Workingexperience.startingtimemonth = startingtimemonth || Workingexperience.startingtimemonth;
        Workingexperience.startingtimeyear = startingtimeyear || Workingexperience.startingtimeyear;
        Workingexperience.finishingtimemonth = finishingtimemonth || Workingexperience.finishingtimemonth;
        Workingexperience.finishingtimeyear = finishingtimeyear || Workingexperience.finishingtimeyear;
        Workingexperience.description = description || Workingexperience.description;

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Chỉnh sửa kinh nghiệm làm việc thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.get("/workingexperience/:expId", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const expId = req.params.expId;
        const user = await User.findOne({ email });;

        if (!user) {
            return res.status(404).send("Người dùng không tồn tại");
        }

        const experience = user.workingexperience.id(expId);
        if (!experience) {
            return res.status(404).send("Kinh nghiệm làm việc không tồn tại");
        }

        return res.status(200).json(experience);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
//education
router.post("/education", async (req, res) => {
    try {
        // const userId = req.user._id; // Lấy userId từ token hoặc session đã được xác thực
        const {
            userId,
            university,
            major,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            avteducation,
            level,
            description, } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Thêm kinh nghiệm làm việc mới
        const newEducation = {
            avteducation,
            university,
            major,
            level,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            description,
        };
        user.education.push(newEducation);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Add Education successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.delete("/education", async (req, res) => {
    try {
        const { email, eduId } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Tìm kiếm kinh nghiệm làm việc dựa trên _id
        const educationIndex = user.education.findIndex(exp => exp._id.toString() === eduId);
        if (educationIndex === -1) {
            return res.status(404).send("Education not found");
        }

        // Xóa kinh nghiệm làm việc khỏi mảng
        user.education.splice(educationIndex, 1);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Delete Education sucessful!!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.put("/education", async (req, res) => {
    try {
        const {
            userId,
            eduId,
            university,
            avteducation,
            major,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            description,
            level } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const Education = user.education.id(eduId);
        if (!Education) {
            return res.status(404).send("Education not found");
        }
        Education.level = level || Education.level;
        Education.avteducation = avteducation || Education.avteducation;
        Education.university = university || Education.university;
        Education.major = major || Education.major;
        Education.startingtimemonth = startingtimemonth || Education.startingtimemonth;
        Education.startingtimeyear = startingtimeyear || Education.startingtimeyear;
        Education.finishingtimemonth = finishingtimemonth || Education.finishingtimemonth;
        Education.finishingtimeyear = finishingtimeyear || Education.finishingtimeyear;
        Education.description = description || Education.description;
        await user.save();
        return res.status(200).json({ message: "Edit Education sucessful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.get("/education/:eduId", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const eduId = req.params.eduId;
        const user = await User.findOne({ email });;

        if (!user) {
            return res.status(404).send("User not found");
        }

        const Education = user.education.id(eduId);
        if (!Education) {
            return res.status(404).send("Education not found");
        }

        return res.status(200).json(Education);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
//extracurricular
router.post("/extracurricular", async (req, res) => {
    try {
        const {
            userId,
            organization,
            position,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            description,
        } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const newextracurricular = {
            organization,
            position,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            description,
        }
        user.extracurricular.push(newextracurricular);
        await user.save();
        return res.status(200).json({ message: "Add extracurricular successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.delete("/extracurricular", async (req, res) => {
    try {
        const { email, extId } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Tìm kiếm kinh nghiệm làm việc dựa trên _id
        const extracurricularIndex = user.extracurricular.findIndex(exp => exp._id.toString() === extId);
        if (extracurricularIndex === -1) {
            return res.status(404).send("extracurricular not found");
        }

        // Xóa kinh nghiệm làm việc khỏi mảng
        user.extracurricular.splice(extracurricularIndex, 1);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Delete extracurricular sucessful!!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.put("/extracurricular", async (req, res) => {
    try {
        const { userId, extId } = req.body;
        const {
            organization,
            position,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            description,
        } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const Extracurricular = user.extracurricular.id(extId);
        if (!Extracurricular) {
            return res.status(404).send("extracurricular not found");
        }
        Extracurricular.organization = organization || Extracurricular.organization;
        Extracurricular.position = position || Extracurricular.position;
        Extracurricular.startingtimemonth = startingtimemonth || Extracurricular.startingtimemonth;
        Extracurricular.startingtimeyear = startingtimeyear || Extracurricular.startingtimeyear;
        Extracurricular.finishingtimemonth = finishingtimemonth || Extracurricular.finishingtimemonth;
        Extracurricular.finishingtimeyear = finishingtimeyear || Extracurricular.finishingtimeyear;
        Extracurricular.description = description || Extracurricular.description;
        await user.save();
        return res.status(200).json({ message: "Edit extracurricular sucessful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.get("/extracurricular/:extId", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const extId = req.params.extId;
        const user = await User.findOne({ email });;
        if (!user) {
            return res.status(404).send("User not found");
        }
        const Extracurricular = user.extracurricular.id(extId);
        if (!Extracurricular) {
            return res.status(404).send("Education not found");
        }
        return res.status(200).json(Extracurricular);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
//certificate
router.post("/certificate", async (req, res) => {
    try {
        // const userId = req.user._id; // Lấy userId từ token hoặc session đã được xác thực
        const {
            userId,
            organization,
            certificate,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            file,
        } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const newcertificate = {
            organization,
            certificate,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            file,
        };
        user.certificate.push(newcertificate);

        await user.save();

        return res.status(200).json({ message: "Add certificate successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.delete("/certificate", async (req, res) => {
    try {
        const { email, cerId } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Tìm kiếm kinh nghiệm làm việc dựa trên _id
        const certificateIndex = user.certificate.findIndex(exp => exp._id.toString() === cerId);
        if (certificateIndex === -1) {
            return res.status(404).send("certificate not found");
        }

        // Xóa kinh nghiệm làm việc khỏi mảng
        user.certificate.splice(certificateIndex, 1);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Delete certificate sucessful!!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.put("/certificate", async (req, res) => {
    try {
        const { userId, cerId } = req.body;
        const {
            organization,
            certificate,
            startingtimemonth,
            startingtimeyear,
            finishingtimemonth,
            finishingtimeyear,
            file,
        } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const Certificate = user.certificate.id(cerId);
        if (!Certificate) {
            return res.status(404).send("certificate not found");
        }
        Certificate.organization = organization || Certificate.organization;
        Certificate.certificate = certificate || Certificate.certificate;
        Certificate.startingtimemonth = startingtimemonth || Certificate.startingtimemonth;
        Certificate.startingtimeyear = startingtimeyear || Certificate.startingtimeyear;
        Certificate.finishingtimemonth = finishingtimemonth || Certificate.finishingtimemonth;
        Certificate.finishingtimeyear = finishingtimeyear || Certificate.finishingtimeyear;
        Certificate.file = file || Certificate.file;
        await user.save();
        return res.status(200).json({ message: "Edit certificate sucessful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.get("/certificate/:cerId", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const cerId = req.params.cerId;
        const user = await User.findOne({ email });;
        if (!user) {
            return res.status(404).send("User not found");
        }
        const certificate = user.certificate.id(cerId);
        if (!certificate) {
            return res.status(404).send("Certificate not found");
        }
        return res.status(200).json(certificate);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
//Skills
router.post("/skills", async (req, res) => {
    try {
        // const userId = req.user._id; // Lấy userId từ token hoặc session đã được xác thực
        const {
            userId,
            name,
            organization,
            evaluation,
            description,
        } = req.body;
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const newskills = {
            name,
            organization,
            evaluation,
            description,
        };
        user.skills.push(newskills);

        await user.save();

        return res.status(200).json({ message: "Add Skill successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.delete("/skills", async (req, res) => {
    try {
        const { email, skillId } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Tìm kiếm kinh nghiệm làm việc dựa trên _id
        const skillsIndex = user.skills.findIndex(exp => exp._id.toString() === skillId);
        if (skillsIndex === -1) {
            return res.status(404).send("skills not found");
        }

        // Xóa kinh nghiệm làm việc khỏi mảng
        user.skills.splice(skillsIndex, 1);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Delete Skill sucessful!!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.put("/skills", async (req, res) => {
    try {
        const { userId, skillId } = req.body;
        const {
            name,
            organization,
            evaluation,
            description,
        } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const Skills = user.skills.id(skillId);
        if (!Skills) {
            return res.status(404).send("skills not found");
        }
        Skills.name = name || Skills.name;
        Skills.organization = organization || Skills.organization;
        Skills.evaluation = evaluation || Skills.evaluation;
        Skills.description = description || Skills.description;
        await user.save();
        return res.status(200).json({ message: "Edit Skills sucessful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.get("/skills/:skillId", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const skillId = req.params.skillId;
        const user = await User.findOne({ email });;
        if (!user) {
            return res.status(404).send("User not found");
        }
        const Skill = user.skills.id(skillId);
        if (!Skill) {
            return res.status(404).send("Skills not found");
        }
        return res.status(200).json(Skill);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
//Language
router.post("/language", async (req, res) => {
    try {
        // const userId = req.user._id; // Lấy userId từ token hoặc session đã được xác thực
        const {
            userId,
            language,
            detail,
        } = req.body;
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const newlanguage = {
            language,
            detail,
        };
        user.language.push(newlanguage);

        await user.save();

        return res.status(200).json({ message: "Add Language successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.delete("/language", async (req, res) => {
    try {
        const { email, languageId } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Tìm kiếm kinh nghiệm làm việc dựa trên _id
        const languageIndex = user.language.findIndex(exp => exp._id.toString() === languageId);
        if (languageIndex === -1) {
            return res.status(404).send("Language not found");
        }

        // Xóa kinh nghiệm làm việc khỏi mảng
        user.language.splice(languageIndex, 1);

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        return res.status(200).json({ message: "Delete Language sucessful!!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.put("/language", async (req, res) => {
    try {
        const { userId, languageId } = req.body;
        const {
            language,
            detail,
        } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const Language = user.language.id(languageId);
        if (!Language) {
            return res.status(404).send("skills not found");
        }
        Language.language = language || Language.language;
        Language.detail = detail || Language.detail;
        await user.save();
        return res.status(200).json({ message: "Edit Language sucessful!" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
router.get("/language/:languageId", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const languageId = req.params.languageId;
        const user = await User.findOne({ email });;
        if (!user) {
            return res.status(404).send("User not found");
        }
        const Language = user.language.id(languageId);
        if (!Language) {
            return res.status(404).send("Language not found");
        }
        return res.status(200).json(Language);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});
export default router;