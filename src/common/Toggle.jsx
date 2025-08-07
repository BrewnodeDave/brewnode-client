/**
 * Toggle.jsx - A reusable toggle button component for controlling brewery devices.
 * It uses websockets to update its state and provides visual feedback to the user.
 */

import React, { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { addSocketListener, removeSocketListener } from "../brewnode/socketListener.js";
import { sensorStatus } from "../brewnode/server-api.js";

// Import server-api functions (assumed to handle communication with the brewery control system)
const server = require("../brewnode/server-api.js");

const sensorApi = sensorName => {
  switch (sensorName) {
    case "Pump Kettle":
      return server.PumpKettle;
    case "Pump Mash":
      return server.PumpMash;
    case "Pump Glycol":
      return server.PumpGlycol;
    case "Glycol Heater":
      return server.GlycolHeater;
    case "Glycol Chiller":
      return server.GlycolChiller;
    case "Valve Mash-in":
      return server.ValveMashIn;
    case "Valve Kettle-in":
      return server.ValveKettleIn;
    case "Valve Chiller wort-in":
      return server.ValveChillWortIn;
    case "Valve Chiller wort-out":
      return server.ValveChillWortOut;
    case "Kettle Heater":
      return server.Heater;
    default:
      return server[sensorName];
  }
}
/**
 * A toggle button component that controls a device in the brewery system.
 * @param {object} props - Component properties.
 * @param {string} props.sensorName - The name of the sensor associated with the toggle.
 * @param {string} props.displayName - The name to display on the toggle button.
 * @param {string} props.imageOn - Path to the image to display when the toggle is on.
 * @param {string} props.imageOff - Path to the image to display when the toggle is off.
 * @returns {JSX.Element} - The rendered toggle button.
 */
function Toggle(props) {
  const [selected, setSelected] = useState(false); // State for the toggle button (on/off).
  const { sensorName } = props;

  /**
   * Toggles the device state by calling the corresponding server-api function.
   */
  async function toggle() {
    try {
      await sensorApi(sensorName)(!selected); // Call the dynamic function from server-api.js
    } catch (error) {
      console.error(error);
    }
  }

  const handler = (x) => {
    const b = setSelected(x > 0);
    return b;
  }


  /**
   * useEffect hook for initializing the component and setting up the websocket listener.
   * Fetches the initial sensor status and updates the toggle state accordingly.
   * Sets up a websocket listener to update the toggle state whenever the sensor value changes.
   */
  useEffect(() => {
    async function fetchData() {
      const watts = await sensorStatus(sensorName);
      if (watts.error) {
        console.error(watts.error);
      } else {
        if (watts !== undefined) {
          setSelected(watts > 0);
        }
      }
    }

    fetchData();

    addSocketListener(sensorName, handler); // Subscribe to websocket updates for the sensor.
    console.log("Listen for",sensorName);

    // Cleanup function to remove the websocket listener when the component unmounts.
    return function (){
      console.log("remove", sensorName);
      removeSocketListener(sensorName, handler);
    }

  }, [selected, sensorName]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 3, marginLeft: "0px" }}>
          <ToggleButton
            style={{
              margin: "10px",
              borderRadius: "50%", // Circular button.
              border: selected ? "5px solid red" : "5px solid blue",
              backgroundColor: selected ? "#080808" : "#484848",
              color: "#FFFFFF",
              fontSize: "vw", // Scales text with viewport width
              fontWeight: "bold",
              width: "18vh",
              height: "18vh",
              backgroundImage: `url(${selected ? props.imageOn : props.imageOff})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            value="check"
            selected={selected}
            onChange={toggle}
          >
            <span style={{ fontSize: "2.2vw", fontWeight: "bold" }}>
              {props.displayName}
            </span>
          </ToggleButton>
        </div>
      </div>
    </div>
  );
}

export default Toggle;
