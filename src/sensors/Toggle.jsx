import React, { useEffect, useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";

import Sensor from './sensor.jsx';

const server = require("../common/server-api.js");

function Toggle(props) {
  const [on, setOn] = useState(false);  
  const [sensorValue] = useState("?");

  async function toggle() {
    try {
      const off = !on
      await server[props.sensorName](off);
      setOn(off);
      return off;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
  }, [sensorValue]);

  return (
    <div>
      <ToggleButton
        style={{
          backgroundColor: on ? "#ff2020" : "#8bc34a",
          color: "#000000",
          fontSize: "30px",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${on ? props.imageOn : props.imageOff})`,
          backgroundSize: 'contain', // Ensure the image covers the entire button
          backgroundRepeat: 'no-repeat', // No repeating the image
          backgroundPosition: 'center', // Center the image
        }}
        size="large"
        value="check"
        selected={on}
        onChange={toggle}
      >
        {props.sensorName}
        <Sensor name={props.sensorName}/>
      </ToggleButton>
    </div>
  );

}

export default Toggle;
