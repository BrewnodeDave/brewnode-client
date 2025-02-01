import axios from 'axios';
// import { error } from 'highcharts';


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

    if (response.errors){
        return {err: response.message};
    }

    const name = response.data.name;
    if (name != undefined) {        
        const result = await axios.put(`http://${host}:${port}/brewname?name=${name}`);
        return response.data;
    }else{
        return {err: 'No batch in progress'};
    }

}

export async function getBrewdata(name) {
    const response = await axios.get(`http://${host}:${port}/brewdata?brewname=${name}`);
    return response.data;
}

export async function getBrewnames() {
    const response = await axios.get(`http://${host}:${port}/mysql/brewnames`);
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

export async function Heater(on) {
    const onOff = on ? 'On' : 'Off';
    const response = await axios.put(`http://${host}:${port}/heat?onOff=${onOff}`, {});
    return response.data;
}

/**
 * Turns the extractor on or off based on the provided boolean value.
 *
 * @param {boolean} on - A boolean value indicating whether to turn the extractor on or off.
 * @returns {Promise<boolean>} - A promise that resolves to true if the extractor is turned on, and false if it is turned off.
 */
export async function Fan(on) {
    const onOff = on ? 'On' : 'Off';
    const response = await axios.put(`http://${host}:${port}/fan?onOff=${onOff}`, {});
    return response.data;
}

export async function PumpKettle(on) {
    const onOff = on ? 'On' : 'Off';
    const response = await axios.put(`http://${host}:${port}/pump/kettle?onOff=${onOff}`, {});
    return response.data;
}

export async function PumpMash(on) {
    const onOff = on ? 'On' : 'Off';
    const response = await axios.put(`http://${host}:${port}/pump/mash?onOff=${onOff}`, {});
    return response.data;
}

export async function PumpGlycol(on) {
    const onOff = on ? 'On' : 'Off';
    const response = await axios.put(`http://${host}:${port}/pump/glycol?onOff=${onOff}`, {});
    return response.data;
}

export async function GlycolHeater(on) {
    const onOff = on ? 'On' : 'Off';
    const response = await axios.put(`http://${host}:${port}/glycol/heat?onOff=${onOff}`, {});
    return response.data;
}

export async function GlycolChiller(on) {
    const onOff = on ? 'On' : 'Off';
    const response = await axios.put(`http://${host}:${port}/glycol/chill?onOff=${onOff}`, {});
    return response.data;
}

export async function ValveKettleIn(open) {
    const state = open ? 'Open' : 'Close';
    const response = await axios.put(`http://${host}:${port}/valve/kettlein?onOff=${state}`, {});
    return response.data;
}

export async function ValveMashIn(open) {
    const state = open ? 'Open' : 'Close';
    const response = await axios.put(`http://${host}:${port}/valve/mashin?onOff=${state}`, {});
    return response.data;
}

export async function ValveChillWortIn(open) {
    const state = open ? 'Open' : 'Close';
    const response = await axios.put(`http://${host}:${port}/valve/chillWortIn?onOff=${state}`, {});
    return response.data;
}

export async function ValveFermentIn(open) {
    const state = open ? 'Open' : 'Close';
    const response = await axios.put(`http://${host}:${port}/valve/fermentIn?onOff=${state}`, {});
    return response.data;
}

export async function ferment(steps) {
    const string = steps.map(step => `step=${encodeURIComponent(JSON.stringify(step))}`).join('&');

    const response = await axios.put(`http://${host}:${port}/ferment?${string}`, {});
    return response.data;
}

export async function chill(steps) {
    const string = steps.map(step => `step=${encodeURIComponent(JSON.stringify(step))}`).join('&');

    const response = await axios.put(`http://${host}:${port}/chill/${string}`, {});
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
    const string = steps.map(step => `step=${encodeURIComponent(JSON.stringify(step))}`).join('&');

    const response = await axios.put(`http://${host}:${port}/mash/${string}`, {});
    return response.data;
}

export async function sensorStatus(name) {
    try {
        const response = await axios.get(`http://${host}:${port}/sensorStatus?name=${name}`);
        return response.data;
    }catch(error){
        return {error: error.message || error};
    }
}

export async function pumpsStatus() {
    try {
        const response = await axios.get(`http://${host}:${port}/pumps/status`);
        return response.data;
    }catch(error){
        return {error: error.message || error};
    }
}

export async function valvesStatus() {
    try {
        const response = await axios.get(`http://${host}:${port}/valves/status`);
        return response.data;
    }catch(error){
        return {error: error.message || error};
    }
}

export async function fanStatus() {
    try {
        const response = await axios.get(`http://${host}:${port}/fan/status`);
        return response.data;
    }catch(error){
        return {error: error.message || error};
    }
}
