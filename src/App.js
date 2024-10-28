import './App.css';

import MyAppBar from './AppBar';

import BasicTabs from './BasicTabs';

import {createContext, useEffect, useState} from 'react';
import { responsiveFontSizes, createTheme, ThemeProvider } from '@mui/material/styles';
import {lightGreen} from '@mui/material/colors';

import SocketListener from './brewnode/socketListener.js';

import {getBatch, getInventory}  from './common/server-api';

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
  
  const [batch, setBatch] = useState({});
  const [inventory, setInventory] = useState({});

  SocketListener('progress', ({value}) => setInProgress(value));

  useEffect(() => {
    // setInProgress(r.name);
    getBatch().then(batch => {
      setBatch(batch);
    }).catch(e => {
      console.error(e);
    });

    getInventory().then(i => {
      setInventory(i);
      return () => setInProgress(''); 
    }).catch(e => {
      console.error(e);
    });
  }, [setInProgress]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}> 
        <MyContext.Provider value={{inProgress, setInProgress}}> 
          <MyAppBar/>
          <BasicTabs batch={batch} inventory={inventory}/>
        </MyContext.Provider>
      </ThemeProvider> 
    </div>
  )
}

export{ App, MyContext};
