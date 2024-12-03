import React, { useEffect, useState } from "react";

import { sensorStatus } from "./server-api.js";

import "../common/App.css";

import {
  addSocketListener,
  removeSocketListener,
} from "../brewnode/socketListener.js";

function Sensor(props) {
  const {name, cb} = props;

  const [value, setValue] = useState("?");

  useEffect(() => {
    //get current status on load
    async function fetchData() {
        const status = await sensorStatus();
        const x = status.find((s) => s.name === name);
        if (x.value !== undefined) {
            setValue(x.value);
        }
    }
    
    fetchData();
    
    const handler = (x) => {
      setValue(x.value);
      if (cb) cb(x.value);
    }
  
    addSocketListener(name, handler);
    return () => removeSocketListener(name, handler); 

  }, [name, cb]);

  return <span>{value}</span>;
}

export default Sensor;
