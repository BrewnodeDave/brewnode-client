/**
 * Toggle.jsx - A reusable toggle button component for controlling brewery devices.
 * It uses websockets to update its state and provides visual feedback to the user.
 */

import React, { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { addSocketListener, removeSocketListener } from "../brewnode/socketListener.js";
import { sensorStatus } from "./server-api.js";

// Import server-api functions (assumed to handle communication with the brewery control system)
const server = require("./server-api.js");

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
  const [sensorValue, setValue] = useState("?"); // State for the current sensor value.

  const { sensorName } = props;

  /**
   * Toggles the device state by calling the corresponding server-api function.
   */
  async function toggle() {
    try {
      await server[sensorName](!selected); // Call the dynamic function from server-api.js
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * useEffect hook for initializing the component and setting up the websocket listener.
   * Fetches the initial sensor status and updates the toggle state accordingly.
   * Sets up a websocket listener to update the toggle state whenever the sensor value changes.
   */
  useEffect(() => {
    async function fetchData() {
      const status = await sensorStatus(sensorName, true);
      if (status.error) {
        console.error(status.error);
      } else {
        if (status !== undefined) {
          setValue(status);
          setSelected(status === "Opened" || status === "ON");
        }
      }
    }

    console.log("Toggle useEffect", sensorName);
    fetchData();

    const handler = (x) => {
      setValue(x);
      setSelected(x === "Opened" || x === "ON");
    };

    addSocketListener(sensorName, handler); // Subscribe to websocket updates for the sensor.

    // Cleanup function to remove the websocket listener when the component unmounts.
    return () => removeSocketListener(sensorName, handler);
  }, [sensorName, sensorValue]);

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
              fontSize: "20px",
              fontWeight: "bold",
              width: "130px",
              height: "130px",
              backgroundImage: `url(${selected ? props.imageOn : props.imageOff})`,
              backgroundSize: "contain", // Ensure the image covers the button.
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            value="check"
            selected={selected}
            onChange={toggle}
          >
            {props.displayName}
          </ToggleButton>
        </div>
      </div>
    </div>
  );
}

export default Toggle;
