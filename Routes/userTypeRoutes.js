const express = require("express");

const {
  getAllUserTypes,
  getUserTypeByUserType,
  createUserType,
  updateUserType,
  deleteUserType,
  getPermissionsByUserType,
  updatePermissions,
  getAllPages,
  createPage,
} = require("../Controllers/userTypeController");

const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const internalAuth = require("../Middleware/internalAuth");

const router = express.Router();

// =====================================================
// PAGES
// =====================================================

router.get(
  "/pages/all",
  authMiddleware,
  getAllPages
);

router.post(
  "/pages",
  authMiddleware,
  adminMiddleware,
  createPage
);

// =====================================================
// USER TYPES
// =====================================================

// GET ALL USER TYPES
router.get(
  "/",
  authMiddleware,
  getAllUserTypes
);

// INTERNAL PERMISSION API
// Login Service uses this
router.get(
  "/internal/permissions/:userType",
  internalAuth,
  getPermissionsByUserType
);

// GET USER TYPE
router.get(
  "/:userType",
  authMiddleware,
  getUserTypeByUserType
);

// CREATE USER TYPE
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createUserType
);

// UPDATE USER TYPE NAME
router.put(
  "/:userType",
  authMiddleware,
  adminMiddleware,
  updateUserType
);

// DELETE USER TYPE
router.delete(
  "/:userType",
  authMiddleware,
  adminMiddleware,
  deleteUserType
);

// UPDATE PERMISSIONS
router.put(
  "/:userType/permissions",
  authMiddleware,
  adminMiddleware,
  updatePermissions
);

module.exports = router;