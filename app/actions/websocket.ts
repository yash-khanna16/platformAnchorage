
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
      console.log("env backend: ", process.env.NEXT_PUBLIC_BACKEND_URL)
      console.log("room code: ", process.env.NEXT_PUBLIC_ROOM_CODE)
      //fix this later temp change please change this
      socket = io(secret.BACKEND_URL || "https://platformanchoragebackend-4av0.onrender.com");
      socket.emit("join_room", secret.ROOM_CODE || "4398vnksd843jf7");
    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  }
};

