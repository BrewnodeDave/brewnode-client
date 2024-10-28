import {React, useContext} from 'react';

import Box from '@mui/material/Box';
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
        <Button variant="contained"
            style={{ fontSize:"30px",width: "100%", height: "100%" }}
            disabled={inProgress!==''}
            size='large'
            onClick={() => {
                setKettleTemp(props.temp);
        }}>Strike Temp = {props.temp}°C</Button>
    </Box>
  );

}

export default AutoKettleTemp;