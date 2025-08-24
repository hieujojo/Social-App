import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/auth/UserModel';
import nodemailer from 'nodemailer';

const OTP_EXPIRATION = 5 * 60 * 1000; // 5 phút

// Hàm tạo OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Đăng ký
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check email phải là @gmail.com
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Email phải là @gmail.com' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + OTP_EXPIRATION),
      isVerified: false
    });

    await user.save();

    // Gửi email OTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Xác minh tài khoản',
      text: `Mã OTP của bạn là: ${otp}`,
    });
    console.log(`OTP sent to ${email} and ${otp}`);

    res.status(201).json({ message: 'Đăng ký thành công, vui lòng kiểm tra email để xác minh OTP' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xác minh OTP (verify-email)
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Người dùng không tồn tại' });

    if (user.isVerified) return res.status(400).json({ message: 'Email đã xác minh rồi' });

    if (user.otp !== otp) return res.status(400).json({ message: 'OTP không đúng' });

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP đã hết hạn' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(201).json({ message: 'Xác minh OTP thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    if (!user.isVerified) return res.status(400).json({ message: 'Email chưa xác minh' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy profile của user hiện tại
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy profile của user cụ thể (có thể của người khác)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -otp -otpExpires');
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật profile
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { bio, fullName, profilePic } = req.body;
    const updates: any = {};
    if (bio !== undefined) updates.bio = bio;
    if (fullName !== undefined) updates.fullName = fullName;
    if (profilePic !== undefined) updates.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password -otp -otpExpires');
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Follow user (cải thiện: cập nhật cả hai bên)
export const followUser = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(userId);

    if (!user || !targetUser) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    if (user.following.includes(userId)) {
      return res.status(400).json({ message: 'Bạn đã follow người này rồi' });
    }

    // Thêm vào following của user hiện tại
    user.following.push(userId);
    // Thêm vào followers của target user
    targetUser.followers.push(user._id);
    await user.save();
    await targetUser.save();

    res.json({ message: 'Follow thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tất cả user (với phân trang)
export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -otp -otpExpires')
      .skip(skip)
      .limit(limit);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách followers của user
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('followers', '-password -otp -otpExpires');
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    res.json(user.followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách following của user
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('following', '-password -otp -otpExpires');
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    res.json(user.following);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};