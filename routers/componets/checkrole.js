import jwt from "jsonwebtoken";

const checkRole = (roles) => {
    return (req, res, next) => {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
            const decoded = jwt.verify(token, "mysecretkey"); // Sử dụng bí mật JWT của bạn
            req.user = decoded;

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Access denied. You do not have permission to perform this action." });
            }
            next();
        } catch (error) {
            res.status(400).json({ message: "Invalid token." });
        }
    };
};

export default checkRole;
