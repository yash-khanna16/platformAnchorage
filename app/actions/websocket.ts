
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    console.log(process.env.NEXT_PUBLIC_ROOM_CODE);
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000");
    socket.emit("join_room", process.env.NEXT_PUBLIC_ROOM_CODE || "test")
  }
  return socket;
};
