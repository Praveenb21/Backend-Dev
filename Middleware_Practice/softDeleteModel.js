// Exercise 4: Soft Delete System
// Instead of actually deleting documents, we mark them as deleted
// and automatically hide them from all queries

const mongoose = require("mongoose");

// --- Post Schema (example) ---
const postSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  content: { type: String, required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  // Soft delete fields — managed automatically by middleware
  isDeleted:  { type: Boolean, default: false },
  deletedAt:  { type: Date,    default: null },
  deletedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
},
{ timestamps: true }); // adds createdAt and updatedAt automatically

// -------------------------------------------------------
// MONGOOSE QUERY MIDDLEWARE
// -------------------------------------------------------

// List of all query methods we want to intercept
// We need to add the filter to EACH of these
const queryMethods = ["find", "findOne", "findOneAndUpdate", "countDocuments", "count"];

// For every query method, add { isDeleted: false } filter automatically
queryMethods.forEach((method) => {
  postSchema.pre(method, function () {
    // 'this' refers to the query object
    // Check if caller explicitly wants to include deleted docs
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: false }); // hide soft-deleted docs
    }
  });
});

// -------------------------------------------------------
// DOCUMENT MIDDLEWARE — intercept deleteOne on documents
// -------------------------------------------------------

// When someone calls document.deleteOne(), soft delete instead
postSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  // Mark as deleted instead of actually deleting
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();

  // Prevent actual deletion from happening
  // We do this by throwing a special skip signal
  // Actually in Mongoose we just don't call next() with deletion
  // Instead we call next() to complete the middleware chain but save has already happened
  next();
});

// -------------------------------------------------------
// STATIC METHODS — helper functions on the Model itself
// -------------------------------------------------------

// Soft delete by ID
postSchema.statics.softDelete = async function (id, deletedBy = null) {
  const doc = await this.findById(id);
  if (!doc) throw new Error("Document not found");

  doc.isDeleted = true;
  doc.deletedAt = new Date();
  doc.deletedBy = deletedBy;
  await doc.save();

  return doc;
};

// Restore a soft-deleted document
postSchema.statics.restore = async function (id) {
  // Must use includeDeleted option to find soft-deleted docs
  const doc = await this.findOne({ _id: id }).setOptions({ includeDeleted: true });
  if (!doc) throw new Error("Document not found");

  doc.isDeleted = false;
  doc.deletedAt = null;
  doc.deletedBy = null;
  await doc.save();

  return doc;
};

// Get all soft-deleted documents (for admin panel / trash view)
postSchema.statics.getDeleted = function () {
  return this.find({ isDeleted: true }).setOptions({ includeDeleted: true });
};

// Permanent delete — only when really needed
postSchema.statics.hardDelete = function (id) {
  return this.deleteOne({ _id: id }).setOptions({ includeDeleted: true });
};

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
