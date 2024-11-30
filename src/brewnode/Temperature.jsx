import React, { useEffect, useState } from 'react';

import '../common/App.css';

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
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '70px', fontWeight: 'bold' }}>
        {temp}°C
      </div>    
  )
}

export default Temperature;


