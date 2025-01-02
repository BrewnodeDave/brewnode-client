import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {getBrewdata} from '../common/server-api';

const Graph = (props) => {
  const seriesRef = useRef([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {type: 'spline'},
    title: {text: `${props.brewname} temperatures`},
    subtitle: {text: ''},
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
          // don't display the year
          month: '%e. %b',
          year: '%b'
      },
      title: {text: 'Date'}
    },
    yAxis: {
      title: {text: '°C'}
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f}°C'
    },
    plotOptions: {
      series: {
        marker: {
            symbol: 'circle',
            fillColor: '#FFFFFF',
            enabled: true,
            radius: 2.5,
            lineWidth: 1,
            lineColor: null
        }
      }
    },

    colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

    series: seriesRef.current,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sensors = await getBrewdata(props.brewname);
        const sensorNames = ['TempKettle', 'TempMash', 'TempFermenter'];
        seriesRef.current = sensors.filter(({ name }) => sensorNames.includes(name));
      }
      catch (error) {
        console.error(error);
      }

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        series: seriesRef.current,
      }));
    };

    fetchData();
  }, [props.brewname]);
  


  return (
<div style={{ width: '100%', height: '100vh' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>  );
};

export { Graph };


