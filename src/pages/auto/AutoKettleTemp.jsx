import {React, useContext} from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';

import Button from '@mui/material/Button';

import * as server from '../../common/server-api';
import {MyContext } from '../../App';
  
function AutoKettleTemp(props) {
    const {inProgress, setInProgress} = useContext(MyContext);
    
    async function setKettleTemp(temp) {
      try {
        setInProgress(`Heating Kettle to ${temp}`);   
        const response = await server.kettleTemp({temp, mins:0});  
        setInProgress('');   
  
        return response.data;
      } catch (error) {
        console.error(error);
      } 
    } 


  return (
    <Box sx={{ border: 1, padding:2}}>
      <Table>
        <TableHead sx={{fontSize:24}}>{props.temp}°C</TableHead>
      </Table>
      <Button 
          variant="contained"
          style={{ fontSize:"30px", width: "100%", height: "100%" }}
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