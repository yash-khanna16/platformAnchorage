
import { io, Socket } from "socket.io-client";
import loadConfig from "@/config/config";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (!socket) {
    // Initialize socket if not already done
    initializeSocket();
  }
  return socket;
};

const initializeSocket = async (): Promise<void> => {
  if (!socket) {
    try {
      const secret = await loadConfig();
      console.log(secret);
      //fix this later temp change
      socket = io(secret.BACKEND_URL || "https://platformanchoragebackend-4av0.onrender.com");
      socket.emit("join_room", secret.ROOM_CODE || "test");
    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  }
};

