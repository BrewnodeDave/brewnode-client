import {React, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

import {MyContext } from '../App';

import {addSocketListener} from './socketListener.js';

import * as server from '../common/server-api';

const marks = [
  {value: 0, label: '0m'},
  {value: 30,label: '30m'},
  {value: 60,label: '60m'},
  {value: 90,label: '90m'}
];

function Boil() {
  const {inProgress, setInProgress} = useContext(MyContext);

  const defaults = {
    mins:0
  }

  const [mins, setMins] = useState(defaults.mins);

  addSocketListener('remainingBoilMinutes', ({value}) => {
    return setMins(value);
  });

  async function boil(mins) {
    try {
      const response = await server.boil(mins);
      return response.data;
    } catch (error) {
      setInProgress(error);   
      console.error(error);
      return error;    
    } 
  }

  return (
    <Box sx={{ border: 1, padding:2}}>
      <Slider
        size="medium"
        style={{ width: "100%", height: "50px" }}
        valueLabelDisplay="on" 
        aria-label="MY LABEL"
        defaultValue={defaults.mins}
        step={5} 
        marks={marks}
        disabled={inProgress!==''}
        onChange={v=>setMins(v.target.value)}
        max={90}
        value={mins}
      />
      <Button variant="contained"
        style={{ fontSize:"30px",width: "100%", height: "100%" }}
        size='large'
        disabled={inProgress!==''}
        onClick={() => {
          boil(mins);
        }}>Boil
      </Button>
    </Box>
  );

}

export default Boil;