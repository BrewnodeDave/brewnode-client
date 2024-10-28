import {React, useState, useContext} from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

import * as server from '../common/server-api';

import {MyContext } from '../App';

const tempMarks = [
  {value: 0, label: '0°C'},
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

    const [stepTemp, setTemp] = useState(defaults.stepTemp);
    const [stepTime, setTime] = useState(defaults.stepTime);
  
  return (
    <Box sx={{ border: 1, padding:2}}>
        <Slider
            aria-label="Always visible"
            style={{ width: "100%", height: "100%" }}
            defaultValue={defaults.stepTemp}
            valueLabelDisplay="on"
            disabled={inProgress!==''}
            onChange={v=>setTemp(v.target.value)}
            marks={tempMarks}
            step={1}
            min={0}
            max={30}
        />
        <Slider
            aria-label="Always visible"
            style={{ width: "100%", height: "100%" }}
            defaultValue={defaults.stepTime}
            valueLabelDisplay="on"
            onChange={v=>setTime(v.target.value)}
            marks={dayMarks}
            disabled={inProgress!==''}
            step={1}
            min={0}
            max={15}
        />
        <Box>
          <Button variant="contained"
              style={{ fontSize:"30px",width: "50%", height: "100%" }}
              disabled={inProgress!==''}
              size='large'
              onClick={() => {
                ferment(stepTemp, stepTime);
          }}>Cold</Button>

          <Button variant="contained"
              style={{ fontSize:"30px",width: "50%", height: "100%" }}
              disabled={inProgress!==''}
            size='large'
            onClick={() => {
              chill(stepTemp, stepTime);
          }}>Hot</Button>

        </Box>
    </Box>
  );

  async function ferment(stepTemp, stepTime) {
    try {
        setInProgress('fermenting ...');   
        const steps = [{stepTemp, stepTime}];
        const response = await server.ferment(steps);
        setInProgress('');   
        return response.data;
    } catch (error) {
      console.error(error);
    } 
  }

  async function chill(stepTemp, stepTime) {
    try {
        setInProgress('chilling ...');   
        const steps = [{stepTemp, stepTime}];
        const response = await server.chill(steps);
        setInProgress('');   
        return response.data;
    } catch (error) {
      console.error(error);
    } 
  }

}

export default Ferment;