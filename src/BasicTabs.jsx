import {React, useState} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {getBatch, getInventory}  from './common/server-api';

import {useEffect} from 'react';

import AutomaticTab from './AutomaticTab.jsx';
import ManualTab from './ManualTab.jsx';
import Ingredients from './brewnode/Ingredients.jsx';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const setAmount = o => o.amount = o.inventory;

function rename(amount){
  amount?.fermentables?.forEach(setAmount);
  amount?.hops?.forEach(setAmount);
  amount?.yeasts?.forEach(setAmount);
  return amount;
}

export default function BasicTabs(props) {
  const [batch, setBatch] = useState({});
  const [inventory, setInventory] = useState({});
  const [value, setValue] = useState(0);

  useEffect(() => {
    getBatch().then(batch => {
      setBatch(batch);
    });
    return () => {};
  }, []);

  useEffect(() => {
    getInventory().then(i => {
      setInventory(rename(i));
    });
    return () => {};
  }, []);

  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
          <Tab label="Manual" {...a11yProps(0)} sx={{fontSize: 36}}/>
          <Tab label="Automatic" {...a11yProps(1)} sx={{fontSize: 36}}/>
          <Tab label="Ingredients" {...a11yProps(2)} sx={{fontSize: 36}}/>
          <Tab label="Inventory" {...a11yProps(2)} sx={{fontSize: 36}}/>
        </Tabs>

      </Box>
      
      <TabPanel value={value} index={0}>
        <ManualTab/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <AutomaticTab batch={batch}/>
      </TabPanel>
      
      <TabPanel value={value} index={2}>
        <Ingredients fermentables={batch.fermentables} hops={batch.hops} yeasts={batch.yeasts}/>
      </TabPanel>
      
      <TabPanel value={value} index={3}>
        <Ingredients fermentables={inventory.fermentables} hops={inventory.hops} yeasts={inventory.yeasts}/>
      </TabPanel>
    </Box>
  );
}