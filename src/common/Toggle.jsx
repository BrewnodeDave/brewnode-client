import React, { useEffect, useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";

// import Sensor from './sensor.jsx';


import {
  addSocketListener,
  removeSocketListener,
} from "../brewnode/socketListener.js";

import { sensorStatus } from "./server-api.js";

const server = require("./server-api.js");

function Toggle(props) {
  const [selected, setSelected] = useState(false);  
  const [sensorValue, setValue] = useState("?");

  async function toggle() {
    try {
      // const off = !on
      await server[props.sensorName](!selected);
      // setOn(off);
      // return off;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const status = await sensorStatus();
      const x = status.find((s) => s.name === props.sensorName);
      if (x.value !== undefined) {
          setValue(x.value);
          setSelected(x.value === "Opened" || x.value === "ON");
      }
    }
    fetchData();

    const handler = (x) => {
      setValue(x.value);
      setSelected(x.value === "Opened" || x.value === "ON");
    }
  
    addSocketListener(props.sensorName, handler);
    return () => removeSocketListener(props.sensorName, handler); 
  }, [sensorValue]);
 
  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ 
              flex: 1, 
              marginRight: '10px',
              fontSize: "20px",
              fontWeight: "bold", // Make text bold
              display: 'flex',
              alignItems: 'center', // Center text vertically
              justifyContent: 'center', // Center text horizontally
           }}>
            {props.displayName}
          </div>
          <div style={{ flex: 3, marginLeft: '10px' }}>
            <ToggleButton
              style={{
                backgroundColor: selected ? "#ff2020" : "#8bc34a",
                color: "#000000",
                fontSize: "30px",
                width: "100%",
                height: "100%", 
                backgroundImage: `url(${selected ? props.imageOn : props.imageOff})`,
                backgroundSize: 'contain', // Ensure the image covers the entire button
                backgroundRepeat: 'no-repeat', // No repeating the image
                backgroundPosition: 'center', // Center the image
              }}
              size="large"
              value="check"
              selected={selected}
              onChange={toggle}
            >
              {sensorValue}
            </ToggleButton>
          </div>
        </div>
    </div>
  );

}

export default Toggle;
