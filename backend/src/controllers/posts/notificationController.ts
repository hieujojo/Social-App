import { Request, Response } from 'express';
import Notification from '../../models/posts/NotificationModel';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.user?.id })
      .populate('fromUserId', 'username profilePic')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });

    if (notification.userId.toString() !== req.user?.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    notification.read = true;
    await notification.save();
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};