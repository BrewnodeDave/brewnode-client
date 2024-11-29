import React, { useEffect, useState } from 'react';

import '../App.css';

import {addSocketListener, removeSocketListener} from './socketListener.js';

function Temperature(props) {

  const [temp, setTemp] = useState(0);

  useEffect(() => {
    const handleTemp = (x) => {
      setTemp(x.value);
    }
    addSocketListener(props.sensor, handleTemp);
    return () => removeSocketListener(props.sensor, handleTemp);
  }); 

  return (
    <div>
      <div>{props.name}</div>
      <p style={{ fontSize: '24px', color:'black' }}>{temp}°C</p>
    </div>
  )
}

export default Temperature;
