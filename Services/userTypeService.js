const UserType = require("../Models/userType");
const Permission = require("../Models/permission");
const permissionService = require("./permissionService");

// =====================================================
// NORMALIZE USER TYPE
// =====================================================

const normalizeUserType = (userType) => {
  return String(userType || "")
    .toLowerCase()
    .trim();
};

// =====================================================
// GET ALL USER TYPES
// =====================================================

const getAllUserTypes = async () => {
  return await UserType.find()
    .select("userType createdAt updatedAt")
    .sort({ createdAt: 1 });
};

// =====================================================
// GET USER TYPE BY NAME
// =====================================================

const getUserTypeByUserType = async (userType) => {
  const normalizedUserType = normalizeUserType(userType);

  const userTypeDoc = await UserType.findOne({
    userType: normalizedUserType,
  }).select("userType createdAt updatedAt");

  if (!userTypeDoc) {
    const error = new Error("User type not found");
    error.statusCode = 404;
    throw error;
  }

  const permissions =
    await permissionService.ensurePermissionsForUserType(
      normalizedUserType
    );

  return {
    ...userTypeDoc.toObject(),
    permissions,
  };
};

// =====================================================
// CREATE USER TYPE
// =====================================================

const createUserType = async (userType) => {
  const normalizedUserType = normalizeUserType(userType);

  if (!normalizedUserType) {
    const error = new Error("User type is required");
    error.statusCode = 400;
    throw error;
  }

  const existingUserType = await UserType.findOne({
    userType: normalizedUserType,
  });

  if (existingUserType) {
    const error = new Error("User type already exists");
    error.statusCode = 409;
    throw error;
  }

  const userTypeDoc = await UserType.create({
    userType: normalizedUserType,
  });

  // Create default permission records
  await permissionService.ensurePermissionsForUserType(
    normalizedUserType
  );

  return userTypeDoc;
};

// =====================================================
// UPDATE USER TYPE
// =====================================================

const updateUserType = async (
  currentUserType,
  newUserType
) => {
  const normalizedCurrentUserType =
    normalizeUserType(currentUserType);

  const normalizedNewUserType =
    normalizeUserType(newUserType);

  if (!normalizedNewUserType) {
    const error = new Error("User type is required");
    error.statusCode = 400;
    throw error;
  }

  const existingUserType = await UserType.findOne({
    userType: normalizedCurrentUserType,
  });

  if (!existingUserType) {
    const error = new Error("User type not found");
    error.statusCode = 404;
    throw error;
  }

  // No change
  if (
    normalizedCurrentUserType ===
    normalizedNewUserType
  ) {
    return existingUserType;
  }

  const duplicateUserType = await UserType.findOne({
    userType: normalizedNewUserType,
  });

  if (duplicateUserType) {
    const error = new Error("User type already exists");
    error.statusCode = 409;
    throw error;
  }

  // Update UserType
  existingUserType.userType = normalizedNewUserType;
  await existingUserType.save();

  // Keep existing permission records connected
  await Permission.updateMany(
    {
      userType: normalizedCurrentUserType,
    },
    {
      $set: {
        userType: normalizedNewUserType,
      },
    }
  );

  return existingUserType;
};

// =====================================================
// DELETE USER TYPE
// =====================================================

const deleteUserType = async (userType) => {
  const normalizedUserType = normalizeUserType(userType);

  const existingUserType = await UserType.findOne({
    userType: normalizedUserType,
  });

  if (!existingUserType) {
    const error = new Error("User type not found");
    error.statusCode = 404;
    throw error;
  }

  await UserType.deleteOne({
    _id: existingUserType._id,
  });

  // Remove permissions belonging to this user type
  await Permission.deleteMany({
    userType: normalizedUserType,
  });

  return {
    userType: normalizedUserType,
  };
};

module.exports = {
  getAllUserTypes,
  getUserTypeByUserType,
  createUserType,
  updateUserType,
  deleteUserType,
};