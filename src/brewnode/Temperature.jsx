import React, { useEffect, useState } from 'react';

import '../App.css';
import GaugeChart from 'react-gauge-chart';

import SocketListener from './socketListener.js';

function Temperature(props) {

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    SocketListener(props.sensor, (/** @type {{ value: number; }} */ x) => {
      setPercent((x.value/100));
    });
   
    return function cleanup (){
      console.log("temp stop")
    }
  });

  return (
        <GaugeChart 
          animate={false}
          id={props.name}
          nrOfLevels={20}
          textColor={"black"}
          percent={percent}
          formatTextValue={v=>`${props.name} ${v}\xB0C`}
        />
  )
}

export default Temperature;
