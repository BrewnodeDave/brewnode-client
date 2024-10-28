import {React, useContext, useEffect} from 'react';
import Box from '@mui/material/Box';
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
      setInProgress(`Filling Kettle with ${props.strikeLitres}L ...`);   
      const response = await server.fill(props.strikeLitres);
      setInProgress('');   
  
      return response.data;
    } catch (error) {
      console.error(error);
    } 
  }
  
  return (
    <Box sx={{ border: 1, padding:2 }}>
      <Button variant="contained"
        style={{ fontSize:"30px",width: "100%", height: "100%" }}
        size='large'
        disabled={inProgress!==''}
        onClick={fill}>
          Fill = {props.strikeLitres}L
      </Button>
    </Box>
  );
}

export default AutoFill;