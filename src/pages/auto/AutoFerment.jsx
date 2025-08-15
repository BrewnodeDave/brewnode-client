import {React, useContext, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Toggle from '../../common/Toggle.jsx';

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
    const deltaTemp = step.stepTemp? step?.stepTemp - prevTemp : 0;
    if (deltaTemp === 0) return [step]; // no ramp needed

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
    const recipeSteps = props.recipe?.fermentation?.steps 
      ? Object.entries(props.recipe.fermentation.steps).map(step => step[1]) 
      : [];
    
    let steps = [];  
    
    const prevStepTemp = recipeSteps.length===1 ? 19  : recipeSteps[0]?.stepTemp;
    recipeSteps.reduce((prev, curr) => {
      const rampedSteps = fermentStep(prev?.stepTemp, curr);
      steps = steps.concat(rampedSteps);
      return rampedSteps[rampedSteps.length-1];
    }, recipeSteps[0] ? {stepTemp: prevStepTemp} : [] );


    setMySteps(steps);
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
    <Box
      sx={{
        height: '100%',
        border: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Table
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 0, // Remove spacing between cells
            width: '100%',
            tableLayout: 'fixed',
            borderSpacing: 0,
            border: 0,
            borderCollapse: 'separate',
            '& .MuiTableCell-root': { borderBottom: 'none' }, // Remove row separators
          }}
        >
          <TableHead />
          <TableBody
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {props.recipe?.fermentation?.steps.map((step, i, arr) => (
              <TableRow
                key={i}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 0,
                  '& td': { fontSize: '1.2rem', borderBottom: 'none' }, // Remove row separators
                }}
              >
                <TableCell sx={{flex: 1 }}>{step.name}</TableCell>
                <TableCell sx={{ flex: 2 }}>{step2string(step)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Toggle
          displayName="Ferment"
          disabled={inProgress !== ''}
          onClick={ferment}
        />
      </Box>
    </Box>
  );
}

export default AutoFerment;