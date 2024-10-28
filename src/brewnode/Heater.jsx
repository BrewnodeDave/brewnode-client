import React, { useEffect, useState } from 'react';


import ToggleButton from '@mui/material/ToggleButton';

import SocketListener from './socketListener.js';

const server = require('../common/server-api');

function Heater() {

  const [on, setOn] = useState(false);

  useEffect(() => {
    SocketListener('heater', x => {
      setOn(x.value === 1 ? true : false);
    });

    return function cleanup() {
      console.log("temp stop")
    }
  });

  return (
    <div>
      <ToggleButton
        style={{ backgroundColor: on ? "#ff2020" : "#8bc34a", color: "#000000", fontSize: "30px", width: "100%", height: "100%" }}
        size='large'
        value="check"
        selected={on}
        onChange={heat}
      > Heat
      </ToggleButton>
    </div>
  );

  async function heat() {
    try {
      // setOn(!on);        

      const response = await server.heat({ on: !on });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Heater;