import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import User from "../../Data/user.js";
import CVBuilder from "../../CVBuilder/Default/cvbuilder.js";
import authenticateToken from "../../componets/authenticateToken.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

const router = express.Router();
router.use(express.json());
// Đăng ký tài khoản
router.post("/user/signup", async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      role,
      videointroduction,
      avturl,
      phoneNumber,
      companyName,
      position,
      location,
      introduction,
      ourstory,
      benefits,
      ourteam,
      introdect,
      education,
      workingexperience,
      skills,
      certificate,
      extracurricular,
      language,
      cvuser,
      securityCode
    } = req.body;

    // Kiểm tra email đã được sử dụng chưa
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("Email is already in use");
    }

    // Kiểm tra mã bảo mật khi vai trò là ADMIN
    if (role === "ADMIN" && securityCode !== "quangdao1609") {
      return res.status(403).send("Security code is incorrect");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Tạo tài khoản mới
    const newUser = new User({
      email,
      password: hash,
      role,
      fullName,
      introduction,
      videointroduction,
      avturl,
      ...(role === "RECRUITER" && {
        phoneNumber,
        companyName,
        ourstory,
        benefits,
        ourteam,
        introdect,
        position,
        location
      }),
      ...(role === "APPLICANT" && {
        education,
        workingexperience,
        skills,
        certificate,
        extracurricular,
        language,
        cvuser
      })
    });

    // Lưu vào cơ sở dữ liệu
    const insert = await newUser.save();

    // Trả về token cho client
    const token = jwt.sign({ email, role }, "mysecretkey");
    return res.json({
      message: "User registered successfully",
      userId: insert._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
});
// Đăng nhập
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Sorry, the email or password you provided is incorrect.");
    }

    // Kiểm tra trạng thái khóa
    if (user.isLocked) {
      return res.status(403).send("Your account has been locked, please contact gmail support@investy.io.vn to be unlocked");
    }

    // Kiểm tra mật khẩu
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Sorry, the email or password you provided is incorrect.");
    }

    // Trả về token cho client
    const token = jwt.sign({ email, role: user.role }, "mysecretkey");
    res.send({ accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
});

