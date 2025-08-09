import {React, useContext} from 'react';

import Box from '@mui/material/Box';

import Toggle from '../../common/Toggle.jsx';

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
        height: '35vh',
        border: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}>
        <h1 style={{marginTop: "-2vh"}}>{props.temp}°C</h1>
      <Toggle 
          displayName="Strike"
          disabled={inProgress!==''}
          onClick={() => {
              setKettleTemp(props.temp);
          }}
            >Strike
      </Toggle>

    </Box>
  );

}

export default AutoKettleTemp;