import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import '../common/App.css';
import '../common/global.css';

import Heater from '../brewnode/Heater';
import Fill from '../brewnode/Fill'
import Kettle2Mash from '../brewnode/Kettle2Mash'
import Mash2Kettle from '../brewnode/Mash2Kettle'
import KettleTemp from '../brewnode/KettleTemp'
import Boil from '../brewnode/Boil'
import Ferment from '../brewnode/Ferment'
import Kettle2Ferment from '../brewnode/Kettle2Ferment'

function ManualTab() {  
  return (
      <Grid container>
        <Grid container spacing={2}  margin={2}>

          <Grid container xs={12}>
            <Grid xs={4}>
              <Stack spacing={1}>
                <Kettle2Mash/>
                <Mash2Kettle/>
                <Kettle2Ferment/>
                <Heater/>
              </Stack>
            </Grid>

            <Grid xs={4}>
              <Stack spacing={1}>
                <Fill/>
                <KettleTemp/>
              </Stack>
            </Grid>
            
            <Grid xs={4}>
              <Stack spacing={1}>
                <Boil/>
                <Ferment/>
              </Stack>
            </Grid>
          </Grid>  

        </Grid>
      </Grid>
  )
}

export default ManualTab;
