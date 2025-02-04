import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Temperature from '../brewnode/Temperature.jsx';
import Fill2 from '../common/Fill2.jsx';

import Toggle from '../common/Toggle.jsx';

const numPages = 2;

const Devices = (props) => {  
  const [page, setPage] = useState(1);
    
  const handlePrev = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNext = () => {
    setPage((prevPage) => (prevPage < numPages ? prevPage + 1 : prevPage)); // Adjust the max page number as needed
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Button
        size="large"
        onClick={handlePrev}
        disabled={page === 1}
        sx={{ position: 'absolute', left: -30, top: '50%', transform: 'translateY(-50%)' }}
      >
        <Typography sx={{ fontSize: 100 }}>&lt;</Typography>
      </Button>

      <Container sx={{ height: '100%' }}>
        {page === 1 && (
          <Grid container xs={12} sx={{ height: '100%' }}>    
              <Grid xs={8} sx={{ border: 0, padding:1, height: '100%' }}>
                <Box sx={{ border: 2, padding: 0, bgcolor: '#8bb34a', height: '100%' }}>
                <h1>Kettle</h1> 
                <Temperature name='Kettle' sensor='TempKettle' min={0} max={100} tooLow={30} low={40} ok={75}/>
                  <Grid container xs={12} >
                    <Grid xs={12} >    
                      <Grid container xs={12}>    
                        <Grid xs={3}>    
                          <Toggle sensorName="ValveKettleIn" displayName="Valve"/>
                        </Grid>
                        <Grid xs={3}>    
                          <Toggle sensorName="Fan" displayName="Fan"/>
                        </Grid>
                        <Grid xs={3}>    
                          <Toggle sensorName="PumpKettle" displayName="Pump"/>
                        </Grid>
                        <Grid xs={3}>    
                          <Toggle sensorName="Heater" displayName="Heater"/>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>  
              </Grid>  

              <Grid xs={4} sx={{ border: 0, padding:1, borderColor:'yellow', height: '100%' }}>    
                <Box sx={{ border: 2, padding: 0, bgcolor: '#8bb34a', marginBottom: 2, height: '100%' }}>          
                  <h1>Fill</h1> 
                  <Fill2/>
                </Box>
              </Grid>
          </Grid>
        )}
        {page === 2 && (
          <Grid container xs={12} sx={{ height: '100%' }}>    
            <Grid xs={6} sx={{padding:1, height: '100%' }} >
              <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 2, height: '50%' }}>
              <Grid container xs={12}>    
                  <Grid xs={6}>
                    <h1>Fermenter</h1>
                  </Grid>
                  <Grid xs={6}>
                    <Temperature name='Ferment' sensor='TempFermenter' min={5} max={40} tooLow={10} low={15} ok={21} high={25}/>
                  </Grid>
                </Grid>
              </Box>
            
              <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 2, height: '50%' }}>
                <Grid container xs={12}>    
                  <Grid xs={6}>
                    <h1>Glycol</h1>
                  </Grid>
                  <Grid xs={6}>
                    <Temperature name='Glycol' sensor='TempGlycol' min={-10} max={40} tooLow={-10} low={0} ok={10} high={30}/>
                  </Grid>
                </Grid>
                <Grid container xs={12}>    
                  <Grid xs={4}>
                    <Toggle sensorName="PumpGlycol" displayName="Pump"/>
                  </Grid>
                  <Grid xs={4}>
                    <Toggle sensorName="GlycolHeater" displayName="Heat"/>
                  </Grid>
                  <Grid xs={4}>
                    <Toggle sensorName="GlycolChiller" displayName="Chill"/>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid sx={{padding:1, height: '100%' }} xs={6}>
              <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 2, height: '50%' }}>
                <Grid container xs={12}>    
                  <Grid xs={6}>
                    <h1>Mash Tun</h1>
                  </Grid>
                  <Grid xs={6}>
                    <Temperature name="Mash" sensor='TempMash' min={50} max={80} tooLow={55} low={60} ok={70} high={75}/>
                  </Grid>
                </Grid>
                <Grid container xs={12}>    
                   <Grid xs={6}>
                    <Toggle sensorName="ValveMashIn" displayName="Valve"/>
                  </Grid>
                  <Grid xs={6}>
                    <Toggle sensorName="PumpMash" displayName="Pump"/>
                  </Grid>
                 </Grid>
               </Box>


              <Box sx={{ border: 2, bgcolor: '#8bb34a', marginBottom: 2, height: '50%' }}>
                <h1>Chiller</h1>
                <Grid container xs={12} >    
                  <Grid xs={6}>
                    <Toggle sensorName="ValveChillWortIn" displayName="Input Valve"/>
                  </Grid>
                  <Grid xs={6}>
                    <Toggle sensorName="ValveFermentIn" displayName="Output Valve"/>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>

      <Button
        size="large"
        onClick={handleNext}
        disabled={page === numPages}
        sx={{ position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)' }}
      >
        <Typography sx={{ fontSize: 100 }}>&gt;</Typography>
      </Button>
    </div>
  );
};

export {Devices};