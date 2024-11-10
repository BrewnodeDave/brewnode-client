import axios from 'axios';


// Retrieve username and password from localStorage
const username = localStorage.getItem('username');
const password = localStorage.getItem('password');
const host = localStorage.getItem('ipAddress');
const port = localStorage.getItem('ipPort');
    
const auth = {
    username: username || process.env.REACT_APP_BREWFATHER_USERNAME, 
    password: password || process.env.REACT_APP_BREWFATHER_PASSWORD
};


export async function getBatch() {
    const response = await axios.get(`http://${host}:${port}/brewing`, {
        auth,
        withCredentials: true});
    return response.data;
}

export async function getInventory() {
    const response = await axios.get(`http://${host}:${port}/inventory`, {
        auth,
        withCredentials: true});
    return response.data;
}

export async function restart() {
    const response = await axios.put(`http://${host}:${port}/restart`, {});
    return response.data;
}

export async function boil(mins) {
    const response = await axios.put(`http://${host}:${port}/boil?mins=${mins}`, {});
    return response.data;
}

export async function heat(on) {
    const onOff = on ? 'On' : 'Off';
    const response = await axios.put(`http://${host}:${port}/heat?onOff=${onOff}`, {});
    return response.data === "Off" ? false : true;
}

export async function ferment(steps) {
    const response = await axios.put(`http://${host}:${port}/ferment/${JSON.stringify({steps})}`, {});
    return response.data;
}

export async function chill(steps) {
    const response = await axios.put(`http://${host}:${port}/chill/${JSON.stringify({steps})}`, {});
    return response.data;
}

export async function k2f() { 
    const response = await axios.put(`http://${host}:${port}/k2f`, {});
    return response.data;
}

export async function k2m() {
    const response = await axios.put(`http://${host}:${port}/k2m`, {});
    return response.data;
}

export async function m2k() {
    const response = await axios.put(`http://${host}:${port}/m2k`, {});
    return response.data;
}   

export async function fill(litres) {  
    const response = await axios.put(`http://${host}:${port}/fill?litres=${litres}`, {});
    return response.data;
}

export async function kettleTemp(temp, mins) {
    const response = await axios.put(`http://${host}:${port}/kettleTemp?temp=${temp}&mins=${mins}`, {});
    return response.data;
}

export async function mash(steps) {
    const response = await axios.put(`http://${host}:${port}/mash/${JSON.stringify({steps})}`, {});
    return response.data;
}
