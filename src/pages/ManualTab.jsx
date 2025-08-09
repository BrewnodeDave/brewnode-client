import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import '../common/App.css';
import '../common/global.css';

import Fill from '../brewnode/Fill.jsx'
import KettleTemp from '../brewnode/KettleTemp'
import Boil from '../brewnode/Boil'
import Ferment from '../brewnode/Ferment'
import Box from '@mui/material/Box';


function ManualTab() {  
  return (
    <Grid container>
      <Grid item xs={6} >
        <Box sx={{ marginBottom: '2vh', marginLeft: '0vh', border: 2, bgcolor: '#8bb34a' }}>
          <Fill />    
        </Box>
        <Box sx={{  marginBottom: '2vh', marginLeft: '0vh', border: 2, bgcolor: '#8bb34a' }}>
          <KettleTemp />
        </Box>
      </Grid>

      <Grid item xs={6} >
        <Box sx={{ marginBottom: '2vh', marginLeft: '2vh', border: 2, bgcolor: '#8bb34a' }}>
          <Boil />
        </Box>
        <Box sx={{ marginBottom: '2vh', marginLeft: '2vh', border: 2, bgcolor: '#8bb34a' }}>
          <Ferment />
        </Box>
      </Grid>
    </Grid>
  );
}

export default ManualTab;
