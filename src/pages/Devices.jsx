import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Temperature from '../brewnode/Temperature.jsx';
import Toggle from '../common/Toggle.jsx';

const Devices = (props) => {  
  return (
    <Grid container>
      {/* Kettle */}
      <Grid item xs={4}>
        <Box sx={{ border: 2, bgcolor: '#8bb34a', height: '72vh' }}>
          <Grid container>
            <Grid item xs={6}>
              <h1 style={{ marginLeft: '10px', fontSize: '4vw' }}>Kettle</h1>
            </Grid>
            <Grid item xs={6}>
              <Temperature name='Kettle' sensor='Temp Kettle' min={0} max={100} tooLow={30} low={40} ok={75}/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Toggle sensorName="Valve Kettle-in" displayName="Valve"/>
            </Grid>
            <Grid item xs={6}>
              <Toggle sensorName="Fan" displayName="Fan"/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Toggle sensorName="Pump Kettle" displayName="Pump"/>
            </Grid>
            <Grid item xs={6}>
              <Toggle sensorName="Kettle Heater" displayName="Heater"/>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      {/* Fermenter and Glycol */}
      <Grid item xs={4}>
        <Box sx={{ marginBottom: '5vh', marginLeft: '5vh', border: 2, bgcolor: '#8bb34a', height: '18vh' }}>
          <Grid container>
            <Grid item xs={6}>
              <h1 style={{ marginTop:'-1vh',marginLeft: '10px',fontSize: '4vw' }}>Fermenter</h1>
            </Grid>
            <Grid item xs={6} sx={{ marginTop: '4vh' }}>
              <Temperature  sensor='Temp Fermenter' name='Ferment' min={5} max={40} tooLow={10} low={15} ok={21} high={25}/>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginLeft:'5vh', border: 2, bgcolor: '#8bb34a', height: '49vh' }}>
          <Grid container>
            <Grid item xs={6}>
              <h1 style={{ marginTop:'-1vh', marginLeft: '10px',fontSize: '4vw' }}>Glycol</h1>
            </Grid>
            <Grid item xs={6}>
              <Temperature sensor='Temp Glycol' name='Glycol' min={-10} max={40} tooLow={-10} low={0} ok={10} high={30}/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6} sx={{marginTop: '-8vh'}}>
              <Toggle sensorName="Pump Glycol" displayName="Pump"/>
            </Grid>
            <Grid item xs={6} sx={{marginTop: '-8vh'}}>
              <Toggle sensorName="Glycol Heater" displayName="Heat"/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6} sx={{marginTop: '-4vh', marginLeft: '7vw'}}>
              <Toggle sensorName="Glycol Chiller" displayName="Chill"/>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      {/* Mash Tun and Chiller */}
      <Grid item xs={4}>
        <Box sx={{ marginBottom:'5vh',marginLeft: '5vh', border: 2, bgcolor: '#8bb34a', height: '33vh' }}>
          <div><Grid container>
            <Grid item xs={6}>
              <h1 style={{marginTop:'-1vh', marginLeft: '10px',fontSize: '4vw' }}>Mash Tun</h1>
            </Grid>
            <Grid item xs={6}>
              <Temperature sensor='Temp Mash' name="Mash" min={50} max={80} tooLow={55} low={60} ok={70} high={75}/>
            </Grid>
          </Grid>
         
            <Grid container>
              <Grid item xs={6} sx={{marginTop: '-8vh'}}>
                <Toggle sensorName="Valve Mash-in" displayName="Valve"/>
              </Grid>
              <Grid item xs={6} sx={{marginTop: '-8vh'}}>
                <Toggle sensorName="Pump Mash" displayName="Pump"/>
              </Grid>
            </Grid></div>
        </Box>
        
        <Box sx={{ marginLeft:'5vh', border: 2, bgcolor: '#8bb34a', height: '34vh' }}>
          <div><Grid container>
            <Grid item xs={6}>
              <h1 style={{ marginTop:'-1vh', marginLeft: '10px',fontSize: '4vw' }}>Chiller</h1>
            </Grid>
            <Grid item xs={6}>
              <Temperature sensor='Temp Ambient' name="Ambient"/>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6} sx={{marginTop: '-8vh'}}>
              <Toggle sensorName="Valve Chiller wort-in" displayName="Input Valve"/>
            </Grid>
            <Grid item xs={6} sx={{marginTop: '-8vh'}}>
              <Toggle sensorName="Valve Chiller wort-out" displayName="Output Valve"/>
            </Grid>
          </Grid></div>
        </Box>
      </Grid>
    </Grid>
  );
};

export { Devices };