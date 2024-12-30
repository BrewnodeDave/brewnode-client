import React, { useEffect, useState } from "react";

import { sensorStatus } from "./server-api.js";

import "../common/App.css";

import {
  addSocketListener,
  removeSocketListener,
} from "../brewnode/socketListener.js";

function Sensor(props) {
  const {name, cb, noDisplay} = props;

  const [value, setValue] = useState("?");

  useEffect(() => {
    //get current status on load
    async function fetchData(force) {
        const status = await sensorStatus(name, force);
        if (status.error) {
            console.error(status.error);  
        }else{
            if (status !== undefined) {
                setValue(status);
            }
        }
    }
    
    console.log("Sensor useEffect", name);
    fetchData(false);
    
    const handler = (x) => {
      if (!noDisplay) {
        setValue(x);
      }
      if (cb) cb(x);
     
    }
  
    addSocketListener(name, handler);
    return () => removeSocketListener(name, handler); 

  }, [name, cb, noDisplay]);

  return <span>{value}</span>;
}

export default Sensor;
