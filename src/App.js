import React from 'react';
import {createContext, useState} from 'react';

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

  addSocketListener('progress', ({value}) => setInProgress(value));
  
  return (
    <div className="App">
      <ThemeProvider theme={theme}> 
        <MyContext.Provider value={{inProgress, setInProgress}}> 
          <MyAppBar/>
          <BasicTabs/>
        </MyContext.Provider>
      </ThemeProvider> 
    </div>
  )
}

export{ App, MyContext};