// API xuất lại mật khẩu (KHÔNG AN TOÀN)
router.post('/user/export-password', async (req, res) => {
  try {
    const { email, adminPassword } = req.body;

    // Kiểm tra mật khẩu admin
    const adminUser = await User.findOne({ email: 'admin1@gmail.com' }); // Email của admin
    if (!adminUser || !(await bcrypt.compare(adminPassword, adminUser.password))) {
      return res.status(403).send('Admin password is incorrect');
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Trả về mật khẩu đã lưu dưới dạng văn bản thuần (plaintext)
    res.json({
      email: user.email,
      password: user.plaintextPassword // Thuộc tính mật khẩu gốc
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
//Login by Auth
router.post("/user/logingoogle", async (req, res) => {
  try {
    const {
      email,
      fullName,
      avturl,
    } = req.body;
    const user = await User.findOne({ email }).exec();
    if (user) {
      const token = jwt.sign({ email }, "mysecretkey");
      return res.json({
        message: "User registered successfully",
        userId: user._id,
        accessToken: token
      });
      // tra ve
    } else {
      const newUser = new User({
        email,
        role: "APPLICANT",
        fullName,
        avturl,
        password: '12345678'
      });
      // Lưu vào cơ sở dữ liệu
      const insert = await newUser.save();
      // Trả về token cho client
      const token = jwt.sign({ email }, "mysecretkey");
      return res.json({
        message: "User registered successfully",
        userId: insert._id,
        accessToken: token
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
})
router.get("/getalluser", async (req, res) => {
  try {
    const {
      keyword,
      category,
      Location,
      role,
      Specialization,
      PositionLevel,
      Experience,
      Language,
      Educationallevel,
      University,
    } = req.query;
    let query = {};
    if (keyword) {
      query['$or'] = [
        { 'fullName': { $regex: new RegExp(keyword, 'i') } },
        { 'phoneNumber': { $regex: new RegExp(keyword, 'i') } },
        { 'companyName': { $regex: new RegExp(keyword, 'i') } },
        { 'position': { $regex: new RegExp(keyword, 'i') } },
        { 'location': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.description': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.area': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.adsress': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.yearofexperience': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.location': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.level': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.specialization': { $regex: new RegExp(keyword, 'i') } },
        { 'education.university': { $regex: new RegExp(keyword, 'i') } },
        { 'education.major': { $regex: new RegExp(keyword, 'i') } },
        { 'education.description': { $regex: new RegExp(keyword, 'i') } },
        { 'education.level': { $regex: new RegExp(keyword, 'i') } },
        { 'education.university': { $regex: new RegExp(keyword, 'i') } },
        { 'workingexperience.company': { $regex: new RegExp(keyword, 'i') } },
        { 'workingexperience.position': { $regex: new RegExp(keyword, 'i') } },
        { 'workingexperience.description': { $regex: new RegExp(keyword, 'i') } },
        { 'skills.name': { $regex: new RegExp(keyword, 'i') } },
        { 'skills.organization': { $regex: new RegExp(keyword, 'i') } },
        { 'skills.description': { $regex: new RegExp(keyword, 'i') } },
        { 'certificate.certificate': { $regex: new RegExp(keyword, 'i') } },
        { 'certificate.organization': { $regex: new RegExp(keyword, 'i') } },
        { 'extracurricular.organization': { $regex: new RegExp(keyword, 'i') } },
        { 'extracurricular.position': { $regex: new RegExp(keyword, 'i') } },
        { 'extracurricular.description': { $regex: new RegExp(keyword, 'i') } },
        { 'language.language1': { $regex: new RegExp(keyword, 'i') } },
        { 'language.language2': { $regex: new RegExp(keyword, 'i') } },
        { 'language.language3': { $regex: new RegExp(keyword, 'i') } },
        { 'language.language4': { $regex: new RegExp(keyword, 'i') } },
        { 'language.language5': { $regex: new RegExp(keyword, 'i') } },
      ];
    }
    if (category) {
      query['$or'] = [
        // { 'introduction?.[0]?.area': category },
        { 'introduction.area': { $regex: new RegExp(category, 'i') } },
      ];
    }
    if (role) {
      query['$or'] = [
        { 'role': role },
      ];
    }

    if (Location) {
      query['$or'] = [
        { 'introduction.adsress': Location },
        { 'location': Location },
      ];
    }
    if (Specialization) {
      query['$or'] = [
        { 'introduction.specialization': Specialization },
      ];
    }
    if (PositionLevel) {
      query['$or'] = [
        { 'introduction.level': PositionLevel },
      ];
    }
    if (Experience) {
      query['$or'] = [
        { 'introduction.yearofexperience': Experience },
      ];
    }
    if (Language) {
      query['$or'] = [
        { 'language.language1': Language },
        { 'language.language2': Language },
        { 'language.language3': Language },
        { 'language.language4': Language },
        { 'language.language5': Language },
      ];
    }
    if (Educationallevel) {
      query['$or'] = [
        { 'education.level': Educationallevel },
      ];
    }
    if (University) {
      query['$or'] = [
        { 'education.university': University },
      ];
    }
    const user = await User.find(query);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Lỗi server");
  }
});
router.get('/getcompanysearch', async (req, res) => {
  try {
    const { keyword, category, Location, worlscale } = req.query;
    let query = { role: 'RECRUITER' };
    if (keyword) {
      query['$or'] = [
        { 'fullName': { $regex: new RegExp(keyword, 'i') } },
        { 'phoneNumber': { $regex: new RegExp(keyword, 'i') } },
        { 'companyName': { $regex: new RegExp(keyword, 'i') } },
        { 'position': { $regex: new RegExp(keyword, 'i') } },
        { 'location': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.description': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.area': { $regex: new RegExp(keyword, 'i') } },
        { 'introduction.address': { $regex: new RegExp(keyword, 'i') } },
      ];
    }
    if (category) {
      query['$or'] = [
        { 'introduction.area': category },
      ];
    }
    if (worlscale) {
      query['$or'] = [
        { 'introduction.employees': worlscale },
      ];
    }
    if (Location) {
      query['$or'] = [
        { 'introduction.address': Location },
        { 'location': Location },
      ];
    }

    const users = await User.find(query);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});
router.get('/getallcompanydashboard', async (req, res) => {
  try {
    let query = { role: 'RECRUITER' };

    const companies = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'recruitments', // Tên collection trong MongoDB (có thể là 'recruitments' tùy theo cấu hình của bạn)
          localField: '_id',
          foreignField: 'user', // Trường tham chiếu từ recruitmentSchema đến user
          as: 'recruitments'
        }
      },
      {
        $project: {
          name: '$companyName',
          avturl: 1,
          recruitmentCount: { $size: '$recruitments' }
        }
      },
      {
        $sort: { recruitmentCount: -1 } // Sắp xếp theo số lượng tuyển dụng giảm dần
      },
      {
        $limit: 12 // Giới hạn kết quả trả về chỉ 12 mục đầu tiên
      }
    ]);

    res.status(200).send(companies);
  } catch (error) {
    console.error(error);  // Log lỗi để dễ dàng debug
    res.status(500).send('Server Error');
  }
});

// GetUser By Id
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// CRUD: Lấy thông tin người dùng
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user; // Lấy thông tin người dùng từ xác thực
    const user = await User.find({ email });

    // Trả về thông tin người dùng
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// CRUD: Cập nhật thông tin người dùng
router.put("/user", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOneAndUpdate({ email }, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// router.delete("/user/:userId", async (req, res) => {
//   try {
//     const recruitmentId = req.params.id;
//     const deletedRecuirment = await User.findByIdAndDelete(recruitmentId);
//     if (!deletedRecuirment) {
//       return res.status(404).json({ message: "Recruitment not found" });
//     }
//     res.status(200).json({ message: "Recruitment deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting :", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
// Delete account
router.delete("/admin/deleteuser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// router.put("/user/:userId/lock", checkRole(["SUPPER_ADMIN", "ADMIN"]), async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const { action } = req.body;
//     if (!['lock', 'unlock'].includes(action)) {
//       return res.status(400).json({ message: "Invalid action. Use 'lock' or 'unlock'." });
//     }
//     const isLocked = action === 'lock';
//     const updatedUser = await User.findByIdAndUpdate(userId, { isLocked }, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: `User ${action}ed successfully`, user: updatedUser });
//   } catch (error) {
//     console.error(`Error ${action}ing user:`, error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
router.put("/user/lock", async (req, res) => {
  try {
    const { action, userId } = req.body;
    if (!['lock', 'unlock'].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Use 'lock' or 'unlock'." });
    }
    const isLocked = action === 'lock';
    const updatedUser = await User.findByIdAndUpdate(userId, { isLocked }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User ${action}ed successfully`, user: updatedUser });
  } catch (error) {
    console.error(`Error ${action}ing user:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const saltRounds = 10;
router.post("/changepassword", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  // Tìm người dùng trong cơ sở dữ liệu
  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // So sánh mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});
router.post("/forgotpassword", async (req, res) => {
  const { email, newPassword } = req.body;

  // Tìm người dùng trong cơ sở dữ liệu
  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});



export default router;
