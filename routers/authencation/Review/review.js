import express from "express";
import User from "../../Data/user.js"
import Review from "../../Data/Review/Services.js";
const router = express.Router();

router.post('/review', async (req, res) => {
  const { content, rating, subjectId, subjectType, image, createdBy } = req.body;

  try {
    if (!createdBy) {
      return res.status(401).json({ message: "You need to log in to rate." });
    }
    // Kiểm tra xem đã có review nào từ người dùng này vào đối tượng này chưa
    const existingReview = await Review.findOne({ subjectId, subjectType, createdBy });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this object" });
    }

    // Nếu chưa có review, thêm mới
    const newReview = new Review({
      content,
      rating,
      subjectId,
      subjectType,
      createdBy,
      image,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa review chỉ cho createdBy
router.delete('/review/:reviewId', async (req, res) => {
  const reviewId = req.params.reviewId;
  const { createdBy } = req.body;

  try {
    // Kiểm tra xem người gửi request có phải là người tạo review không
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.createdBy !== createdBy) {
      return res.status(403).json({ message: "You do not have the right to delete this review." });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sửa review chỉ cho createdBy
router.put('/review/:reviewId', async (req, res) => {
  const reviewId = req.params.reviewId;
  const { content, rating, image, createdBy } = req.body;

  try {
    // Kiểm tra xem người gửi request có phải là người tạo review không
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.createdBy !== createdBy) {
      return res.status(403).json({ message: "You do not have the right to edit this review." });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { content, rating },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Lấy danh sách review theo subjectId và subjectType
router.post('/getreviewsbyid', async (req, res) => {
  const { subjectId, subjectType } = req.body;
  try {
    const reviews = await Review.find({ subjectType, subjectId });
    if (reviews.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá cho mục này." });
    }

    // Lấy thông tin của User cho mỗi review
    const promises = reviews.map(async (review) => {
      let createdBy = null;
      if (review.createdBy) {
        createdBy = await User.findById(review.createdBy);
      }
      // Tạo một đối tượng mới chứa thông tin review và thông tin user
      const reviewWithUser = {
        _id: review._id,
        subjectType: review.subjectType,
        subjectId: review.subjectId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        content: review.content,
        createdBy: createdBy ? {
          _id: createdBy._id,
          userId: createdBy.userId,
          username: createdBy.username,
          email: createdBy.email,
          avt: createdBy.avturl,
          fullName: createdBy.fullName
        } : null
      };
      return reviewWithUser;
    });

    // Chờ tất cả các promises hoàn thành
    const result = await Promise.all(promises);

    // Gửi dữ liệu đã lấy được như là một phản hồi
    res.status(200).json({ reviews: result });
  } catch (err) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy đánh giá." });
  }
});



// Tính trung bình rating, tổng số lượt review và lấy danh sách review theo subjectId và subjectType
router.post('/average-rating-byid', async (req, res) => {
  const { subjectId, subjectType } = req.body;
  try {
    const reviews = await Review.find({ subjectType, subjectId }).populate('createdBy', 'userId username email');
    if (reviews.length === 0) {
      // Nếu không có reviews, trả về trung bình rating mặc định là 5 sao và totalReviews là 0
      return res.status(200).json({ averageRating: 0, totalReviews: 0, reviews: [] });
    }

    let totalRating = 0;
    reviews.forEach(review => {
      totalRating += review.rating;
    });
    const averageRating = totalRating / reviews.length;

    // Trả về thông tin trung bình rating, tổng số lượt review và danh sách các reviews
    res.status(200).json({ averageRating, totalReviews: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
