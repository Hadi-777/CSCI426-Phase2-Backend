const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const h = req.headers.authorization;

    if (!h) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const parts = h.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ success: false, message: "Invalid Authorization header format" });
    }

    const token = parts[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, email, user_type }
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;
