import {React, useContext, useEffect} from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';

import {MyContext } from '../../App';

import * as server from '../../brewnode/server-api';

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
    <Box sx={{
        height: '100%',
        border: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}>
      <Table>
      <TableHead sx={{fontSize:'5vh'}}>{props.strikeLitres} L</TableHead>
      </Table>
      <Button 
          variant="contained"
          style={{ fontSize:"5vh", width: "100%", height: "10vh" }}
          size='large'
          disabled={inProgress!==''}
          onClick={fill}
            >Fill
      </Button>
    </Box>
  );
}

export default AutoFill;