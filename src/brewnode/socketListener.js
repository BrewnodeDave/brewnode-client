const io = require('socket.io-client');
const host = localStorage.getItem('ipAddress');
const port = localStorage.getItem('wsPort');
const socket = io(`http://${host}:${port}`);

// Map to store listeners
const listeners = new Map();

function addSocketListener(name, cb) {
    socket.on(name, cb);
    listeners.set(name, cb); // Store the listener in the map
}

function removeSocketListener(name, cb) {
    socket.off(name, cb);
    listeners.delete(name); // Remove the listener from the map
}

module.exports = { addSocketListener, removeSocketListener };