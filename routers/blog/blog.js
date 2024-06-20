import express from "express";
import Blog from "../Data/Blog/index.js"
const router = express.Router();

router.post('/createblog', async (req, res) => {
    try {
        const { title, author, content, type, coverimage } = req.body;

        // Collect errors for missing fields
        const errors = {};
        if (!title) errors.title = 'Title is required';
        if (!author) errors.author = 'Author is required';
        if (!content) errors.content = 'Content is required';
        if (!type) errors.type = 'Type is required';
        if (!coverimage) errors.coverimage = 'Cover image is required';

        // If there are any errors, return a 400 status with the error messages
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const newBlog = new Blog({
            title,
            author,
            content,
            type,
            coverimage
        });

        const savedBlog = await newBlog.save();

        return res.json({
            _id: savedBlog._id,
            message: "Post Blog successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
router.delete('/deleteblog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        return res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.get('/getallblog', async (req, res) => {
    try {
        const { keyword, type } = req.query;
        let query = {};

        if (keyword) {
            query['$or'] = [
                { 'title': { $regex: new RegExp(keyword, 'i') } },
                { 'author': { $regex: new RegExp(keyword, 'i') } },
                { 'type': { $regex: new RegExp(keyword, 'i') } },
                { 'content.data': { $regex: new RegExp(keyword, 'i') } },
            ];
        }

        if (type) {
            // Ensure existing $or conditions are preserved when adding the type filter
            if (query['$or']) {
                query['$and'] = [
                    { '$or': query['$or'] },
                    { 'type': type },
                ];
                delete query['$or'];
            } else {
                query['type'] = type;
            }
        }

        const blogs = await Blog.find(query);
        return res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.get('/getblogbyid/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        return res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
export default router;