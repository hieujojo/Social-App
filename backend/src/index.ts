import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/db';
import { initSocket } from './config/socket';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postsRoutes';
import commentRoutes from './routes/commentsRoutes';
import notificationRoutes from './routes/notificationsRoutes';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);

app.set('io', io);

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static('public/images'));
app.use('/api/authenticate', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
