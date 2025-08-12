import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Toggle from '../common/Toggle.jsx';
import { MyContext } from '../App';
import { addSocketListener } from './socketListener.js';
import * as server from './server-api.js';

const marks = [
  { value: 0, label: '0m' },
  { value: 30, label: '30m' },
  { value: 60, label: '60m' },
  { value: 90, label: '90m' }
];

function Boil() {
  const { inProgress, setInProgress } = useContext(MyContext);

  const defaults = { mins: 0 };
  const [mins, setMins] = useState(defaults.mins);

  addSocketListener('remainingBoilMinutes', ({ value }) => {
    setMins(value);
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
    <Box
      sx={{
        border: 2,
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Slider
        size="medium"
        color="secondary"
        sx={{
          marginBottom: 5,
          marginTop: 5,
          marginLeft: 5,
          width: "85%",
          '& .MuiSlider-track': { height: 30 },
          '& .MuiSlider-rail': { height: 10 },
          '& .MuiSlider-markLabel': { fontSize: '1.5rem' } // Increase label size
        }}
        valueLabelDisplay="on"
        aria-label="Boil Minutes"
        defaultValue={defaults.mins}
        step={5}
        marks={marks}
        disabled={typeof inProgress === 'number'}
        onChange={v => setMins(v.target.value)}
        max={90}
        value={mins}
      />
      <Box>
        <Toggle
          borderRadius="0%"
          width="95%"
          height="60%" 
          displayName="Boil"
          disabled={inProgress!==''}
          onClick={async () => await boil(mins)}/>
      </Box>
    </Box>
  );
}

export default Boil;