import {React, useContext, useEffect} from 'react';

import Box from '@mui/material/Box';
import Toggle from '../../common/Toggle.jsx';

import {MyContext } from '../../App';

import * as server from '../../brewnode/server-api';

function AutoFill(props) {
  const {inProgress, setInProgress} = useContext(MyContext);
  
  useEffect(() => {
    // Debug: Log props on component mount
    console.log('AutoFill props:', props);
    console.log('Strike litres:', props.strikeLitres);
    return () => {}; 
  }, [props]);

  async function fill() {
    console.log('AutoFill: Starting fill with', props.strikeLitres, 'litres');
    
    // Validation: Check if strikeLitres is valid
    if (!props.strikeLitres || props.strikeLitres <= 0) {
      const errorMsg = 'Invalid strike litres value: ' + props.strikeLitres;
      console.error(errorMsg);
      setInProgress(errorMsg);
      return;
    }

    try {
      const response = await server.fill(props.strikeLitres);
      console.log('AutoFill: Fill response:', response);
      return response.data;
    } catch (error) {
      console.error('AutoFill: Fill error:', error);
      setInProgress(error.toString());   
      return error;    
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
      <h1 style={{marginTop: "-2vh"}}>{props.strikeLitres} L</h1>

      <Toggle
          displayName="Fill"
          disabled={inProgress!==''}
          onClick={fill}
            >Fill
      </Toggle>
    </Box>
  );
}

export default AutoFill;