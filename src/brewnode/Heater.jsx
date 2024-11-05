import React, { useEffect, useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";

import { addSocketListener, removeSocketListener } from "./socketListener.js";

const server = require("../common/server-api");

function Heater() {
  const [on, setOn] = useState(false);  
  const [power, setPower] = useState(0);  

  useEffect(() => {
    const handleHeaterStatus = (x) => setOn(x.value);
    addSocketListener("heater", handleHeaterStatus);
    const handlePowerStatus = (x) => setPower(x.value);
    addSocketListener("power", handlePowerStatus);

    // Cleanup function to remove the listener
    return () => {
      removeSocketListener('power', handlePowerStatus);
      removeSocketListener('heater', handleHeaterStatus);
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
        Heat ({power}W)
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
