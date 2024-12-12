import React, { useEffect, useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";

import {
  addSocketListener,
  removeSocketListener,
} from "../brewnode/socketListener.js";

import { sensorStatus } from "./server-api.js";

const server = require("./server-api.js");

function Toggle(props) {
  const [selected, setSelected] = useState(false);  
  const [sensorValue, setValue] = useState("?");

  const {sensorName} = props;
  async function toggle() {
    try {
      await server[sensorName](!selected);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const status = await sensorStatus();
      if (status.error) {
          console.error(status.error);  
      } else { 
        const x = status.find((s) => s.name === sensorName);
        if (x?.value !== undefined) {
            setValue(x.value);
            setSelected(x.value === "Opened" || x.value === "ON");
        }
      }
    }
    fetchData();

    const handler = (x) => {
      setValue(x.value);
      setSelected(x.value === "Opened" || x.value === "ON");
    }
  
    addSocketListener(sensorName, handler);
    return () => removeSocketListener(sensorName, handler); 
  }, [sensorName, sensorValue]);
 
  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          
          <div style={{ flex: 3, marginLeft: '10px' }}>
            <ToggleButton
              style={{
                margin: "10px",
                borderRadius: "50%", // Make the button circular
                border: selected ? "5px solid red" : "5px solid blue",
                backgroundColor: selected ? "#080808" : "#484848",
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: "bold",
                width: "100px",
                height: "100px",
                backgroundImage: `url(${selected ? props.imageOn : props.imageOff})`,
                backgroundSize: 'contain', // Ensure the image covers the entire button
                backgroundRepeat: 'no-repeat', // No repeating the image
                backgroundPosition: 'center', // Center the image
              }}
      
              value="check"
              selected={selected}
              onChange={toggle}
            >{props.displayName}</ToggleButton>
          </div>
        </div>
    </div>
  );

}

export default Toggle;
