const Permission = require("../Models/permission");
const UserType = require("../Models/userType");
const Page = require("../Models/page");

const normalizeUserType = (userType) =>
  String(userType || "").toLowerCase().trim();

const ensurePermissionsForUserType = async (userType) => {
  const normalizedUserType = normalizeUserType(userType);

  if (!normalizedUserType) {
    return [];
  }

  await UserType.findOneAndUpdate(
    { userType: normalizedUserType },
    { $setOnInsert: { userType: normalizedUserType } },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    }
  );

  const userTypeExists = await UserType.exists({
    userType: normalizedUserType,
  });

  if (!userTypeExists) {
    return [];
  }

  const pages = await Page.find({ active: true }).select("_id");
  const fullAccess = normalizedUserType === "admin";

  if (pages.length > 0) {
    await Permission.bulkWrite(
      pages.map(({ _id: pageId }) => ({
        updateOne: {
          filter: {
            userType: normalizedUserType,
            pageId,
          },
          update: {
            $setOnInsert: {
              userType: normalizedUserType,
              pageId,
              view: fullAccess,
              add: fullAccess,
              edit: fullAccess,
              delete: fullAccess,
            },
          },
          upsert: true,
        },
      }))
    );
  }

  return getPermissionsByUserType(normalizedUserType);
};

const ensurePermissionsForPage = async (pageId) => {
  const userTypes = await UserType.find().select("userType");

  if (userTypes.length > 0) {
    await Permission.bulkWrite(
      userTypes.map(({ userType }) => {
        const fullAccess = userType === "admin";

        return {
          updateOne: {
            filter: { userType, pageId },
            update: {
              $setOnInsert: {
                userType,
                pageId,
                view: fullAccess,
                add: fullAccess,
                edit: fullAccess,
                delete: fullAccess,
              },
            },
            upsert: true,
          },
        };
      })
    );
  }
};

// =====================================================
// GET PERMISSIONS BY USER TYPE
// =====================================================

const getPermissionsByUserType = async (userType) => {
  const permissions = await Permission.find({
    userType: normalizeUserType(userType),
  }).populate("pageId");

  return permissions;
};

// =====================================================
// GET PERMISSION FOR ONE USER TYPE + ONE PAGE
// =====================================================

const getPagePermission = async (userType, pageId) => {
  const permission = await Permission.findOne({
    userType: normalizeUserType(userType),
    pageId,
  }).populate("pageId");

  return permission;
};

// =====================================================
// SAVE / UPDATE PERMISSIONS
// =====================================================

const savePermissions = async (
  userType,
  permissions
) => {
  const normalizedUserType = userType
    ? normalizeUserType(userType)
    : "";

  const userTypeExists = await UserType.exists({
    userType: normalizedUserType,
  });

  if (!userTypeExists) {
    const error = new Error("User type not found");
    error.statusCode = 404;
    throw error;
  }

  const savedPermissions = [];

  for (const permission of permissions) {
    const pageExists = await Page.exists({
      _id: permission.pageId,
      active: true,
    });

    if (!pageExists) {
      const error = new Error("Page not found");
      error.statusCode = 404;
      throw error;
    }

    const savedPermission =
      await Permission.findOneAndUpdate(
        {
          userType: normalizedUserType,
          pageId: permission.pageId,
        },
        {
          $set: {
            view: Boolean(permission.view),
            add: Boolean(permission.add),
            edit: Boolean(permission.edit),
            delete: Boolean(permission.delete),
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    savedPermissions.push(savedPermission);
  }

  return savedPermissions;
};

module.exports = {
  getPermissionsByUserType,
  getPagePermission,
  ensurePermissionsForUserType,
  ensurePermissionsForPage,
  savePermissions,
};