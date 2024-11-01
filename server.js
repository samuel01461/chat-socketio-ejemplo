require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const PORT = process.env.PORT || 8080;
var usuarios = [];

io.on("connection", (socket) => {
    var id = socket.id;

    usuarios.push(id);

    io.emit('updateUsuariosLista', usuarios);
    
    socket.on("nuevoMensaje", (msg) => {
        io.emit("nuevoMensaje", { id, msg });
    });

    socket.on("mensajePrivado", ({ globalId, destination, msj }) => {
        socket.to(destination).emit("mensajePrivado", { globalId, msj });
    });

    socket.on("desconectar", () => {
        usuarios = usuarios.filter(u => u !== socket.id);
        io.emit('updateUsuariosLista', usuarios);
    });
});

server.listen(PORT, () => {
    console.log("server running at " + PORT);
});
