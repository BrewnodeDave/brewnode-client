import {React, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

import {MyContext } from '../App';

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

  async function boil(mins) {
    try {
      setInProgress(`Boiling for ${mins} mins...`);        
      const response = await server.boil(mins);
      setInProgress(false);   
         
      return response.data;
    } catch (error) {
      console.error(error);
    } 
  }

  return (
    <Box sx={{ border: 1, padding:2}}>
      <Slider
        size="medium"
        style={{ width: "100%", height: "100%"}}
        valueLabelDisplay="on" 
        aria-label="MY LABEL"
        defaultValue={defaults.mins}
        step={5} 
        marks={marks}
        disabled={inProgress!==''}
        onChange={v=>setMins(v.target.value)}
        max={90}
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