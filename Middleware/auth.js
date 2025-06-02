const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  try {
    // Passport sets req.user on OAuth login
    if (req.user) {
      // OAuth user is already attached
      return next();
    }

    // Check for JWT token in cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    // Attach decoded info to req.user for convenience
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
