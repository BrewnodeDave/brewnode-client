import './App.css';

import MyAppBar from './AppBar';

import BasicTabs from './BasicTabs';

import {createContext, useState} from 'react';
import { responsiveFontSizes, createTheme, ThemeProvider } from '@mui/material/styles';
import {lightGreen} from '@mui/material/colors';

import {addSocketListener} from './brewnode/socketListener.js';

import './global.css';
import React from 'react';

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
