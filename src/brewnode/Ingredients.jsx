import {React,/* useContext, useEffect, useState*/} from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import CardHeader from '@mui/material/CardHeader';

import maltIcon from '../static/images/malt.jpg'; 
import hopsIcon from '../static/images/hops.jpg'; 
import yeastIcon from '../static/images/yeast.jpg'; 

function Ingredients({fermentables = [], hops = [], yeasts = []}) {  
  const maltBackground = "wheat";
  const hopBackground = "lightgreen";
  const yeastBackground = "floralwhite";
    
  fermentables?.sort(compare);
  hops?.sort(compare);
  yeasts?.sort(compare);

  const foo = (p,c)=>Math.trunc((p+c.amount)*10)/10;
  const totalFermentables = fermentables?.reduce(foo, 0);
  const totalHops = hops.reduce(foo,0);
  const totalYeasts = yeasts.reduce(foo,0);

  return (  
    <Box >
    <Grid container>
      <Grid item xs={12} md={4} sx={{ border: 0}} >
        <CardHeader
          sx={{ background:maltBackground}} 
          avatar={<Avatar src={maltIcon}/>}
          title={<Typography variant="h4">Malt ({totalFermentables}Kg)</Typography>}
        />
        <List>
          {fermentables?.map(fermentable => list(fermentable.name, `${fermentable.amount} Kg`, maltBackground))}
        </List>
      </Grid>

      <Grid item xs={12} md={4} sx={{ border: 0}} >
        <CardHeader
          sx={{ background:hopBackground}} 
          avatar={<Avatar src={hopsIcon}/>}
          title={<Typography variant="h4">Hops ({totalHops}g)</Typography>}
        />
        <List>
          {hops.map(hop => list(hop.name, `${Math.round(hop.amount)} g`, hopBackground))}
        </List>
      </Grid>

      <Grid item xs={12} md={4} sx={{ border: 0}}>
        <CardHeader
          sx={{ background:yeastBackground}} 
          avatar={<Avatar src={yeastIcon}/>}
          title={<Typography variant="h4" >Yeast ({totalYeasts}pkt)</Typography>}
        />
        <List>
          {yeasts.map(yeast => list(yeast.name, `${yeast.amount} pkt`, yeastBackground))}
        </List>
      </Grid>
    </Grid>
  </Box>
  ) 
}

function compare( a, b ) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

function list(primary, secondary, background="white") {
  return (
    <ListItem sx={{background}} >
      <ListItemText  primary={primary} secondary={secondary}
      primaryTypographyProps={{
        fontSize: 20,
        fontWeight: 'large',
        letterSpacing: 0,
      }}      
      secondaryTypographyProps={{
        fontSize: 15,
        fontWeight: 'medium',
        letterSpacing: 0,
      }}/>
    </ListItem>
  )
}

export default Ingredients;


