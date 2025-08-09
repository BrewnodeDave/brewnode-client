import {React, useContext, useEffect} from 'react';

import Box from '@mui/material/Box';
import Toggle from '../../common/Toggle.jsx';

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