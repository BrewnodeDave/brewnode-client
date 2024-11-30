import {useContext, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {MyContext } from '../../App';
import * as server from '../../common/server-api';

function AutoBrew(props) {
  const {inProgress, setInProgress} = useContext(MyContext);
  
  // const boilMins = props.recipe?.boilTime;
  const strikeLitres =  props.recipe?.data?.mashWaterAmount;
  // const strikeTemp = props.recipe?.data.strikeTemp;
  const mashSteps = [] | props.recipe?.mash?.steps 
    ? Object.entries(props.recipe?.mash?.steps).map(step => step[1]) 
    : [];

  useEffect(() => {
    return () => {}; 
  }, []);

  async function fill(litres) {
      setInProgress(`Filling Kettle with ${litres}L ...`);   
      const response = await server.fill(litres);
      setInProgress(false);   
      return response.data;
  }

  
  async function mash(mashSteps) {  
    if (mashSteps.length === 0) return;
        setInProgress(`Mashing ...`);   
        const response = await server.mash(mashSteps);    
        setInProgress(false);   
        return response.data;
  }

  async function brew() {
    try {
      await fill(strikeLitres);
      await mash(mashSteps);
      // await boil(boilMins);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ border: 1, padding:2 }}>
      <Button variant="contained"
        style={{ fontSize:"30px",width: "100%", height: "100%" }}
        size='large'
        disabled={inProgress!==''}
        onClick={brew}>
        Fill & Mash
      </Button>
    </Box>
  );
}

export default AutoBrew;