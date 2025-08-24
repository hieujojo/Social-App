import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  _id: Types.ObjectId;
  username: string;
  caption: string;
  likes: (Types.ObjectId | { _id: Types.ObjectId; username: string })[];
  likesCount?: number;
  timeAgo?: string; // có thể tính động từ createdAt
  avatarAsset: string;
  postImageAsset: string; // Thêm trường mới
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    username: { type: String, required: true }, // username của người đăng
    caption: { type: String, required: true },  // nội dung bài post
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // danh sách user like
    likesCount: { type: Number, default: 0 },
    avatarAsset: { type: String, required: true }, // link avatar người đăng
    postImageAsset: { type: String, required: false, default: '' }, // link hoặc tên ảnh bài post, không bắt buộc
  },
  { timestamps: true }
);

// Virtual field để trả về "timeAgo"
postSchema.virtual("timeAgo").get(function (this: IPost) {
  const diffMs = Date.now() - this.createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
});

// cho phép virtuals hiển thị khi convert sang JSON
postSchema.set("toJSON", { virtuals: true });

export default model<IPost>("Post", postSchema);