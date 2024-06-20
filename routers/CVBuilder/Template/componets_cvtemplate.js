import express from "express";
import Template from "../../Data/CVBuild/template.js";
const router = express.Router();
//experience
router.post("/experience", async (req, res) => {
    try {
        const { templateId } = req.body;

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Thêm mỗi kinh nghiệm vào mẫu
        experiences.forEach(experience => {
            const {
                title,
                company,
                description,
                startDate,
                endDate
            } = experience;
            const newExperience = {
                title,
                company,
                description,
                startDate,
                endDate
            };
            template.experience.push(newExperience);
        });
        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();
        return res.status(200).json({ message: "Add Experiences successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.put("/experience", async (req, res) => {
    try {
        const { templateId, experiences } = req.body;

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Duyệt qua mỗi kinh nghiệm để cập nhật
        experiences.forEach(experience => {
            const { expId, title, company, description, startDate, endDate } = experience;

            // Tìm kiếm kinh nghiệm trong mẫu
            const foundExperienceIndex = template.experience.findIndex(exp => exp._id === expId);
            if (foundExperienceIndex === -1) {
                return res.status(404).send(`Experience with ID ${expId} not found in the template`);
            }

            // Cập nhật thông tin kinh nghiệm
            const foundExperience = template.experience[foundExperienceIndex];
            foundExperience.title = title;
            foundExperience.company = company;
            foundExperience.description = description;
            foundExperience.startDate = startDate;
            foundExperience.endDate = endDate;
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();

        return res.status(200).json({ message: "Update Experiences successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/experience/:templateId", async (req, res) => {
    try {
        const { templateId } = req.params;
        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }
        // Trả về danh sách các kinh nghiệm của template
        return res.status(200).json({ experiences: template.experience });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//education
router.post("/education", async (req, res) => {
    try {
        const { templateId, educations } = req.body; // Lấy templateId và educations từ req.body

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Thêm mỗi học vấn vào mẫu
        educations.forEach(education => {
            const { title, school, description, startDate, endDate } = education;
            const newEducation = { title, school, description, startDate, endDate };
            template.education.push(newEducation);
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();
        return res.status(200).json({ message: "Add Education successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.put("/education", async (req, res) => {
    try {
        const { templateId, educations } = req.body; // Lấy templateId và educations từ req.body

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Duyệt qua mỗi học vấn để cập nhật
        educations.forEach(education => {
            const { eduId, title, school, description, startDate, endDate } = education;

            // Tìm kiếm học vấn trong mẫu
            const foundEducationIndex = template.education.findIndex(edu => edu._id === eduId);
            if (foundEducationIndex === -1) {
                return res.status(404).send(`Education with ID ${eduId} not found in the template`);
            }

            // Cập nhật thông tin học vấn
            const foundEducation = template.education[foundEducationIndex];
            foundEducation.title = title;
            foundEducation.school = school;
            foundEducation.description = description;
            foundEducation.startDate = startDate;
            foundEducation.endDate = endDate;
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();

        return res.status(200).json({ message: "Update Education successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/education/:templateId", async (req, res) => {
    try {
        const { templateId } = req.params;
        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }
        // Trả về danh sách các học vấn của template
        return res.status(200).json({ educations: template.education });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});


//project
router.post("/project", async (req, res) => {
    try {
        const { templateId, projects } = req.body; // Lấy templateId và projects từ req.body

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Thêm mỗi dự án vào mẫu
        projects.forEach(project => {
            const { title, position, description, customer, startDate, endDate } = project;
            const newProject = { title, position, description, customer, startDate, endDate };
            template.project.push(newProject);
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();
        return res.status(200).json({ message: "Add Projects successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.put("/project", async (req, res) => {
    try {
        const { templateId, projects } = req.body; // Lấy templateId và projects từ req.body

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Duyệt qua mỗi dự án để cập nhật
        projects.forEach(project => {
            const { projId, title, position, description, customer, startDate, endDate } = project;

            // Tìm kiếm dự án trong mẫu
            const foundProjectIndex = template.project.findIndex(proj => proj._id === projId);
            if (foundProjectIndex === -1) {
                return res.status(404).send(`Project with ID ${projId} not found in the template`);
            }

            // Cập nhật thông tin dự án
            const foundProject = template.project[foundProjectIndex];
            foundProject.title = title;
            foundProject.position = position;
            foundProject.description = description;
            foundProject.customer = customer;
            foundProject.startDate = startDate;
            foundProject.endDate = endDate;
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();

        return res.status(200).json({ message: "Update Projects successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/project/:templateId", async (req, res) => {
    try {
        const { templateId } = req.params;
        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }
        // Trả về danh sách các dự án của template
        return res.status(200).json({ projects: template.project });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//cert
router.post("/cert", async (req, res) => {
    try {
        const { templateId, certs } = req.body; // Lấy templateId và certs từ req.body

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Thêm mỗi chứng chỉ vào mẫu
        certs.forEach(cert => {
            const { title, organization, description, startDate, endDate } = cert;
            const newCert = { title, organization, description, startDate, endDate };
            template.cert.push(newCert);
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();
        return res.status(200).json({ message: "Add Certifications successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.put("/cert", async (req, res) => {
    try {
        const { templateId, certs } = req.body; // Lấy templateId và certs từ req.body

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Duyệt qua mỗi chứng chỉ để cập nhật
        certs.forEach(cert => {
            const { certId, title, organization, description, startDate, endDate } = cert;

            // Tìm kiếm chứng chỉ trong mẫu
            const foundCertIndex = template.cert.findIndex(cert => cert._id === certId);
            if (foundCertIndex === -1) {
                return res.status(404).send(`Certification with ID ${certId} not found in the template`);
            }

            // Cập nhật thông tin chứng chỉ
            const foundCert = template.cert[foundCertIndex];
            foundCert.title = title;
            foundCert.organization = organization;
            foundCert.description = description;
            foundCert.startDate = startDate;
            foundCert.endDate = endDate;
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();

        return res.status(200).json({ message: "Update Certifications successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/cert/:templateId", async (req, res) => {
    try {
        const { templateId } = req.params;
        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }
        // Trả về danh sách các chứng chỉ của template
        return res.status(200).json({ certs: template.cert });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//Skills

router.post("/skills", async (req, res) => {
    try {
        const { templateId, skills } = req.body; // Lấy templateId và skills từ req.body

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Thêm mỗi kỹ năng vào mẫu
        skills.forEach(skill => {
            const { nameofSkills, description } = skill;
            const newSkill = { nameofSkills, description };
            template.skills.push(newSkill);
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();
        return res.status(200).json({ message: "Add Skills successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.put("/skills", async (req, res) => {
    try {
        const { templateId, skills } = req.body; // Lấy templateId và skills từ req.body

        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }

        // Duyệt qua mỗi kỹ năng để cập nhật
        skills.forEach(skill => {
            const { skillId, nameofSkills, description } = skill;

            // Tìm kiếm kỹ năng trong mẫu
            const foundSkillIndex = template.skills.findIndex(skill => skill._id === skillId);
            if (foundSkillIndex === -1) {
                return res.status(404).send(`Skill with ID ${skillId} not found in the template`);
            }

            // Cập nhật thông tin kỹ năng
            const foundSkill = template.skills[foundSkillIndex];
            foundSkill.nameofSkills = nameofSkills;
            foundSkill.description = description;
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await template.save();

        return res.status(200).json({ message: "Update Skills successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/skills/:templateId", async (req, res) => {
    try {
        const { templateId } = req.params;
        // Kiểm tra xem Template có tồn tại không
        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }
        // Trả về danh sách các kỹ năng của template
        return res.status(200).json({ skills: template.skills });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

export default router;