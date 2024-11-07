const io = require('socket.io-client');
let host;// = 'localhost';
let port;// = 4000;
let socket = io(`http://${host}:${port}`);

// Map to store listeners
const listeners = new Map();

function setSocket(newHost, newPort) {
    // Close the existing socket connection
    if (socket) { 
        socket.disconnect();
    }

    // Update host and port
    host = newHost;
    port = src/socket.jsnewPort;

    // Create a new socket connection
    socket = io(`http://${host}:${port}`);

    // Reattach existing listeners
    listeners.forEach((cb, name) => {
        socket.on(name, cb);
    });

    return socket;
}

function addSocketListener(name, cb) {
    socket.on(name, cb);
    listeners.set(name, cb); // Store the listener in the map
}

function removeSocketListener(name, cb) {
    socket.off(name, cb);
    listeners.delete(name); // Remove the listener from the map
}

module.exports = { setSocket, addSocketListener, removeSocketListener };