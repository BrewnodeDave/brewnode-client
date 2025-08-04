import React, { useEffect, useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";

import { addSocketListener, removeSocketListener } from "./socketListener.js";

import Sensor from '../common/Sensor.jsx';

const server = require("../common/server-api");
const sensorName = "Kettle Heater";

function Heater() {
  const [selected, setOn] = useState(false);  

  async function toggle() {
    try {
      await server[sensorName](!selected);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const handleHeaterStatus = (x) => setOn(x.value);
    addSocketListener(sensorName, handleHeaterStatus);

    // Cleanup function to remove the listener
    return () => {
      removeSocketListener(sensorName, handleHeaterStatus);
    };  
  });

  return (
    <div>
      <ToggleButton
        style={{
          backgroundColor: selected ? "#ff2020" : "#8bc34a",
          color: "#000000",
          fontSize: "30vw",
          width: "100vw",
          height: "100vh",
        }}
        size="large"
        value="check"
        selected={selected}
        onChange={toggle}
      >
        {" "}
        Heat (<Sensor name="Power"></Sensor>W)
      </ToggleButton>
    </div>
  );
}

export default Heater;
