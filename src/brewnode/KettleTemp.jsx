import {React, useState, useContext} from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

import * as server from '../common/server-api';

import {MyContext } from '../App';
  
const tempMarks = [
  {value: 50,label: '50°C'},
  {value: 60,label: '60°C'},
  {value: 70,label: '70°C'},
  {value: 80,label: '80°C'},
  {value: 90,label: '90°C'},
  {value: 100,label: '100°C'},
];

const minMarks = [
  {value: 0,label: '0m'},
  {value: 10,label: '10m'},
  {value: 20,label: '20m'},
  {value: 30,label: '30m'},
  {value: 40,label: '40m'},
  {value: 50,label: '50m'},
  {value: 60,label: '60m'},
];

function KettleTemp() {
    const {inProgress/*, setInProgress*/} = useContext(MyContext);
    const defaultKettle = {
      temp:60,
      mins:10
    }
    const [temp, setTemp] = useState(defaultKettle.temp);
    const [mins, setMins] = useState(defaultKettle.mins);
  
    function valuetext(value) {
      return `${value}°C`;
    }
    

    // async function setKettleTemp(temp, mins) {
    //   try {
    //     setInProgress(`Heating Kettle to ${temp} for ${mins}...`);   
    //     const response = await server.kettleTemp({temp, mins});  
    //     setInProgress('');   
  
    //     return response.data;
    //   } catch (error) {
    //     console.error(error);
    //   } 
    // } 


  return (
    <Box sx={{ border: 1, padding:2}}>
        <Slider
            aria-label="Always visible"
            style={{ width: "100%", height: "100%" }}
            defaultValue={defaultKettle.temp}
            valueLabelDisplay="on"
            disabled={inProgress!==''}
            onChange={v=>setTemp(v.target.value)}
            marks={tempMarks}
            getAriaValueText={valuetext}
            step={1}
            min={50}
            max={100}
        />
        <Slider
            aria-label="Always visible"
            style={{ width: "100%", height: "100%" }}
            defaultValue={defaultKettle.mins}
            valueLabelDisplay="on"
            onChange={v=>setMins(v.target.value)}
            marks={minMarks}
            disabled={inProgress!==''}
            step={1}
            min={0}
            max={60}
        />
        <Button variant="contained"
            style={{ fontSize:"30px",width: "100%", height: "100%" }}
            disabled={inProgress!==''}
            size='large'
            onClick={() => {
                server.kettleTemp(temp, mins);
        }}>Kettle</Button>
    </Box>
  );

}

export default KettleTemp;