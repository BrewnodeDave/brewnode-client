import React, { useEffect, useState } from 'react';

import '../App.css';
import GaugeChart from 'react-gauge-chart';

import {addSocketListener, removeSocketListener} from './socketListener.js';

function Power(props) {

  const [percent, setPercent] = useState(props.min);

  useEffect(() => {
    const handler = (x) => setPercent(x.value/(props.max-props.min));
    addSocketListener("Power", handler);
    return () => removeSocketListener("Power", handler);
  
  }); 

  return (

    <div>
      <div>{props.name}</div>
      <GaugeChart 
        animate={false}
        id="Power"
        nrOfLevels={10}
        textColor={"black"}
        percent={percent}
        formatTextValue={v=>`${Math.round(v*(props.max-props.min)/100)}W`}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-50px' }}>
        <span>{props.min}</span>
        <span>{props.max}</span>
      </div>  
    </div>
  )
}

export default Power;
