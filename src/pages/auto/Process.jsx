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
    <Box sx={{ border: 1, padding:2 }}>
      <Table>
        <TableHead>
        </TableHead>
        <TableBody>
          <TableRow>
              <TableCell sx={{fontSize:24}}>Boil</TableCell>
              <TableCell sx={{fontSize:24}} align="right">{props.recipe?.boilTime}m</TableCell>
          </TableRow>
          <TableRow>
              <TableCell sx={{fontSize:24}} >OG</TableCell>
              <TableCell sx={{fontSize:24}} align="right">{trunc(props.recipe?.og)}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell sx={{fontSize:24}}>FG</TableCell>
              <TableCell sx={{fontSize:24}} align="right">{trunc(props.recipe?.fg)}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell sx={{fontSize:24}}>ABV</TableCell>
              <TableCell sx={{fontSize:24}} align="right">{props.recipe?.abv}%</TableCell>
          </TableRow>
        </TableBody > 
      </Table>
    </Box>
  );
}

export default Process;
