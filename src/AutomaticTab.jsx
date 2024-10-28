import {React/*, useContext, useEffect, useState*/} from 'react';

import './App.css';
import Stack from '@mui/material/Stack';

import Temperature from './brewnode/Temperature'

import AutoBrew from './brewnode/auto/AutoBrew';
import AutoFill from './brewnode/auto/AutoFill';
import AutoKettleTemp from './brewnode/auto/AutoKettleTemp';
import AutoFerment from './brewnode/auto/AutoFerment';
import AutoMash from './brewnode/auto/AutoMash';
import Process from './brewnode/auto/Process';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import './global.css';


function AutomaticTab(props) {  

  let strikeLitres = 0;
  let strikeTemp = 0;
  const recipe = props?.batch;
  if (recipe?.data !== undefined) {
    strikeLitres = recipe?.data?.mashWaterAmount;
    strikeTemp = recipe?.data?.strikeTemp;
  }


  
  return (
      <Grid container>
        <Grid container spacing={2}  margin={2}>
          <Grid container xs={12} sx={{ border: 0}}>    
            <Grid xs={3}>
              <Temperature name="Kettle" sensor='TempKettle' min={10} max={100}/>
            </Grid>
            <Grid xs={3}>
              <Temperature name="Mash" sensor='TempMash' min={50} max={80}/>
            </Grid>
            <Grid xs={3}>
              <Temperature name='Ferment' sensor='TempFermenter' min={10} max={30}/>
            </Grid>
            <Grid xs={3}>
              <Temperature name='Glycol' sensor='TempGlycol' min={-10} max={40}/>
            </Grid>
          </Grid>
          
          <Grid container  xs={12}>
            <Grid xs={4}>
              <Stack spacing={1}>
                <Process recipe={recipe}/>
              </Stack>
            </Grid>
            
            <Grid xs={4}>
              <Stack spacing={1}>
                <AutoFill strikeLitres={strikeLitres}/>
                <AutoKettleTemp temp={strikeTemp}/>
                <AutoBrew recipe={recipe}/>
              </Stack>
            </Grid>

            <Grid xs={4}>
              <Stack spacing={1}>
                 <AutoFerment recipe={recipe}/>
                 <AutoMash recipe={recipe}/>
              </Stack>
            </Grid>
          </Grid>  
        </Grid>
      </Grid>
  )
}

export default AutomaticTab;
