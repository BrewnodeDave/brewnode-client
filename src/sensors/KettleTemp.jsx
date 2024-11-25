import React, { useEffect, useState } from "react";

import { sensorStatus } from "../common/server-api";

import "../App.css";

import {
  addSocketListener,
  removeSocketListener,
} from "../brewnode/socketListener.js";

function Sensor(props) {
  const [value, setValue] = useState("?");

  useEffect(() => {
    async function fetchData() {
        const status = await sensorStatus();
        const x = status.find((s) => s.name === props.name);
        if (x.value !== undefined) {
            setValue(x.value);
        }
    }
    
    fetchData();
    
    const handler = (x) => setValue(x.value);
    addSocketListener(props.name, handler);
    return () => removeSocketListener(props.name, handler); 

  }, [props.name]);

  return <span>{value}</span>;
}

export default Sensor;
