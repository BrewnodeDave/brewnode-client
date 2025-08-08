import React from 'react';
import {createContext, useEffect, useState} from 'react';

import { responsiveFontSizes, createTheme, ThemeProvider } from '@mui/material/styles';
import {lightGreen} from '@mui/material/colors';
import Button from '@mui/material/Button';

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
  const [fetchRecipe, setFetchRecipe] = useState(false);

  useEffect(()=>{
    addSocketListener('Progress', (value) => {
      setInProgress(value);
    });
  }, []); // Empty dependency array ensures this runs only once

  const toggleFetchRecipe = () => {
    setFetchRecipe(!fetchRecipe);

  };
  
  return (
    <div className="App" style={{ padding: 0, width: '100%', height: '100%', minHeight: '100vh', minWidth: '100vw', boxSizing: 'border-box', overflow: 'hidden' }}>
      <ThemeProvider theme={theme}> 
        <MyContext.Provider value={{inProgress, setInProgress}}> 
          <MyAppBar
            actionButton={
              <Button 
                variant="contained" 
                onClick={toggleFetchRecipe}
                style={{ 
                  marginLeft: 16,
                  display: 'flex',
                  alignItems: 'center'
                }}
                startIcon={
                  <img
                    src="/static/images/brewfather.png"
                    alt="Brewfather"
                    style={{ width: '10vw', height: '5vh' }}
                  />
                }
              >
              </Button>
            }
          />
          <BasicTabs fetchBatch={fetchRecipe}/>
        </MyContext.Provider>
      </ThemeProvider> 
    </div>
  )
}

export { App, MyContext };
