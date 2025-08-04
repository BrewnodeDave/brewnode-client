import {React, useContext} from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';

import Button from '@mui/material/Button';

import * as server from '../../brewnode/server-api';
import {MyContext } from '../../App';
  
function AutoKettleTemp(props) {
    const {inProgress, setInProgress} = useContext(MyContext);
    
    async function setKettleTemp(tempC) {
      try {
        setInProgress(`Heating Kettle to ${tempC}C`);   
        const response = await server.kettleTemp(tempC, 0);  
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
        <TableHead sx={{fontSize:24}}>{props.temp}°C</TableHead>
      </Table>
      <Button 
          variant="contained"
          style={{ fontSize:"6vh", width: "100%", height: "10vh" }}
          size='large'
          disabled={inProgress!==''}
          onClick={() => {
            setKettleTemp(props.temp);
          }}>Strike
      </Button>
    </Box>
  );

}

export default AutoKettleTemp;