import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

import * as server from './server-api.js';
import { addSocketListener } from './socketListener.js';
import { MyContext } from '../App';

const tempMarks = [
  { value: 50, label: '50°C' },
  { value: 60, label: '60°C' },
  { value: 70, label: '70°C' },
  { value: 80, label: '80°C' },
  { value: 90, label: '90°C' },
  { value: 100, label: '100°C' },
];

const minMarks = [
  { value: 0, label: '0m' },
  { value: 10, label: '10m' },
  { value: 20, label: '20m' },
  { value: 30, label: '30m' },
  { value: 40, label: '40m' },
  { value: 50, label: '50m' },
  { value: 60, label: '60m' },
];

function KettleTemp() {
  const { inProgress } = useContext(MyContext);
  const defaultKettle = { temp: 60, mins: 10 };
  const [temp, setTemp] = useState(defaultKettle.temp);
  const [mins, setMins] = useState(defaultKettle.mins);

  const valuetext = (value) => `${value}°C`;

  addSocketListener('remainingKettleMinutes', ({ value }) => {
    setMins(value);
  });

  return (
    <Box
      sx={{
        border: 2,
        padding: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Slider
        aria-label="Kettle Temperature"
        style={{ width: '100%' }}
        defaultValue={defaultKettle.temp}
        valueLabelDisplay="on"
        disabled={inProgress !== ''}
        onChange={v => setTemp(v.target.value)}
        marks={tempMarks}
        getAriaValueText={valuetext}
        step={1}
        min={50}
        max={100}
        value={temp}
      />
      <Slider
        aria-label="Kettle Minutes"
        style={{ width: '100%' }}
        defaultValue={defaultKettle.mins}
        valueLabelDisplay="on"
        onChange={v => setMins(v.target.value)}
        marks={minMarks}
        disabled={inProgress !== ''}
        step={1}
        min={0}
        max={60}
        value={mins}
      />
      <Box>
        <Button
          variant="contained"
          style={{ fontSize: '2vw', width: '100%' }}
          disabled={inProgress !== ''}
          size="large"
          onClick={async () => {
            await server.kettleTemp(temp, mins);
          }}
        >
          Kettle
        </Button>
      </Box>
    </Box>
  );
}

export default KettleTemp;