const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.cookies.token; // ✅ Get JWT from cookies

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        res.status(403).json({ message: "Invalid token" });
    }
};
