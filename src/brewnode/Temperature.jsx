import React, { useEffect, useState } from 'react';

import { sensorStatus } from "../common/server-api.js";

import '../common/App.css';


import {addSocketListener, removeSocketListener} from './socketListener.js';

function Temperature(props) {
  const {sensor} = props;
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const status = await sensorStatus(sensor);
      if (status.error) {
          console.error(status.error);  
      }else{
          if (status !== undefined) {
            setTemp(status);
          }
      }
    }
    fetchData(true);

    addSocketListener(props.sensor, setTemp);
    return () => removeSocketListener(props.sensor, setTemp);
  }, [props.sensor, sensor]); 

  return (
        <h1 style={{"margin":"0px","fontSize":"50px", "color":"#FF7C00"}}>{temp}°C</h1>
  )
}

export default Temperature;


