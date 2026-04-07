// usage.js — How to use the Soft Delete System

const Post = require("./softDeleteModel");

const demoSoftDelete = async () => {

  // --- Create a post ---
  const post = await Post.create({
    title: "My First Post",
    content: "Hello World!",
  });
  console.log("Created:", post.title);

  // --- Normal find — only returns non-deleted docs (automatic) ---
  const allPosts = await Post.find();
  console.log("All posts:", allPosts.length); // shows all active posts

  // --- Soft delete a post ---
  await Post.softDelete(post._id);
  console.log("Post soft deleted");

  // --- Find again — soft deleted post is automatically hidden ---
  const activePosts = await Post.find();
  console.log("Active posts after delete:", activePosts.length); // one less

  // --- View deleted posts (admin feature) ---
  const deletedPosts = await Post.getDeleted();
  console.log("Deleted posts:", deletedPosts.length); // shows the deleted one

  // --- Restore the post ---
  await Post.restore(post._id);
  console.log("Post restored");

  // --- Now it shows up again in normal queries ---
  const restoredPosts = await Post.find();
  console.log("Posts after restore:", restoredPosts.length);

  // --- Hard delete when you really want to remove it permanently ---
  await Post.hardDelete(post._id);
  console.log("Post permanently deleted");
};

demoSoftDelete().catch(console.error);

/*
  Key Points:
  
  ✅ Post.find()         → automatically excludes soft-deleted docs
  ✅ Post.findOne()      → automatically excludes soft-deleted docs
  ✅ Post.softDelete(id) → marks as deleted, does NOT remove from DB
  ✅ Post.restore(id)    → brings deleted doc back to life
  ✅ Post.getDeleted()   → shows only the deleted docs (for trash/admin)
  ✅ Post.hardDelete(id) → permanent removal (use carefully!)
*/
