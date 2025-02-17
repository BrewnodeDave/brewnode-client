import React, { useEffect, useState } from 'react';

import {getBrewdata } from '../common/server-api';
import SimpleTempGraph from './SimpleTempGraph';

const TempGraph = (props) => {
  const [series, setSeries] = useState([]);

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
      const sensorNames = ['TempAmbient', 'TempKettle', 'TempMash', 'TempFermenter', 'TempGlycol'];
      setSeries(sensors.filter(({ name }) => sensorNames.includes(name)));
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(props.brewname);
  }, [props.brewname]);
  

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      
      <SimpleTempGraph brewname={props.brewname} />
     
    </div>  );
};

export default TempGraph;


