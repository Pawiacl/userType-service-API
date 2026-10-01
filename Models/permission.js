const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER TYPE
    // =====================================================

    userType: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // =====================================================
    // PAGE REFERENCE
    // =====================================================

    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },

    // =====================================================
    // VIEW PERMISSION
    // =====================================================

    view: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // ADD PERMISSION
    // =====================================================

    add: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // EDIT PERMISSION
    // =====================================================

    edit: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // DELETE PERMISSION
    // =====================================================

    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// ONE USER TYPE + ONE PAGE = ONE PERMISSION
// =====================================================

permissionSchema.index(
  {
    userType: 1,
    pageId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Permission",
  permissionSchema,
  "permissions"
);