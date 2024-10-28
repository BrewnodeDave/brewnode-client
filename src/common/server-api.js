import axios from 'axios';

const host = process.env.REACT_APP_HOST;
const port = process.env.REACT_APP_PORT;
const auth = {
    username : process.env.REACT_APP_BREWFATHER_USERNAME, 
    password : process.env.REACT_APP_BREWFATHER_PASSWORD
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
    const response = await axios.get(`http://${host}:${port}/restart`, {});
    return response.data;
}

export async function boil(mins) {
    const response = await axios.get(`http://${host}:${port}/boil/${JSON.stringify({mins})}`, {});
    return response.data;
}

export async function heat(on) {
    const response = await axios.get(`http://${host}:${port}/heat/${JSON.stringify({ on })}`, {});
    return response.data;
}

export async function ferment(steps) {
    const response = await axios.get(`http://${host}:${port}/ferment/${JSON.stringify({steps})}`, {});
    return response.data;
}

export async function chill(steps) {
    const response = await axios.get(`http://${host}:${port}/chill/${JSON.stringify({steps})}`, {});
    return response.data;
}

export async function k2f() { 
    const response = await axios.get(`http://${host}:${port}/k2f`, {});
    return response.data;
}

export async function k2m() {
    const response = await axios.get(`http://${host}:${port}/k2m`, {});
    return response.data;
}

export async function m2k() {
    const response = await axios.get(`http://${host}:${port}/m2k`, {});
    return response.data;
}   

export async function fill(litres) {  
    const response = await axios.get(`http://${host}:${port}/fill/${JSON.stringify({litres})}`, {});
    return response.data;
}

export async function kettleTemp(temp, mins) {
    const response = await axios.get(`http://${host}:${port}/kettleTemp/${JSON.stringify({temp, mins})}`, {});
    return response.data;
}

export async function mash(steps) {
    const response = await axios.get(`http://${host}:${port}/mash/${JSON.stringify({steps})}`, {});
    return response.data;
}

export async function brewname() {
    const response = await axios.get(`http://${host}:${port}/brewname`, {});
    return response.data;
}
