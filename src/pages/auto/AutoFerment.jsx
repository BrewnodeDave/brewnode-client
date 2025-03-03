import {React, useContext, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'     ;

import {MyContext } from '../../App';
import * as server from '../../brewnode/server-api';  

function fermentStep(_prevTemp, step){
  if ((step.ramp === null) || (step.ramp === 0)){
    return [step];
  }else{
    let prevTemp = _prevTemp;
    const deltaTemp = step.stepTemp - prevTemp;
    
    const degreesPerStep = 1;
    const numSteps = Math.trunc(Math.abs(deltaTemp/degreesPerStep));
        
    const days = step.ramp;
    const daysPerStep = Math.abs(days / numSteps);
    const degsPerStep = deltaTemp / numSteps;
    
    const rampSteps = [];
    for (let i=0; i<numSteps; i++){
      rampSteps.push({
        stepTime : daysPerStep,
        stepTemp: prevTemp + degsPerStep
      });
      prevTemp += degsPerStep;      
    }

    return rampSteps;
  }
}
function AutoFerment(props) {
  const {inProgress, setInProgress} = useContext(MyContext);
  const [mySteps, setMySteps] = useState([]);

  const step2string = ({stepTemp, stepTime, ramp}) => `${ramp ? `(ramp ${ramp}d)` : ""} ${stepTemp}°C for ${stepTime}d`;

  useEffect(() => {
    const steps = props.recipe?.fermentation?.steps 
      ? Object.entries(props.recipe.fermentation.steps).map(step => step[1]) 
      : [];
    
    let xxxx = [];  
    steps.reduce((prev, curr) => {
      const rampedSteps = fermentStep(prev.stepTemp, curr);
      xxxx = xxxx.concat(rampedSteps);
      return rampedSteps[rampedSteps.length-1];
    }, steps[0] ? {stepTemp: steps[0].stepTemp} : [] );


    setMySteps(xxxx);
  },[props.recipe]);

  async function ferment() {
    if (mySteps.length === 0) return;
    try {
      setInProgress(`Fermenting ...`);   

      const response = await server.ferment(mySteps);
      setInProgress('');   
  
      return response.data;
    } catch (error) {
      console.error(error);
    } 
  }

  return (
    <Box sx={{ border: 1, padding:2 }}>
      <Table>
        <TableHead>
        </TableHead>
        <TableBody>
          {props.recipe?.fermentation?.steps.map((step,i) => 
          <TableRow >
            <TableCell  sx={{fontSize:24}}>{step.name}</TableCell>
            <TableCell  sx={{fontSize:24}}>{step2string(step)}</TableCell>
          </TableRow>        
          )}
        </TableBody > 
      </Table>

      <Button variant="contained"
        style={{ fontSize:"30px",width: "100%", height: "100%" }}
        size='large'
        onClick={ferment}
        disabled={inProgress!==''}
          >Ferment
      </Button>
    </Box>
  );
}

export default AutoFerment;