import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Temperature from '../brewnode/Temperature.jsx';
import Toggle from '../common/Toggle.jsx';

const Devices = (props) => {  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Container sx={{ height: '100%' }}>
        <Grid container sx={{ height: '100%', alignItems: 'stretch' }}>
          {/* column 1 */}
          <Grid item xs={12} md={4} sx={{ padding: 1 }}>
            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 0, height: '55%' }}>
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
                  <Toggle sensorName="ValveKettleIn" displayName="Valve"/>
                </Grid>
                <Grid item xs={6}>    
                  <Toggle sensorName="Fan" displayName="Fan"/>
                </Grid>
              </Grid>

              <Grid container>    
                <Grid item xs={6}>    
                  <Toggle sensorName="PumpKettle" displayName="Pump"/>
                </Grid>
                <Grid item xs={6}>    
                  <Toggle sensorName="Heater" displayName="Heater"/>
                </Grid>
              </Grid>
            </Box> 
          </Grid>  

          {/* column 2 */}
          <Grid item xs={12} md={4} sx={{ padding: 1}}>
            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 2, height: '10%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Fermenter</h1>
                </Grid>
                <Grid item xs={6}>
                  <Temperature name='Ferment' sensor='Temp Fermenter' min={5} max={40} tooLow={10} low={15} ok={21} high={25}/>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 0, height: '55%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Glycol</h1>
                </Grid>
                <Grid item xs={6}>
                  <Temperature name='Glycol' sensor='Temp Glycol' min={-10} max={40} tooLow={-10} low={0} ok={10} high={30}/>
                </Grid>
              </Grid>

              <Grid container >    
                <Grid item xs={6}>
                  <Toggle sensorName="PumpGlycol" displayName="Pump"/>
                </Grid>
                <Grid item xs={6}>
                  <Toggle sensorName="GlycolHeater" displayName="Heat"/>
                </Grid>
              </Grid>
              
              <Grid container>    
                <Grid item xs={12}>
                  <Toggle sensorName="GlycolChiller" displayName="Chill"/>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* column 3 */}
          <Grid item xs={12} md={4} sx={{ padding: 1}}>
            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 2, height: '35%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Mash Tun</h1>
                </Grid>
                <Grid item xs={6}>
                  <Temperature name="Mash" sensor='Temp Mash' min={50} max={80} tooLow={55} low={60} ok={70} high={75}/>
                </Grid>
              </Grid>
              <Grid container>    
                <Grid item xs={6}>
                  <Toggle sensorName="ValveMashIn" displayName="Valve"/>
                </Grid>
                <Grid item xs={6}>
                  <Toggle sensorName="PumpMash" displayName="Pump"/>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 0, height: '35%' }}>
              <Grid container>    
                <Grid item xs={6}>
                  <h1>Chiller</h1>
                </Grid>
                <Grid item xs={6}>
                  <Temperature name="Ambient" sensor='Temp Ambient'/>
                </Grid>
              </Grid>

              <Grid container>    
                <Grid item xs={6}>
                  <Toggle sensorName="ValveChillWortIn" displayName="Input Valve"/>
                </Grid>
                <Grid item xs={6}>
                  <Toggle sensorName="ValveFermentIn" displayName="Output Valve"/>
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