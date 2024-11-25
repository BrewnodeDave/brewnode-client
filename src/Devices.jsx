import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Sensor from './sensors/sensor.jsx';

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
                <div>Temp<Sensor name="TempKettle"></Sensor></div>
                <div>Valve<Sensor name="ValveKettleIn"></Sensor></div>
                <div>Pump<Sensor name="PumpKettle"></Sensor></div>
                <div>Power<Sensor name="Power"></Sensor></div>
                <div>Fan<Sensor name="Fan"></Sensor></div>
              </Box>
            </Grid>

            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={6}>
              <Box sx={{ border: 2, padding: 0, bgcolor: 'green', marginBottom: 2 }}>
                <h1>Mash Tun</h1>
                <div>Temp<Sensor name="TempMash"></Sensor></div>
                <div>Valve<Sensor name="ValveMashIn"></Sensor></div>
                <div>Pump<Sensor name="PumpMash"></Sensor></div>
              </Box>
            </Grid>
          </Grid>
        )}
        {page === 2 && (
          <Grid container xs={12} sx={{ border: 0, padding:0, bgcolor:'red'}}>    
            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={6}>
              <Box sx={{ border: 2, padding: 0, bgcolor: 'green', marginBottom: 2 }}>
                <h1>Fermenter</h1>
                Temp<Sensor name="TempFermenter"></Sensor>
              </Box>
            </Grid>

            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={6}>
              <Box sx={{ border: 2, padding: 0, bgcolor: 'green', marginBottom: 2 }}>
                <h1>Glycol</h1>
                <div>Temp<Sensor name="TempGlycol"></Sensor></div>
                <div>Pump<Sensor name="PumpGlycol"></Sensor></div>
              </Box>
            </Grid>
          </Grid>
        )}
        {page === 3 && (
          <Grid container xs={12} sx={{ border: 0, padding:0, bgcolor:'red'}}>    
            <Grid sx={{ border: 0, padding:3, bgcolor:'blue'}} xs={12}>
              <Box sx={{ border: 1, padding: 0, bgcolor: 'red', marginBottom: 2 }}>
                <h1>Chiller</h1>
                <div>Wort Input Valve<Sensor name="ValveChillWortIn"></Sensor></div>
                <div>Wort Output Valve<Sensor name="ValveFermentIn"></Sensor></div>
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