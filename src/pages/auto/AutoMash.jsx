
import {React, useContext} from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

import {MyContext } from '../../App';

import * as server from '../../common/server-api';
 
function AutoMash(props) {
    const {inProgress, setInProgress} = useContext(MyContext);

    const steps = props.recipe?.mash?.steps 
        ? Object.entries(props.recipe.mash.steps).map(step => step[1]) 
        : [];

    const step2string = ({stepTemp, stepTime}) => `${stepTemp}°C for ${stepTime}m`;

    const mySteps = steps.map(step => ({tempC:step.stepTemp, mins:step.stepTime}));

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
      <Box sx={{ border: 1, padding:2 }}>
        <Table>
          <TableHead>
          </TableHead>
          <TableBody>
            { steps.map(step => 
            <TableRow >
              <TableCell sx={{fontSize:24}}>{step.name}</TableCell>
              <TableCell sx={{fontSize:24}}>{step2string(step)}</TableCell>
            </TableRow>        
            )}
          </TableBody > 
        </Table>
   
        <Button 
            variant="contained"
            style={{ fontSize:"30px", width: "100%", height: "100%" }}
            size='large'
            disabled={inProgress!==''}
            onClick={mash}
              >Mash
        </Button>
        </Box>
    );
}

export default AutoMash;