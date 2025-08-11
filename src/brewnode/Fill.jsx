import {React, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Toggle from '../common/Toggle.jsx';

import {MyContext } from '../App';
import * as server from './server-api.js';
import {addSocketListener} from './socketListener.js';

const marks = [
  {value: 0,label                         : '0L'},
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

  addSocketListener('remainingFillLitres', (x) => {
    setLitres(x);
  });

  /**
   * @param {number} litres
   */
  async function fill(litres) {
    try {
      const response = await server.fill(litres);
      return response.data;
    } catch (error) {
      setInProgress(error);   
      console.error(error);
      return error;    
    } 
  }
  
  return (
    <Box
      sx={{
        border: 2,
        padding: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Slider    
        color="secondary"                                                                                                             
        defaultValue={defaults.litres}
        sx={{ 
          marginTop: 5,
          marginLeft: 1,
          width: "95%",
          '& .MuiSlider-track': { height: 30 }, 
          '& .MuiSlider-rail': { height: 10 },
          '& .MuiSlider-markLabel': { fontSize: '1.5rem' } // Increase label size
        }}
        disabled={typeof inProgress === 'number'}
        valueLabelDisplay="on"
        onChange={v=>setLitres(v.target.value)}
        step={1}
        marks={marks}
        max={50}
        value={litres}
      />
      <Box>
         <Toggle
          width="100%"
          height="100%" 
          displayName="Fill"
          disabled={typeof inProgress === 'number'}
          onClick={async () => {
            await fill(litres);
          }}/>
      </Box>
    </Box>
  );
}

export default Fill;