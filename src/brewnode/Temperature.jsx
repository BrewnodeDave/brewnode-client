import React, { useEffect, useState } from 'react';

import { sensorStatus } from "./server-api.js";

import '../common/App.css';


import {addSocketListener, removeSocketListener} from './socketListener.js';

function Temperature(props) {
  const {sensor} = props;
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    const savedTemp = localStorage.getItem(`temp-${sensor}`);
    if (savedTemp) {
      setTemp(JSON.parse(savedTemp));
    }
  }, [sensor]);

  useEffect(() => {
    localStorage.setItem(`temp-${sensor}`, JSON.stringify(temp));
  }, [temp, sensor]);
  
  useEffect(() => {
    async function fetchData() {
      const status = await sensorStatus(sensor);
      if (status?.error) {
          console.error(status.error);  
      }else{
          if (status !== undefined) {
            const value = (typeof status === 'object' && status !== null) ? status.value ?? status : status;
            setTemp(value);
          }
      }
    }
    fetchData();

    const interval = setInterval(fetchData, 5000);

    const handleTemp = (data) => setTemp(typeof data === 'object' && data !== null ? data.value ?? data : data);
    addSocketListener(props.sensor, handleTemp);
    return () => {
      removeSocketListener(props.sensor, handleTemp);
      clearInterval(interval);
    };
  }, [props.sensor, sensor]); 

  return (
        <h1 style={{"fontSize":"4vw", "color":"#FF7C00"}}>{temp}°C</h1>
  )
}

export default Temperature;


