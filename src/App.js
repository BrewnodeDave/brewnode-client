import React from 'react';
import {createContext, useEffect, useState} from 'react';

import { responsiveFontSizes, createTheme, ThemeProvider } from '@mui/material/styles';
import {lightGreen} from '@mui/material/colors';

import './common/App.css';
import './common/global.css';

import MyAppBar from './AppBar';
import BasicTabs from './pages/BasicTabs';
import {addSocketListener} from './brewnode/socketListener.js';

const MyContext = createContext({defaultValue:{}});

const theme = responsiveFontSizes(createTheme({
  palette: {
      primary: lightGreen
  },
}));

function App() {
  const [inProgress, setInProgress] = useState('');

  useEffect(()=>{
    addSocketListener('Progress', (value) => {
      setInProgress(value);
    });
  }, []); // Empty dependency array ensures this runs only once
  
  return (
    <div className="App" style={{ padding: 0, width: '100%', height: '100%', minHeight: '100vh', minWidth: '100vw', boxSizing: 'border-box', overflow: 'hidden' }}>
      <ThemeProvider theme={theme}> 
        <MyContext.Provider value={{inProgress, setInProgress}}> 
          <MyAppBar/>
          <BasicTabs/>
        </MyContext.Provider>
      </ThemeProvider> 
    </div>
  )
}

export { App, MyContext };
