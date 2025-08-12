import {React, useState, useContext} from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Toggle from '../common/Toggle.jsx';
import * as server from './server-api.js';

import {MyContext } from '../App';

import {addSocketListener} from './socketListener.js';

const tempMarks = [
  {value: 0, label: '0°C'},
  {value: 5, label: '5°C'},
  {value: 10,label: '10°C'},
  {value: 15,label: '15°C'},
  {value: 20,label: '20°C'},
  {value: 25,label: '25°C'},
  {value: 30,label: '30°C'},
];

const dayMarks = [
  {value: 0,label: '0'},
  {value: 5,label: '5 Days'},
  {value: 10,label: '10 Days'},
  {value: 15,label: '15 Days'}
];

function Ferment() {
  const {inProgress, setInProgress} = useContext(MyContext);
  const defaults = {
    stepTemp:19,
    stepTime:7
  }

  const [stepTemp, setTemp] = useState(defaults?.stepTemp);
  const [stepTime, setTime] = useState(defaults?.stepTime);

  addSocketListener('remainingFermentDays', ({value}) => setTime(value));

  return (
    <Box
      sx={{
        border: 2,
        padding: 2,
        height: '37vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Slider
        color="secondary"
        aria-label="Always visible"
        sx={{
          marginLeft: 1,
          marginTop: 5,
          width: "95%",
          '& .MuiSlider-track': { height: 30 },
          '& .MuiSlider-rail': { height: 10 },
          '& .MuiSlider-markLabel': { fontSize: '1.5rem' } // Increase label size
        }}
        defaultValue={defaults?.stepTemp}
        valueLabelDisplay="on"
        disabled={typeof inProgress === 'number'}
        onChange={v=>setTemp(v.target.value)}
        marks={tempMarks}
        step={1}
        min={0}
        max={30}
      />
      <Slider
        color="secondary" 
        aria-label="Always visible"
        sx={{
          marginLeft: 1,
          marginTop: 5,
          marginBottom: 5,
          width: "95%",
          '& .MuiSlider-track': { height: 30 },
          '& .MuiSlider-rail': { height: 10 },
          '& .MuiSlider-markLabel': { fontSize: '1.5rem' } // Increase label size
        }}
        defaultValue={defaults.stepTime}
        valueLabelDisplay="on"
        onChange={v=>setTime(v.target.value)}
        marks={dayMarks}
        disabled={typeof inProgress === 'number'}
        step={1}
        min={0}
        max={15}
        value={stepTime}
      />
      <Box>
        <Toggle
          borderRadius="0%"
          width="100%"
          height="60%"
          displayName="Ferment"
          disabled={inProgress!==''}
          onClick={async () => {
            await ferment(stepTemp, stepTime);
          }}/>
      </Box>
    </Box>
  );

  async function ferment(stepTemp, stepTime) {
    try {
      const steps = [{stepTemp, stepTime}];
      const response = await server.ferment(steps);
      return response.data;
    } catch (error) {
      setInProgress(error);
      console.error(error);
      return error;
    }
  }
}

export default Ferment;