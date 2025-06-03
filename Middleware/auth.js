const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  try {
    // 1. Already authenticated via passport (OAuth)
    if (req.user) {
      return next();
    }

    // 2. Check for JWT in Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // 3. Fallback: check for token in cookies
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
