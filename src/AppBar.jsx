import {React, useContext, useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import PowerMenu from './brewnode/PowerMenu';

import Sensor from './common/Sensor'; // Import the Sensor component

import {MyContext } from './App';

import * as server from './brewnode/server-api';

export default function MyAppBar({ actionButton }) {
  const {inProgress} = useContext(MyContext);
  const [colour, setColour] = useState('red');
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  async function restart() {
      try {
          const response = await server.restart(); 
          return response.data;
      } catch (error) {
        // setInProgress(error);   
        console.error(error);
        return error;
      } 
  }

  function toggleWdogColour(value) {
    setColour(value ? "#00FF00" : "#007f00");
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  return (
      <AppBar position="static" sx={{ height: { xs: '8vh', sm: '10vh', md: '12vh' } }}>
        <Toolbar sx={{ minHeight: { xs: '8vh', sm: '10vh', md: '12vh' } }}>
          <PowerMenu/>

          <Typography 
            component="div" 
            sx={{ 
              fontSize: { xs: '6vh', sm: '8vh', md: '6vh' }
            }}
          >
            {time}
          </Typography>

          <Typography component="div" sx={{               
            fontWeight: 'bold',
            color: 'black', 
            fontSize: { xs: '6vh', sm: '6vh', md: '6vh' }, flexGrow: 2 }}>
            {inProgress}
          </Typography>
          
          {actionButton}
          
          <Button variant="contained" onClick={restart} sx={{ fontSize: { xs: '1.5vh', sm: '2vh' }, marginRight: '5vw' }}>
              Restart
          </Button>

          <div
            style={{
              width: '5vh',
              height: '5vh',
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
  );
}