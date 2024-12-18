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
        <h1 style={{"margin":"0px","fontSize":"50px", "color":"#FF7C00"}}>{temp}°C</h1>
  )
}

export default Temperature;


