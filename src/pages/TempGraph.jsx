import React, { useEffect, useState } from 'react';

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import {getBrewdata } from '../common/server-api';
import SimpleTempGraph from './SimpleTempGraph';

const TempGraph = (props) => {
  const [series, setSeries] = useState([]);
  const [brewNames] = useState(props.brewnames);
  const [selectedBrew, setSelectedBrew] = useState(props.brewnames[0]);

  const handleBrewChange = (event) => {
    setSelectedBrew(event.target.value);
  };

  const [chartOptions, setChartOptions] = useState({
    chart: {
      zooming: {
          type: 'x'
      }
    },
    title: { text: `Temperatures` },
    subtitle: {
        text: ''
    },
    xAxis: {type: 'datetime'},
    yAxis: {title: {text: '°C'}},
    legend: {enabled: true},
    plotOptions: {
      area: {
          marker: {radius: 2},
          lineWidth: 1,
          states: {
              hover: {lineWidth: 1}
          },
          threshold: null
      }
    },      
    series,
  });

  useEffect(() => {
    setChartOptions({
      ...chartOptions,
      title: { text: `Temperatures` },
      series
    });
  }, [series,chartOptions]);


  const fetchData = async (brewname) => {
    try {
      const sensors = await getBrewdata(brewname);
      const sensorNames = ['TempKettle', 'TempMash', 'TempFermenter', 'TempGlycol'];
      setSeries(sensors.filter(({ name }) => sensorNames.includes(name)));
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(selectedBrew);
  }, [selectedBrew]);
  

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel id="brew-select-label">Select Brew</InputLabel>
          <Select
            labelId="brew-select-label"
            id="brew-select"
            value={selectedBrew}
            onChange={handleBrewChange}
            label="Select Brew"
            sx={{ fontSize: '1.5rem' }}
          >
            {brewNames.map((brew) => (
              <MenuItem key={brew} value={brew} sx={{ fontSize: '1.5rem' }}>
                {brew}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <SimpleTempGraph brewname={selectedBrew} />
     
    </div>  );
};

export default TempGraph;


