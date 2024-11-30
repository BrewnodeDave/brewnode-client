import React, { useEffect, useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";

import { addSocketListener, removeSocketListener } from "./socketListener.js";

import Sensor from '../common/Sensor.jsx';

const server = require("../common/server-api");

function Heater() {
  const [selected, setOn] = useState(false);  

  async function toggle() {
    try {
      await server['Heater'](!selected);
    } catch (error) {
      console.error(error);
    }
  }

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
          backgroundColor: selected ? "#ff2020" : "#8bc34a",
          color: "#000000",
          fontSize: "30px",
          width: "100%",
          height: "100%",
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
