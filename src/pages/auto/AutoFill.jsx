import {React, useContext, useEffect} from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

import {MyContext } from '../../App';
import * as server from '../../common/server-api';

function AutoFill(props) {
  const {inProgress, setInProgress} = useContext(MyContext);
  
  useEffect(() => {
    return () => {}; 
  }, []);

  async function fill() {
    try {
      const response = await server.fill(props.strikeLitres);
      return response.data;
    } catch (error) {
      setInProgress(error);   
      console.error(error);
      return error;    
    } 

  }
  
  return (
    <Box sx={{ border: 1, padding:2 }}>
      <Table>
          <TableHead>
          </TableHead>
          <TableBody>
            <TableRow >
              <TableCell sx={{fontSize:24}}>{props.strikeLitres}</TableCell>
            </TableRow>        
          </TableBody > 
        </Table>
        <Button 
            variant="contained"
            style={{ fontSize:"30px", width: "100%", height: "100%" }}
            size='large'
            disabled={inProgress!==''}
            onClick={fill}
              >Fill
        </Button>
    </Box>
  );
}

export default AutoFill;