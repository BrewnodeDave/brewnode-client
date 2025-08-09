import {React/*, useContext, useEffect, useState*/} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import '../common/App.css';
import '../common/global.css';

import AutoFill from './auto/AutoFill';
import AutoKettleTemp from './auto/AutoKettleTemp';
import AutoFerment from './auto/AutoFerment';
import AutoMash from './auto/AutoMash';
import Process from './auto/Process';

function AutomaticTab(props) {  

  let strikeLitres = 0;
  let strikeTemp = 0;
  const recipe = props?.batch;
  if (recipe?.data !== undefined) {
    strikeLitres = recipe?.data?.mashWaterAmount;
    strikeTemp = recipe?.data?.strikeTemp;
  }

  return (
          <Grid container  xs={12}>
      
            <Grid xs={3}>
              <Box sx={{ border: 2, bgcolor: '#8bb34a' }}>
                  <Process recipe={recipe}/>
              </Box>
            </Grid>

            <Grid xs={3} >
              <Box sx={{ marginBottom: '3vh', marginLeft: '2vh', border: 2, bgcolor: '#8bb34a'}}>
                  <AutoFill strikeLitres={strikeLitres}/>
              </Box>
              <Box sx={{ marginBottom: '3vh', marginLeft: '2vh', border: 2, bgcolor: '#8bb34a'}}>
                  <AutoKettleTemp temp={strikeTemp}/>
              </Box>
            </Grid>

            <Grid xs={3}>
              <Box sx={{ marginBottom: '5vh', marginLeft: '2vh', border: 2, bgcolor: '#8bb34a'}}>
                  <AutoMash recipe={recipe}/>
              </Box>
            </Grid>

            <Grid xs={3}>
              <Box sx={{ marginBottom: '5vh', marginLeft: '2vh', border: 2, bgcolor: '#8bb34a'}}>
                <Stack spacing={1}>
                  <AutoFerment recipe={recipe}/>
                </Stack>
              </Box>
            </Grid>

          </Grid>  
  )
}

export default AutomaticTab;
