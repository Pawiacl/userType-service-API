const userTypeService = require("../Services/userTypeService");
const pageService = require("../Services/pageService");
const permissionService = require("../Services/permissionService");

// =====================================================
// GET ALL USER TYPES
// =====================================================

const getAllUserTypes = async (req, res) => {
  try {
    const userTypes =
      await userTypeService.getAllUserTypes();

    res.status(200).json({
      success: true,
      data: userTypes,
    });
  } catch (error) {
    console.error("Get All User Types Error:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to fetch user types",
    });
  }
};

// =====================================================
// GET USER TYPE BY USER TYPE
// =====================================================

const getUserTypeByUserType = async (req, res) => {
  try {
    const { userType } = req.params;

    const result =
      await userTypeService.getUserTypeByUserType(
        userType
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get User Type Error:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to fetch user type",
    });
  }
};

// =====================================================
// CREATE USER TYPE
// =====================================================

const createUserType = async (req, res) => {
  try {
    const { userType } = req.body;

    const result =
      await userTypeService.createUserType(userType);

    res.status(201).json({
      success: true,
      message: "User type created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create User Type Error:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to create user type",
    });
  }
};

// =====================================================
// UPDATE USER TYPE
// =====================================================

const updateUserType = async (req, res) => {
  try {
    const { userType } = req.params;
    const { newUserType } = req.body;

    const result =
      await userTypeService.updateUserType(
        userType,
        newUserType
      );

    res.status(200).json({
      success: true,
      message: "User type updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update User Type Error:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to update user type",
    });
  }
};

// =====================================================
// DELETE USER TYPE
// =====================================================

const deleteUserType = async (req, res) => {
  try {
    const { userType } = req.params;

    const result =
      await userTypeService.deleteUserType(userType);

    res.status(200).json({
      success: true,
      message: "User type deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete User Type Error:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to delete user type",
    });
  }
};

// =====================================================
// GET PERMISSIONS BY USER TYPE
// =====================================================

const getPermissionsByUserType = async (req, res) => {
  try {
    const { userType } = req.params;

    const normalizedUserType = userType
      .toLowerCase()
      .trim();

    const permissions =
      await permissionService.ensurePermissionsForUserType(
        normalizedUserType
      );

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error("Get Permissions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PERMISSIONS
// =====================================================

const updatePermissions = async (req, res) => {
  try {
    const { userType } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Permissions must be an array",
      });
    }

    const normalizedUserType = userType
      .toLowerCase()
      .trim();

    const savedPermissions =
      await permissionService.savePermissions(
        normalizedUserType,
        permissions
      );

    res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      data: savedPermissions,
    });
  } catch (error) {
    console.error("Update Permissions Error:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to update permissions",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL PAGES
// =====================================================

const getAllPages = async (req, res) => {
  try {
    const pages = await pageService.getAllPages();

    res.status(200).json({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error("Get All Pages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pages",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE PAGE
// =====================================================

const createPage = async (req, res) => {
  try {
    const { pageName, path } = req.body;

    if (!pageName || !path) {
      return res.status(400).json({
        success: false,
        message: "Page name and path are required",
      });
    }

    const page = await pageService.createPage(
      pageName,
      path
    );

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: page,
    });
  } catch (error) {
    console.error("Create Page Error:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to create page",
    });
  }
};

module.exports = {
  getAllUserTypes,
  getUserTypeByUserType,
  createUserType,
  updateUserType,
  deleteUserType,
  getPermissionsByUserType,
  updatePermissions,
  getAllPages,
  createPage,
};