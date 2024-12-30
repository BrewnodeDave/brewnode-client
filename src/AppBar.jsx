import {React, useContext, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import PowerMenu from './brewnode/PowerMenu';

import Sensor from './common/Sensor'; // Import the Sensor component

import {MyContext } from './App';

import * as server from './common/server-api';

export default function MyAppBar() {

  const {inProgress, setInProgress} = useContext(MyContext);

  const [colour, setColour] = useState('#ffffff');
  
  async function restart() {
      try {
          const response = await server.restart(); 
          return response.data;
      } catch (error) {
        setInProgress(error);   
        console.error(error);
        return error;
      } 
  }

  function toggleWdogColour(value) {
    setColour(value ? "#00FF00" : "#007f00");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <PowerMenu/>

          <Typography variant="h4" component="div" sx={{ flexGrow: 2}}>
            {inProgress}
          </Typography>
          
          <Button variant="contained" onClick={restart}>
              Restart
          </Button>

          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: colour,
              marginLeft: '10px',
              marginRight: '10px',
            }}
          >
            <Sensor name="Watchdog" cb={toggleWdogColour} noDisplay={true}/>
          </div>

        </Toolbar>
      </AppBar>
    </Box>
  );
}