import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Temperature from '../brewnode/Temperature.jsx';

import { ToggleButton } from '@mui/material';

// import Sensor from '../common/Sensor.jsx';
import Toggle from '../common/Toggle.jsx';

import { PumpKettle, ValveMashIn } from '../common/server-api.js';


const numPages = 3;

const Devices = (props) => {  
  const [page, setPage] = useState(1);
  const [k2m, setK2M] = useState(false);
    
  const handlePrev = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNext = () => {
    setPage((prevPage) => (prevPage < numPages ? prevPage + 1 : prevPage)); // Adjust the max page number as needed
  };

  function toggleK2M(){
    k2m ? PumpKettle(false) : PumpKettle(true);
    k2m ? ValveMashIn(false) : ValveMashIn(true);
    setK2M(!k2m);
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Button
        size="large"
        onClick={handlePrev}
        disabled={page === 1}
        sx={{ position: 'absolute', left: -30, top: '50%', transform: 'translateY(-50%)' }}
      >
      <Typography sx={{ fontSize: 100 }}>&lt;</Typography>

      </Button>

      <Container>
        {page === 1 && (
          <Grid container xs={12} sx={{ border: 0, padding:0}}>    
            <Grid sx={{ border: 0, padding:2}} xs={6}>
              <Box sx={{ border: 2, padding: 2, bgcolor: '#8bb34a', marginBottom: 2 }}>
                <h1>Kettle</h1> 
                <Temperature name='Kettle' sensor='TempKettle' min={0} max={100} tooLow={30} low={40} ok={75}/>
                <Toggle sensorName="ValveKettleIn" displayName="Valve"/>
                <Toggle sensorName="PumpKettle" displayName="Pump"/>
                <Toggle sensorName="Fan" displayName="Fan"/>
                <Toggle sensorName="Heater" displayName="Heater" sensor="Power"/>
                </Box>
            </Grid>


            <Grid sx={{ border: 0, padding:2}} xs={6}>
              <Box sx={{ border: 2, padding: 2, bgcolor: '#8bb34a', marginBottom: 2 }}>
                <h1>Mash Tun</h1>
                <Temperature name="Mash" sensor='TempMash' min={50} max={80} tooLow={55} low={60} ok={70} high={75}/>
                <Toggle sensorName="ValveMashIn" displayName="Valve"/>
                <Toggle sensorName="PumpMash" displayName="Pump"/>
              </Box>

              <Box sx={{ border: 2, padding: 2, bgcolor: '#8bb34a', marginBottom: 0 }}>
                  <ToggleButton
                    style={{
                      backgroundColor: k2m ? "#fbc34a" : "#8bc34a",
                      color: "#000000",
                      fontSize: "20px",
                      width: "100%",
                      height: "100%", 
                      backgroundImage: `url(${k2m ? props.imageOn : props.imageOff})`,
                      backgroundSize: 'contain', // Ensure the image covers the entire button
                      backgroundRepeat: 'no-repeat', // No repeating the image
                      backgroundPosition: 'center', // Center the image
                    }}
                    size="large"
                    value="check"
                    selected={k2m}
                    onChange={toggleK2M}
                  >Kettle to Mash</ToggleButton> 
              </Box>

            </Grid>
          </Grid>
        )}
        {page === 2 && (
          <Grid container xs={12} sx={{ border: 0, padding:0}}>    
            <Grid sx={{ border: 0, padding:2}} xs={6}>
              <Box sx={{ border: 2, padding: 2, bgcolor: '#8bb34a', marginBottom: 2 }}>
                <h1>Fermenter</h1>
                <Temperature name='Ferment' sensor='TempFermenter' min={5} max={40} tooLow={10} low={15} ok={21} high={25}/>
              </Box>
            </Grid>

            <Grid sx={{ border: 0, padding:2}} xs={6}>
              <Box sx={{ border: 2, padding: 2, bgcolor: '#8bb34a', marginBottom: 2 }}>
                <h1>Glycol</h1>
                <Temperature name='Glycol' sensor='TempGlycol' min={-10} max={40} tooLow={-10} low={0} ok={10} high={30}/>
                <Toggle sensorName="PumpGlycol" displayName="Pump"/>
              </Box>
            </Grid>
          </Grid>
        )}
        {page === 3 && (
          <Grid container xs={12} sx={{ border: 0, padding:0}}>    
            <Grid sx={{ border: 0, padding:2}} xs={12}>
              <Box sx={{ border: 1, padding: 2, bgcolor: '#8bb34a', marginBottom: 2 }}>
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
        sx={{ position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)' }}
      >
        <Typography sx={{ fontSize: 100 }}>&gt;</Typography>
      </Button>
    </div>
  );
};

export {Devices};