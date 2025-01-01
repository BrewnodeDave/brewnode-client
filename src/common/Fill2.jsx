import {React, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';

import * as server from './server-api.js';

import {addSocketListener} from '../brewnode/socketListener.js';

function Fill2() {
  const defaults = {litres:0}
  const [litres, setLitres] = useState(defaults.litres);
  const [selected, setSelected] = useState(false); // State for the toggle button (on/off).

  addSocketListener('remainingFillLitres', (value) => {
    setLitres(value);
  });

  async function fill() {
    if (!selected){
      try {
        const response = await server.fill(litres);
        setSelected(false);
        return response.data;
      } catch (error) {
        setSelected(false);
        console.error(error);
        return error;    
      }
    } 
  }
  
  return (
    <Box sx={{ border: 0, padding:0 }}>
      <h1 style={{"fontSize":"50px", "color":"#FF7C00"}}>{litres}L</h1>
      <Button 
        variant="contained" 
        onClick={v=>setLitres(litres - 1)}
        style={{
            margin: "10px",
            borderRadius: "50%", // Circular button.
            border: selected ? "5px solid red" : "5px solid blue",
            backgroundColor: selected ? "#080808" : "#484848",
            color: "#FFFFFF",
            fontSize: "50px",
            fontWeight: "bold",
            width: "80px",
            height: "80px",
            // backgroundImage: `url(${selected ? props.imageOn : props.imageOff})`,
            backgroundSize: "contain", // Ensure the image covers the button.
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
      > - </Button>
      <Button 
        variant="contained" 
        onClick={v=>setLitres(litres + 1)}
        style={{
            margin: "10px",
            borderRadius: "50%", // Circular button.
            border: selected ? "5px solid red" : "5px solid blue",
            backgroundColor: selected ? "#080808" : "#484848",
            color: "#FFFFFF",
            fontSize: "50px",
            fontWeight: "bold"  ,
            width: "80px",
            height: "80px",
            // backgroundImage: `url(${selected ? props.imageOn : props.imageOff})`,
            backgroundSize: "contain", // Ensure the image covers the button.
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
      > + </Button>
      <ToggleButton
        style={{
          margin: "10px",
          borderRadius: "50%", // Circular button.
          border: selected ? "5px solid red" : "5px solid blue",
          backgroundColor: selected ? "#080808" : "#484848",
          color: "#FFFFFF",
          fontSize: "20px",
          fontWeight: "bold"  ,
          width: "130px",
          height: "130px",
          // backgroundImage: `url(${selected ? props.imageOn : props.imageOff})`,
          backgroundSize: "contain", // Ensure the image covers the button.
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        value="check"
        selected={selected}
        onChange={fill}
      >Fill</ToggleButton> 
    </Box>
  );
}

export default Fill2;