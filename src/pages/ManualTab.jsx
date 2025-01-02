import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import '../common/App.css';
import '../common/global.css';

import Fill from '../brewnode/Fill.jsx'
import KettleTemp from '../brewnode/KettleTemp'
import Boil from '../brewnode/Boil'
import Ferment from '../brewnode/Ferment'

function ManualTab() {  
  return (
        <Grid container spacing={2}  margin={2}>

          <Grid container xs={12}>
            <Grid xs={6}>
              <Stack spacing={1}>
                <Fill/>
                <KettleTemp/>
              </Stack>
            </Grid>
            
            <Grid xs={6}>
              <Stack spacing={1}>
                <Boil/>
                <Ferment/>
              </Stack>
            </Grid>
          </Grid>  

        </Grid>
    )
}

export default ManualTab;
