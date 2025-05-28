import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Temperature from '../brewnode/Temperature.jsx';
import Toggle from '../common/Toggle.jsx';

const Devices = (props) => {  
  return (
    <div style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
      <Container sx={{ height: '100%', width: '100%', maxWidth: '100vw !important', padding: 0 }}>
        <Grid container sx={{ height: '100%', alignItems: 'stretch' }}>
          {/* column 1 */}
          <Grid item xs={12} md={4} sx={{ padding: 1, height: '100%' }}>
            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 0, height: '100%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Kettle</h1>
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

          {/* column 2 */}
          <Grid item xs={12} md={4} sx={{ padding: 1, height: '100%' }}>
            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 2, height: '10%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Fermenter</h1>
                </Grid>
                <Grid item xs={6}>
                  <Temperature  sensor='Temp Fermenter' name='Ferment' min={5} max={40} tooLow={10} low={15} ok={21} high={25}/>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 0, height: '88%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Glycol</h1>
                </Grid>
                <Grid item xs={6}>
                  <Temperature sensor='Temp Glycol' name='Glycol' min={-10} max={40} tooLow={-10} low={0} ok={10} high={30}/>
                </Grid>
              </Grid>

              <Grid container >    
                <Grid item xs={6}>
                  <Toggle sensorName="Pump Glycol" displayName="Pump"/>
                </Grid>
                <Grid item xs={6}>
                  <Toggle sensorName="Glycol Heater" displayName="Heat"/>
                </Grid>
              </Grid>
              
              <Grid container>    
                <Grid item xs={12}>
                  <Toggle sensorName="Glycol Chiller" displayName="Chill"/>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* column 3 */}
          <Grid item xs={12} md={4} sx={{ padding: 1, height: '100%' }}>
            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 2, height: '48%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Mash Tun</h1>
                </Grid>
                <Grid item xs={6}>
                  <Temperature sensor='Temp Mash' name="Mash" min={50} max={80} tooLow={55} low={60} ok={70} high={75}/>
                </Grid>
              </Grid>
              <Grid container>    
                <Grid item xs={6}>
                  <Toggle sensorName="Valve Mash-in" displayName="Valve"/>
                </Grid>
                <Grid item xs={6}>
                  <Toggle sensorName="Pump Mash" displayName="Pump"/>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 0, height: '48%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Chiller</h1>
                </Grid>
                <Grid item xs={6}>
                  <Temperature sensor='Temp Ambient' name="Ambient"/>
                </Grid>
              </Grid>

              <Grid container>    
                <Grid item xs={6}>
                  <Toggle sensorName="Valve Chiller wort-in" displayName="Input Valve"/>
                </Grid>
                <Grid item xs={6}>
                  <Toggle sensorName="Valve Chiller wort-out" displayName="Output Valve"/>
                </Grid>
              </Grid>
            </Box>

          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export { Devices };