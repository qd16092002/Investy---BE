import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.use(express.json());

const Notify = mongoose.model("Notify", {
  email: {
    type: String,
    required: true,
  },

});

router.post("/postemailnotify", async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra xem trường email đã được gửi lên hay không
    if (!email) {
      return res.status(400).json({ message: "Please enter your email!" });
    }

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const existingNotify = await Notify.findOne({ email });
    if (existingNotify) {
      // Nếu email đã tồn tại, trả về thông báo lỗi
      return res.status(400).json({ message: "Email has been saved in the system" });
    }

    // Nếu email chưa tồn tại, tạo một tài liệu mới
    const newNotify = new Notify({ email });
    const insert = await newNotify.save();
    return res.json({
      message: "Email registration successful",
      docID: insert._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


router.get("/getemailnotify", async (req, res) => {
  try {
    const { query } = req;
    const newNotify = await Notify.find(query);
    res.status(200).send(newNotify);
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Server error");
  }
});

export default router;
