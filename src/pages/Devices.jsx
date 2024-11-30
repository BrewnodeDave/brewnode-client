import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Temperature from '../brewnode/Temperature.jsx';

import Heater from '../brewnode/Heater.jsx';
import Toggle from '../common/Toggle.jsx';

import pumpOn from '../static/buttons/pump-on.jpg'; 
import pumpOff from '../static/buttons/pump-off.jpg'; 

const numPages = 3;

const Devices = () => {  
  const [page, setPage] = useState(1);
    
  const handlePrev = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNext = () => {
    setPage((prevPage) => (prevPage < numPages ? prevPage + 1 : prevPage)); // Adjust the max page number as needed
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Button
        size="large"
        onClick={handlePrev}
        disabled={page === 1}
        sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
      >
      <Typography sx={{ fontSize: 100 }}>&lt;</Typography>

      </Button>

      <Container>
        {page === 1 && (
          <Grid container xs={12} sx={{ border: 0, padding:0, bgcolor:'red'}}>    
            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={6}>
              <Box sx={{ border: 2, padding: 0, bgcolor: 'green', marginBottom: 2 }}>
                <h1>Kettle</h1> 
                <Temperature name='Kettle' sensor='TempKettle' min={0} max={100} tooLow={30} low={40} ok={75}/>
                <Toggle sensorName="ValveKettleIn" displayName="Input Valve"/>
                <Toggle sensorName="PumpKettle" displayName="Pump" imageOn={pumpOn} imageOff={pumpOff}/>
                <Toggle sensorName="Fan" displayName="Extractor"/>
                <Heater/>
              </Box>
            </Grid>


            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={6}>
              <Box sx={{ border: 2, padding: 0, bgcolor: 'green', marginBottom: 2 }}>
                <h1>Mash Tun</h1>
                <Temperature name="Mash" sensor='TempMash' min={50} max={80} tooLow={55} low={60} ok={70} high={75}/>
                <Toggle sensorName="ValveMashIn" displayName="Input Valve"/>
                <Toggle sensorName="PumpMash" displayName="Pump"/>
              </Box>
            </Grid>
          </Grid>
        )}
        {page === 2 && (
          <Grid container xs={12} sx={{ border: 0, padding:0, bgcolor:'red'}}>    
            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={6}>
              <Box sx={{ border: 2, padding: 0, bgcolor: 'green', marginBottom: 2 }}>
                <h1>Fermenter</h1>
                <Temperature name='Ferment' sensor='TempFermenter' min={5} max={40} tooLow={10} low={15} ok={21} high={25}/>
              </Box>
            </Grid>

            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={6}>
              <Box sx={{ border: 2, padding: 0, bgcolor: 'green', marginBottom: 2 }}>
                <h1>Glycol</h1>
                <Temperature name='Glycol' sensor='TempGlycol' min={-10} max={40} tooLow={-10} low={0} ok={10} high={30}/>
                <Toggle sensorName="PumpGlycol" displayName="Pump"/>
              </Box>
            </Grid>
          </Grid>
        )}
        {page === 3 && (
          <Grid container xs={12} sx={{ border: 0, padding:0, bgcolor:'red'}}>    
            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={12}>
              <Box sx={{ border: 1, padding: 0, bgcolor: 'red', marginBottom: 2 }}>
                <h1>Chiller</h1>
                <Toggle sensorName="ValveChillWortIn" displayName="Input Valve"/>
                <Toggle sensorName="ValveFermentIn" displayName="Output Valve"/>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>

      <Button
        size="large"
        onClick={handleNext}
        disabled={page === numPages}
        sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
      >
        <Typography sx={{ fontSize: 100 }}>&gt;</Typography>
      </Button>
    </div>
  );
};

export {Devices};