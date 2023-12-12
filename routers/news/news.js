import express from "express";
import mongoose from "mongoose";
import multer  from "multer";
const router = express.Router();

router.use(express.json());
const Schema = mongoose.Schema;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const imageSchema = new Schema({
  title: String,
  content: String,
  image: Buffer, // Lưu trữ ảnh dưới dạng Buffer
});
router.use(express.urlencoded({ extended: true }));

const Image = mongoose.model('Image', imageSchema);
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageBuffer = req.file.buffer;

    // Tạo đối tượng Image và lưu vào cơ sở dữ liệu
    const newImage = new Image({ title, content, image: imageBuffer });
    const savedImage = await newImage.save();

    res.json({ title, content, message: 'Upload successful!', savedImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/images/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findById(imageId, { image: 1 }); // Chọn trường image

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Gửi dữ liệu ảnh dưới dạng base64
    const imageBase64 = image.image.toString('base64');
    const responseData = {
      title: image.title,
      content: image.content,
      image: imageBase64,
    };
    res.json(responseData);
  } catch (error) {
    console.error('Error getting image by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find({}, { title: 1, content: 1 }); // Chọn các trường bạn muốn hiển thị
    res.json(images);
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
});


export default router;
