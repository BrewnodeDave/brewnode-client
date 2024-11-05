
const host = 'localhost';
const port = 4000;

const io = require ('socket.io-client');
const socket = io(`http://${host}:${port}`); 

function addSocketListener (name, cb) {
    socket.on(name, cb);  
};

function removeSocketListener(name, cb) {
    socket.off(name, cb);
}

socket.on('connect', () => {
    // console.log('Connected to server');
});

socket.on('disconnect', () => {
    // console.log('Disconnected from server');
});

export {addSocketListener, removeSocketListener};
