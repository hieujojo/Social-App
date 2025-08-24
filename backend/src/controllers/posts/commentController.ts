import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Comment from '../../models/posts/CommentModel';
import Post from '../../models/posts/PostModel';
import User from '../../models/auth/UserModel';
import Notification from '../../models/posts/NotificationModel';
import { emitNotification } from '../../config/socket';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Add Comment
export const addComment = async (req: AuthRequest, res: Response) => {
  const { postId, content } = req.body;
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const userObjectId = new Types.ObjectId(req.user.id);

    const comment = new Comment({
      postId: new Types.ObjectId(postId),
      userId: userObjectId,
      content,
      likes: [],
    });
    await comment.save();

    // 🔥 Không push vào post.comments nữa, chỉ lưu ở Comment collection
    // 🔥 Không dùng post.userId nữa, thay vào đó lấy post.username
    if (post.username !== user.username) {
      const notification = new Notification({
        userId: post.username, // hoặc bạn có thể lưu username thay cho ObjectId
        type: 'comment',
        fromUserId: userObjectId,
        postId,
        message: `${user.username} commented on your post`,
      });
      await notification.save();

      emitNotification(post.username, {
        ...notification.toObject(),
        fromUser: { username: user.username, profilePic: user.profilePic },
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Comments
export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId })
      .populate('userId', 'username profilePic')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
