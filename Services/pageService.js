const Page = require("../Models/page");
const permissionService = require("./permissionService");

// =====================================================
// GET ALL ACTIVE PAGES
// =====================================================

const getAllPages = async () => {
  const pages = await Page.find({
    active: true,
  }).sort({
    createdAt: 1,
  });

  return pages;
};

// =====================================================
// CREATE PAGE
// =====================================================

const createPage = async (pageName, path) => {
  // -------------------------------------------------
  // CHECK PAGE ALREADY EXISTS
  // -------------------------------------------------

  const existingPage = await Page.findOne({
    $or: [
      {
        pageName: pageName.trim(),
      },
      {
        path: path.trim(),
      },
    ],
  });

  if (existingPage) {
    const error = new Error("Page already exists");
    error.statusCode = 409;
    throw error;
  }

  // -------------------------------------------------
  // CREATE PAGE
  // -------------------------------------------------

  const page = await Page.create({
    pageName: pageName.trim(),
    path: path.trim(),
    active: true,
  });

  await permissionService.ensurePermissionsForPage(page._id);

  return page;
};

module.exports = {
  getAllPages,
  createPage,
};