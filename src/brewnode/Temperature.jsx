import React, { useEffect, useState } from 'react';

import '../App.css';
import GaugeChart from 'react-gauge-chart';

import {addSocketListener, removeSocketListener} from './socketListener.js';

function Temperature(props) {

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const handleTemp = (x) => setPercent((x.value/100));
    addSocketListener(props.sensor, handleTemp);
    return () => removeSocketListener(props.sensor, handleTemp);
  
  }, [props.sensor]); 

  return (
        <GaugeChart 
          animate={false}
          id={props.name}
          nrOfLevels={20}
          textColor={"black"}
          percent={percent}
          formatTextValue={v=>`${props.name} ${Math.trunc(v)}\xB0C`}
        />
  )
}

export default Temperature;
