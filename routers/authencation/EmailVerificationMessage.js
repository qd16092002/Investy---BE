import express from "express";
import nodemailer from "nodemailer";
// import crypto from "crypto";
// import jwt from "jsonwebtoken";

const router = express.Router();
router.use(express.json());

// Cấu hình Nodemailer cho Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "webtutornow@gmail.com",
    pass: "qscndltjbxkwzxoz",
  },
});

// Gửi mã OTP qua email
router.post("/sendotp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const otp = generateOTP(6); // Tạo mã OTP

  // Lưu trữ mã OTP trong otpMap
  otpMap.set(email, otp);
  // console.log(otp);
  sendOTP(email, otp) // Gửi mã OTP qua email
    .then(() => {
      res.json({ message: "OTP sent successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to send OTP." });
    });
});

// Xác minh OTP
router.post("/verifyotp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required." });
  }

  // Truy xuất mã OTP từ otpMap
  const savedOtp = otpMap.get(email);
  // console.log(savedOtp);
  // const savedOtp = "123123";

  if (!savedOtp) {
    return res.status(400).json({ error: "OTP is not sent for this email." });
  }

  if (otp !== savedOtp) {
    return res.status(400).json({ error: "OTP verification successful." });
  }

  // Xóa mã OTP sau khi xác minh thành công
  otpMap.delete(email);

  res.json({ message: "OTP verification successful." });
});

function generateOTP(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendOTP(email, otp) {
  const mailOptions = {
    from: "webtutornow@gmail.com", // Địa chỉ email gửi
    to: email, // Địa chỉ email nhận
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function verifyOTP(email, otp) {
  // Thực hiện xác minh OTP theo logic của bạn
  // Ở đây, chúng ta sẽ so sánh mã OTP nhập vào với mã OTP đã gửi
  return new Promise((resolve, reject) => {
    // Lấy thông tin OTP từ nguồn dữ liệu hoặc bộ nhớ tạm
    const savedOtp = getSavedOTP(email);

    if (!savedOtp) {
      reject(new Error("OTP is not sent for this email."));
    }

    if (otp !== savedOtp) {
      reject(new Error("Invalid OTP."));
    }

    // Xóa thông tin OTP từ nguồn dữ liệu hoặc bộ nhớ tạm
    deleteSavedOTP(email);

    resolve();
  });
}

// Lưu trữ OTP tạm thời
const otpMap = new Map();

function getSavedOTP(email) {
  return otpMap.get(email);
}

function deleteSavedOTP(email) {
  otpMap.delete(email);
}

router.post('/send-email', async (req, res) => {
  const { to, subject, text,user } = req.body;

  // Define email options
  const mailOptions = {
    from: "webtutornow@gmail.com",
    to,
    subject,
    text: `Mời bạn tham gia hệ thống Investy: http://localhost:3003/ qua lời mời của ${user}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});
export default router;
