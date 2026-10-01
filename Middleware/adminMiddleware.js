const adminMiddleware = (req, res, next) => {
  // User information missing
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Check Admin
  if (req.user.userType !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

module.exports = adminMiddleware;