
import {React, useContext} from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toggle from '../../common/Toggle.jsx'; 
import {MyContext } from '../../App';

import * as server from '../../brewnode/server-api';
 
function AutoMash(props) {
    const {inProgress, setInProgress} = useContext(MyContext);

    const steps = props.recipe?.mash?.steps 
        ? Object.entries(props.recipe.mash?.steps).map(step => step[1]) 
        : [];

    const step2string = ({stepTemp, stepTime}) => `${stepTemp}°C for ${stepTime}m`;

    const mySteps = steps.map(step => ({tempC:step?.stepTemp, mins:step?.stepTime}));

    async function mash() {
        if (steps.length === 0) return;
        try {
            setInProgress(`Mashing ...`);   

            const response = server.mash(mySteps);
            setInProgress('');   
        
            return response.data;
        } catch (error) {
            console.error(error);
        } 
    }

    return (
      <Box sx={{
        height: '100%',
        border: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}>
        <Table>
          <TableHead>
          </TableHead>
          <TableBody>
            { steps.map(step => 
            <TableRow >
              <TableCell sx={{"fontSize":"4vh"}}>{step.name}</TableCell>
              <TableCell sx={{"fontSize":"4vh"}}>{step2string(step)}</TableCell>
            </TableRow>        
            )}
          </TableBody > 
        </Table>
        <Toggle 
          displayName="Mash"
          disabled={inProgress!==''}
          onClick={mash}/>
        </Box>
    );
}

export default AutoMash;