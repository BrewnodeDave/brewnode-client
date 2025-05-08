import './App.css';

import Stack from '@mui/material/Stack';

import Heater from '../brewnode/Heater';
//import Grid from '@mui/material/Grid'; 
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import Temperature from '../brewnode/Temperature'
import Fill from '../brewnode/Fill'
import Kettle2Mash from '../brewnode/Kettle2Mash'
import Mash2Kettle from '../brewnode/Mash2Kettle'
import KettleTemp from '../brewnode/KettleTemp'
import Boil from '../brewnode/Boil'
import Ferment from '../brewnode/Ferment'
import Kettle2Ferment from '../brewnode/Kettle2Ferment'

export default function Controls() {
  return (      
      <Grid container>
        <Grid container spacing={2}  margin={2}>
          <Grid container xs={12} sx={{ border: 0}}>    
            <Grid xs={3}>
              <Temperature name="Kettle" sensor='Temp Kettle' min={10} max={100}/>
            </Grid>
            <Grid xs={3}>
              <Temperature name="Mash" sensor='Temp Mash' min={50} max={80}/>
            </Grid>
            <Grid xs={3}>
              <Temperature name='Ferment' sensor='Temp Fermenter' min={10} max={30}/>
            </Grid>
            <Grid xs={3}>
              <Temperature name='Glycol' sensor='Temp Glycol' min={-10} max={40}/>
            </Grid>
          </Grid>
          
          <Grid container  xs={12}>
            <Grid xs={4}>
              <Stack spacing={2}>
                <Kettle2Mash/>
                <Mash2Kettle/>
                <Kettle2Ferment/>
                <Heater/>
              </Stack>
            </Grid>

            <Grid xs={4}>
              <Stack spacing={2}>
                <Fill/>
                <KettleTemp/>
              </Stack>
            </Grid>
            
            <Grid xs={4}>
              <Stack spacing={2}>
                <Boil/>
                <Ferment/>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  )
}

