import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function PowerMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Load saved IP address, port, username, and password from localStorage
    const savedIpAddress = localStorage.getItem('ipAddress');
    const savedPort = localStorage.getItem('port');
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedIpAddress) setIpAddress(savedIpAddress);
    if (savedPort) setPort(savedPort);
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (command) => {
    setDialogType(command);
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogSubmit = () => {
    if (dialogType === 'Server') {
      console.log(`IP Address: ${ipAddress}, Port: ${port}`);
      // Save IP address and port to localStorage
      localStorage.setItem('ipAddress', ipAddress);
      localStorage.setItem('port', port);
    } else if (dialogType === 'Login') {
      console.log(`Username: ${username}, Password: ${password}`);
      // Save username and password to localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
    } else if (dialogType === 'Logout') {
      // Clear username and password from localStorage
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      console.log('User logged out');
    } else if (dialogType === 'Reboot') {
      console.log('Executing command: sudo reboot');
      // Add your command execution logic here
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 4 }}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('Server')}>Server</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Login')}>Login</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Logout')}>Logout</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Reboot')}>Reboot</MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === 'Server' ? 'Enter Server' : dialogType === 'Login' ? 'Login' : dialogType === 'Logout' ? 'Logout' : 'Reboot'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'Server' ? 'Please enter the IP address and port of the server.' : dialogType === 'Login' ? 'Please enter your username and password.' : dialogType === 'Logout' ? 'Are you sure you want to logout?' : 'Are you sure you want to reboot?'}
          </DialogContentText>
          {dialogType === 'Server' ? (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="IP Address"
                type="text"
                fullWidth
                variant="standard"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Port"
                type="text"
                fullWidth
                variant="standard"
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </>
          ) : dialogType === 'Login' ? (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PowerMenu;