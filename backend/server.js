import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*", // permite conexiones desde Angular
  },
});

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Escuchar mensaje del cliente
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);
    // Reenviar a todos los conectados
    io.emit("mensaje", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
