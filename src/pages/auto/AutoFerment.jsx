import {React, useContext} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'     ;

import {MyContext } from '../../App';
import * as server from '../../common/server-api';  

function fermentStep(prevStep, step){
  if (step.ramp === null){
    return step;
  }else{
    const deltaTemp = step.stepTemp - prevStep.tempC;
    const daysPerDeg = step.ramp / deltaTemp;
    const numSteps = Math.trunc(Math.abs(deltaTemp));
    const daysPerStep = Math.abs(daysPerDeg / numSteps);
    const tempPerStep = deltaTemp / numSteps;
    

    const steps = new Array(numSteps);
    const foo = steps.reduce((prev, curr) => {
      steps.push({
        stepTemp: prev.tempC + tempPerStep,
        stepTime: prev.days + daysPerStep
      });
      return curr;
    }, prevStep);

    return foo;
  }
}
function AutoFerment(props) {
  const {inProgress, setInProgress} = useContext(MyContext);
  
  const steps = props.recipe?.fermentation?.steps 
    ? Object.entries(props.recipe.fermentation.steps).map(step => step[1]) 
    : [];

  const step2string = ({stepTemp, stepTime}) => `${stepTemp}°C for ${stepTime} days`;
  
  const mySteps = steps.reduce((prev, curr) => {
    const result = {
      tempC:curr.stepTemp, 
      days: curr.stepTime
    };

    const rampedSteps = fermentStep(prev,curr);
    return result;
  }, []);


  async function ferment() {
    if (steps.length === 0) return;
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
          { steps.map((step,i) => 
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