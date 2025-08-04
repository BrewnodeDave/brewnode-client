import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

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
        padding: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Slider
        size="medium"
        style={{ width: "100%" }}
        valueLabelDisplay="on"
        aria-label="Boil Minutes"
        defaultValue={defaults.mins}
        step={5}
        marks={marks}
        disabled={inProgress !== ''}
        onChange={v => setMins(v.target.value)}
        max={90}
        value={mins}
      />
      <Box>
        <Button
          variant="contained"
          style={{ fontSize: "2vw", width: "100%" }}
          size="large"
          disabled={inProgress !== ''}
          onClick={() => boil(mins)}
        >
          Boil
        </Button>
      </Box>
    </Box>
  );
}

export default Boil;