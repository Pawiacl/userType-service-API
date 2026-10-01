const crypto = require("crypto");

const internalAuth = (req, res, next) => {
  const suppliedSecret = req.headers["x-internal-secret"];
  const expectedSecret = process.env.JWT_SECRET;

  if (!suppliedSecret || !expectedSecret) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const suppliedBuffer = Buffer.from(String(suppliedSecret));
  const expectedBuffer = Buffer.from(expectedSecret);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return next();
};

module.exports = internalAuth;