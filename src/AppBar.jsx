import {React, useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PowerMenu from './brewnode/PowerMenu';
import DangerousTwoToneIcon from '@mui/icons-material/DangerousTwoTone';

import {MyContext } from './App';

import * as server from './common/server-api';

export default function MyAppBar() {

  const {inProgress, setInProgress} = useContext(MyContext);
  
  async function restart() {
      try {
          setInProgress("Restarting...");   
          const response = await server.restart(); 
          setInProgress('');   
          return response.data;
      } catch (error) {
        setInProgress(error);   
        console.error(error);
        return error;
      } 
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <PowerMenu/>

          <Typography variant="h4" component="div" sx={{ flexGrow: 2}}>
            {inProgress}
          </Typography>
          
          <Button variant="contained" onClick={restart}>
              Restart
          </Button>

          <IconButton color='error' onClick={restart} size='large'>
            <DangerousTwoToneIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}