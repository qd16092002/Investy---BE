import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

const router = express.Router();

router.use(express.json());
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [ "ADMIN", "INVESTOR", "STARTUP"],
    default: "INVESTOR",
    required: true,
  },
  currentJob: {
    type: String,
    enum: ["CTO", "CEO", "CMO"],
    default: "CEO",
  },
  businessType: {
    type: String,
    enum: ["B2B", "B2C", "B2B2C","B2G","C2C"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  dateOfBirth: {
    type: String,
    default: null,
  },
  urlWeb: {
    type: String,
    default: null,
  },
  title: {
    type: String,
  },
  gender: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  urlLinkedin: {
    type: String,
  },
  companystage: {
    type: String,
    default: null,
  },
  producttype: {
    type: String,
    default: null,
  },
  annualrevenue: {
    type: String,
    default: null,
  },
  mrr: {
    type: String,
    default: null,
  },
  mployeescount: {
    type: String,
    default: null,
  },
  urlFacebook: {
    type: String,
  },
  urlTwitter: {
    type: String,
  },
  interestedField: {
    type: String,
  },
  involvedProjects: {
    type: String,
  },
  companyName: {
    type: String,
  },
  team: { type: Schema.Types.ObjectId, ref: 'TeamMember' },
  address: {
    type: String,
  },
  weburl: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);
const teamMemberSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  avatar: String,
  fullNameUserTeam: String,
  position: String,
  bio: String,
  facebookUrl: String,
  linkedinUrl: String,
  twitterUrl: String,
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

// Đăng ký tài khoản
router.post("/user/signup", async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      role,
      phoneNumber,
      curentJob,
      dateOfBirth,
      interestedField,
      involvedProjects,
      linkedlnLink,
      companyName
    } = req.body;

    // Kiểm tra username đã được sử dụng chưa
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).send("username đã được sử dụng");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Tạo tài khoản mới
    const newUser = new User({
      username,
      password: hash,
      email,
      role,
      phoneNumber,
      dateOfBirth,
      curentJob,
      interestedField,
      involvedProjects,
      linkedlnLink,
      companyName
    });

    // Lưu vào cơ sở dữ liệu
    const insert = await newUser.save();

    // Trả về token cho client
    const token = jwt.sign({ username }, "mysecretkey");
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
    const { username, password } = req.body;

    // Kiểm tra username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("username hoặc mật khẩu không đúng");
    }

    // Kiểm tra mật khẩu
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("username hoặc mật khẩu không đúng");
    }

    // Trả về token cho client
    const token = jwt.sign({ username }, "mysecretkey");
    // console.log(token);
    res.send({ accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
});

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], "mysecretkey", (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Lưu thông tin người dùng trong đối tượng req
    req.user = decoded;
    next();
  });
};

router.get("/getalluser", async (req, res) => {
  try {
    const { query } = req;
    const user = await User.find(query);
    res.status(200).send(user);
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Lỗi server");
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
    const { username } = req.user; // Lấy thông tin người dùng từ xác thực
    // console.log(username);
    const user = await User.find({ username });

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
    const { username } = req.user;
    const user = await User.findOneAndUpdate({ username }, req.body, {
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

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/change-password", authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Tìm người dùng trong cơ sở dữ liệu
  User.findOne({ username: req.user.username }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // So sánh mật khẩu hiện tại
    bcrypt.compare(currentPassword, user.password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!result) {
        return res.status(401).json({ error: "Invalid current password" });
      }

      // Mã hóa mật khẩu mới
      bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Cập nhật mật khẩu mới
        user.password = hashedPassword;
        user.save((err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          res.status(200).json({ message: "Password changed successfully" });
        });
      });
    });
  });
});

router.post('/addTeamMemberByUsername', async (req, res) => {
  const { username, avatar, fullNameUserTeam, position, bio, facebookUrl, linkedinUrl, twitterUrl } = req.body;

  try {
    // Tìm người dùng theo username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tạo thành viên của đội
    const newTeamMember = new TeamMember({
      user: user._id,
      avatar,
      fullNameUserTeam,
      position,
      bio,
      facebookUrl,
      linkedinUrl,
      twitterUrl,
    });

    await newTeamMember.save();

    // Liên kết thành viên với người dùng
    user.team = newTeamMember._id;
    await user.save();

    res.status(201).json({ message: 'Team member added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/teamMembers/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm người dùng
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tìm toàn bộ thành viên của đội của người dùng
    const teamMembers = await TeamMember.find({ user: user._id });

    res.status(200).json({ teamMembers });
  } catch (error) {
    console.error('Error getting team members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/user/roles', async (req, res) => {
  try {
    const rolesData = await User.aggregate([
      {
        $unwind: '$role',
      },
      {
        $match: {
          role: { $in: ['INVESTOR', 'STARTUP'] }, // Chỉ lấy vai trò 'Investor' và 'Startup'
        },
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          role: '$_id',
          count: 1,
        },
      },
    ]);

    // Tính toán tổng số người dùng
    const totalUsers = rolesData.reduce((acc, role) => acc + role.count, 0);

    // Thêm phần trăm vào kết quả
    const rolesWithPercentage = rolesData.map((role) => ({
      ...role,
      percentage: Math.round((role.count / totalUsers) * 100),
    }));

    res.status(200).json(rolesWithPercentage);
  } catch (error) {
    res.status(500).send('Error fetching roles data');
  }
});
router.get('/admin/roles', async (req, res) => {
  try {
    const rolesData = await User.aggregate([
      {
        $unwind: '$role',
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          role: '$_id',
          count: 1,
        },
      },
    ]);

    // Tính toán tổng số người dùng
    const totalUsers = rolesData.reduce((acc, role) => acc + role.count, 0);

    // Thêm phần trăm vào kết quả
    const rolesWithPercentage = rolesData.map((role) => ({
      ...role,
      percentage: Math.round((role.count / totalUsers) * 100),
    }));

    res.status(200).json(rolesWithPercentage);
  } catch (error) {
    res.status(500).send('Error fetching roles data');
  }
});
export default router;
