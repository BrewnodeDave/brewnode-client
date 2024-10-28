import {React} from 'react';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function PowerMenu() {

  // sudo halt
  // sudo reoot
  // brenode halt
  // brewnode monitor
  
  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 4 }}
    >
          
      <MenuIcon />
          
    </IconButton>
  );

 
}

export default PowerMenu;