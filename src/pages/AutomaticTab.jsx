import {React/*, useContext, useEffect, useState*/} from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import '../common/App.css';
import '../common/global.css';

import AutoBrew from './auto/AutoBrew';
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
      <Grid container>
        <Grid container spacing={2}  margin={2}>
          
          <Grid container  xs={12}>
            <Grid xs={3}>
              <Stack spacing={1}>
                <Process recipe={recipe}/>
              </Stack>
            </Grid>
            
            <Grid xs={3}>
              <Stack spacing={1}>
                <AutoFill strikeLitres={strikeLitres}/>
                <AutoKettleTemp temp={strikeTemp}/>
                <AutoBrew recipe={recipe}/>
              </Stack>
            </Grid>

            <Grid xs={3}>
              <Stack spacing={1}>
                 <AutoMash recipe={recipe}/>
              </Stack>
            </Grid>

            <Grid xs={3}>
              <Stack spacing={1}>
                 <AutoFerment recipe={recipe}/>
              </Stack>
            </Grid>

          </Grid>  
        </Grid>
      </Grid>
  )
}

export default AutomaticTab;
