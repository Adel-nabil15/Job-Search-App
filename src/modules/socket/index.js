import { Server } from "socket.io";

let io
export const RunSocket = function (server) {
   io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.to

  io.on("connection", (socket) => {
    console.log("new user connection", socket.id );
  });
};

export {io}