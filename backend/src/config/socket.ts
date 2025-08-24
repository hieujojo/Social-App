import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

interface SocketUser {
  userId: string;
  socketId: string;
}

const users: SocketUser[] = [];

export let io: Server; // Export io for use in controllers

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (userId: string) => {
      users.push({ userId, socketId: socket.id });
      console.log('User registered:', userId, socket.id);
    });

    socket.on('disconnect', () => {
      const index = users.findIndex((u) => u.socketId === socket.id);
      if (index !== -1) {
        users.splice(index, 1);
        console.log('User disconnected:', socket.id);
      }
    });
  });

  return io;
};

export const emitNotification = (userId: string, notification: any) => {
  const user = users.find((u) => u.userId === userId);
  if (user) {
    io.to(user.socketId).emit('notification', notification);
  }
};