import React, { useEffect, useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";

import { addSocketListener, removeSocketListener } from "./socketListener.js";

import Sensor from '../common/sensor.jsx';

const server = require("../common/server-api");


function Heater() {
  const [on, setOn] = useState(false);  

  useEffect(() => {
    const handleHeaterStatus = (x) => setOn(x.value);
    addSocketListener("Heater", handleHeaterStatus);

    // Cleanup function to remove the listener
    return () => {
      removeSocketListener('Heater', handleHeaterStatus);
    };  
  });

  return (
    <div>
      <ToggleButton
        style={{
          backgroundColor: on ? "#ff2020" : "#8bc34a",
          color: "#000000",
          fontSize: "30px",
          width: "100%",
          height: "100%",
        }}
        size="large"
        value="check"
        selected={on}
        onChange={heat}
      >
        {" "}
        Heat (<Sensor name="Power"></Sensor>W)
      </ToggleButton>
    </div>
  );

  async function heat() {
    try {
      const response = await server.heat(!on);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Heater;
