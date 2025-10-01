import {React, useEffect, useState, useContext} from 'react';

import { MyContext } from '../App.js';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {Devices} from './Devices'; 
import AutomaticTab from './AutomaticTab.jsx';
import ManualTab from './ManualTab.jsx';

import ErrorDialog from "../Error.jsx";
import CombinedGraph from "../components/CombinedGraph.jsx";

import {getBatch}  from '../brewnode/server-api.js';

// import Ingredients from '../brewnode/Ingredients.jsx';
import FileStreamer from '../components/FileStreamer';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: '100vh' }}
    >
      {value === index && (
        <Box p={3} sx={{ height: '100%' }}>
          <Typography sx={{ height: '100%' }}>{children}</Typography>
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


export default function BasicTabs(props) {
  const [batch, setBatch] = useState({});
  const [value, setValue] = useState(0);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [brewname, setBrewname] = useState([]);
  const { setInProgress } = useContext(MyContext);
  useEffect(() => {
    getBatch().then(
      batch => {
        setBrewname(batch.name);
        setBatch(batch);
        if (setInProgress) setInProgress(batch.name);
      },
      handleError
    );
    return () => {};
  }, [props.fetchBatch, setInProgress]);

  const handleChange = (event, newValue) => setValue(newValue);
  const handleError = (error) => {
    setError(error?.response?.data || error.message || error);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 0, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
          <Tab label="Manual" {...a11yProps(0)} sx={{ fontSize: "3vw" }} />
          <Tab label="Automatic" {...a11yProps(1)} sx={{ fontSize: "3vw" }} />
          <Tab label="Devices" {...a11yProps(2)} sx={{ fontSize: "3vw" }} />
          <Tab label="Graphs" {...a11yProps(3)} sx={{ fontSize: "3vw" }} />
          <Tab label="Log" {...a11yProps(4)} sx={{ fontSize: "3vw" }} />
        </Tabs>
        <ErrorDialog
          open={open}
          handleClose={handleClose}
          title="Error"
          message={error}
        />
      </Box>

      <TabPanel value={value} index={0}>
        <ManualTab />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <AutomaticTab batch={batch} />
      </TabPanel>


      <TabPanel value={value} index={2}>
        <Box sx={{ height: '100%', width: '100%' }}>
          <Devices />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Box sx={{ height: '100%', width: '100%' }}>
          <CombinedGraph brewname={brewname} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <FileStreamer />
      </TabPanel>
    </Box>
  );
}
