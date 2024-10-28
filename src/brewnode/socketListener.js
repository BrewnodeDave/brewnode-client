
const host = 'localhost';
const port = 1880;

const io = require ('socket.io-client');
const socket = io(`http://${host}:${port}`); 

function SocketListener (name, cb) {
    socket.on(name, cb);  
};

export default SocketListener;
