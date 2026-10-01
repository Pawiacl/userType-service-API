const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    // =====================================================
    // PAGE NAME
    // =====================================================

    pageName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // =====================================================
    // FRONTEND ROUTE
    // =====================================================

    path: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // =====================================================
    // PAGE ACTIVE STATUS
    // =====================================================

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Page",
  pageSchema,
  "pages"
);