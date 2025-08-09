import {React/*, useContext*/} from 'react';
import Box from '@mui/material/Box';
//import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

//import {MyContext } from '../../App';


function Process(props) {
  const trunc = x => Math.trunc(x * 1000) / 1000;
  return (
    <Box sx={{
        height: '70vh',
        border: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}>
      <Table>
        <TableHead sx={{fontSize:'5vh', fontWeight:'bold'}}>
        </TableHead>
        <TableBody>
          <TableRow>
              <TableCell sx={{"fontSize":"4vh"}}>Boil</TableCell>
              <TableCell sx={{"fontSize":"4vh"}}>{props?.recipe?.boilTime}mins</TableCell>
          </TableRow>
          <TableRow>
              <TableCell sx={{"fontSize":"4vh"}}>OG</TableCell>
              <TableCell sx={{"fontSize":"4vh"}}>{trunc(props?.recipe?.og)}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell sx={{"fontSize":"4vh"}}>FG</TableCell>
              <TableCell sx={{"fontSize":"4vh"}}>{trunc(props?.recipe?.fg)}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell sx={{"fontSize":"4vh"}}>ABV</TableCell>
              <TableCell sx={{"fontSize":"4vh"}}>{props?.recipe?.abv}%</TableCell>
          </TableRow>
        </TableBody > 
      </Table>
    </Box>
  );
}

export default Process;
