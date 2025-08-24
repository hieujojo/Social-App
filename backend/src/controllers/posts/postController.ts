import { Request, Response } from "express";
import { Types } from "mongoose";
import Post from "../../models/posts/PostModel";
import User from "../../models/auth/UserModel";

interface AuthRequest extends Request {
  user?: { id: string };
}

// 📌 Tạo post mới
export const createPost = async (req: AuthRequest, res: Response) => {
  const { caption, avatarAsset, postImageAsset } = req.body;
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const post = new Post({
      username: user.username,
      caption,
      likes: [],
      likesCount: 0,
      avatarAsset: avatarAsset || user.profilePic || "",
      postImageAsset: postImageAsset || "",
    });

    await post.save();
    const populated = await Post.findById(post._id).populate("likes", "username");
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Lấy tất cả posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "likes",
        select: "username",
        options: { limit: 3 },
      })
      .sort({ createdAt: -1 });

    const updatedPosts = posts.map((post) => ({
      ...post.toJSON(),
      likesCount: post.likes ? post.likes.length : 0,
      hasMoreLikes: (post.likes?.length || 0) > 3,
    }));

    res.json(updatedPosts);
  } catch (err) {
    console.error("❌ Error in getAllPosts:", err);
    res.status(500).json({ msg: "Server error", error: err });
  }
};

// 📌 Lấy post theo username
export const getPostsByUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const posts = await Post.find({ username })
      .populate({
        path: "likes",
        select: "username",
        options: { limit: 3 },
      })
      .sort({ createdAt: -1 });

    const updatedPosts = posts.map((post) => ({
      ...post.toJSON(),
      likesCount: post.likes ? post.likes.length : 0,
      hasMoreLikes: (post.likes?.length || 0) > 3,
    }));

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Like / Unlike post
export const likePost = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  try {
    if (!req.user?.id) return res.status(401).json({ msg: "Unauthorized" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userObjectId = new Types.ObjectId(req.user.id);

    const hasLiked = post.likes.some(
      (like) =>
        like instanceof Types.ObjectId
          ? like.equals(userObjectId)
          : like._id.equals(userObjectId)
    );

    if (hasLiked) {
      post.likes = post.likes.filter(
        (like) =>
          like instanceof Types.ObjectId
            ? !like.equals(userObjectId)
            : !like._id.equals(userObjectId)
      );
    } else {
      post.likes.push(userObjectId);
    }

    post.likesCount = post.likes.length;
    await post.save();

    const populatedPost = await Post.findById(post._id).populate({
      path: "likes",
      select: "username",
      options: { limit: 3 },
    });

    res.json({
      likes: populatedPost?.likes || [],
      likesCount: populatedPost?.likesCount || 0,
      hasMoreLikes: (populatedPost?.likes.length || 0) > 3,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};