import {React, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

import {MyContext } from '../App';
import * as server from '../common/server-api';

const marks = [
  {value: 0,label: '0L'},
  {value: 10,label: '10L'},
  {value: 20,label: '20L'},
  {value: 30,label: '30L'},
  {value: 40,label: '40L'},
  {value: 50,label: '50L'},
];


function Fill() {
  const {inProgress, setInProgress } = useContext(MyContext);

  const defaults = {litres:19}
  const [litres, setLitres] = useState(defaults.litres);

  /**
   * @param {number} litres
   */
  async function fill(litres) {
    try {
      setInProgress(`Filling Kettle with ${litres}L ...`);   

      const response = await server.fill(litres);
      setInProgress('');   

      return response.data;
    } catch (error) {
      console.error(error);
    } 
  }
  
  return (
    <Box sx={{ border: 1, padding:2 }}>
      <Slider
        style={{ width: "100%", height: "100%" }}
        defaultValue={defaults.litres}
        disabled={inProgress!==''}
        valueLabelDisplay="on"
        onChange={v=>setLitres(v.target.value)}
        step={1}
        marks={marks}
        max={50}
      />
      <Button variant="contained"
        style={{ fontSize:"30px",width: "100%", height: "100%" }}
        size='large'
        disabled={inProgress!==''}
        onClick={() => {
          fill(litres);
        }}>Fill
      </Button>
    </Box>
  );
}

export default Fill;