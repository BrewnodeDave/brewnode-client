import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import {getBrewdata, getBrewnames} from '../common/server-api';

const TempGraph = (props) => {
  const [series, setSeries] = useState([]);
  const [brewNames, setBrewNames] = useState([]);
  const [selectedBrew, setSelectedBrew] = useState(props.brewname);

  useEffect(() => {
    const fetchBrewNames = async () => {
      try {
        const brewnames = await getBrewnames();
        setBrewNames(brewnames);
        setSelectedBrew(brewnames[0]);
      } catch (error) {
        console.error('Error fetching brew names:', error);
      }
    };

    fetchBrewNames();
  }, []);

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
  }, [series]);


  const fetchData = async (brewname) => {
    try {
      const sensors = await getBrewdata(brewname);
      const sensorNames = ['TempKettle', 'TempMash', 'TempFermenter'];
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
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel id="brew-select-label">Select Brew</InputLabel>
          <Select
            labelId="brew-select-label"
            id="brew-select"
            value={selectedBrew}
            onChange={handleBrewChange}
            label="Select Brew"
            sx={{ fontSize: '2rem' }}
          >
            {brewNames.map((brew) => (
              <MenuItem key={brew} value={brew} sx={{ fontSize: '2rem' }}>
                {brew}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>  );
};

export default TempGraph;


