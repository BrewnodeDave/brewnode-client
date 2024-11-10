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

    <div>
      <div>{props.name}</div>
        <GaugeChart 
          animate={false}
          id={props.name}
          nrOfLevels={20}
          textColor={"black"}
          percent={percent}
          formatTextValue={v=>`${Math.trunc(v)}°C`}
        />
    </div>
  )
}

export default Temperature;
