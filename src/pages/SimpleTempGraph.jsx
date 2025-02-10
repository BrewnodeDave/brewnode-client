import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {getBrewdata } from '../common/server-api';

const SimpleTempGraph = (props) => {
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

  useEffect(() => {
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
    fetchData(props.brewname);
  }, [props.brewname]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>  );
};

export default SimpleTempGraph;


