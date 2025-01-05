import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {getBrewdata} from '../common/server-api';

const EnergyGraph = (props) => {
  const seriesRef = useRef([]);
  const [chartOptions, setChartOptions] = useState({
        chart: {zooming: {type: 'x'}},
        title: {text: `${props.brewname}`},
        subtitle: {text: ``},
        xAxis: {type: 'datetime'},
        yAxis: {title: {text: 'Watts'}},
        legend: {enabled: true},
        plotOptions: {
            area: {
                marker: {radius: 2},
                lineWidth: 2,
                states: {
                    hover: {lineWidth: 1}
                },
                threshold: null
            }
        },
        series: seriesRef.current,
  });


  useEffect(() => {
    function calcKWHr(series) {
      let totalE = 0;  
      series.reduce((prevSeries, currSeries) => {
        return currSeries.data.reduce(([prevTimestamp, prevValue], [currTimestamp, currValue]) => {
          
          const prevms = (new Date(prevTimestamp)).getTime();
          const currms = (new Date(currTimestamp)).getTime();

          const deltaSecs = (currms - prevms) / 1000;
          totalE += prevValue * deltaSecs;
          return [currTimestamp, currValue];
        }, currSeries.data[0]);
      },seriesRef.current[0]);

      return (totalE / 1000) / (60 * 60);
    }

    const fetchData = async () => {
      let KWHr = 0;
      try {
        const sensors = await getBrewdata(props.brewname);
        const sensorNames = [
          'Heater', 
          "ValveFermentIn", 
          "ValveChillWortIn",
          "ValveKettleIn",
          "ValveMashIn",
          "PumpMash",
          "PumpKettle",
          "PumpGlycol",
          "Fan"];
        seriesRef.current = sensors.filter(({ name }) => sensorNames.includes(name));

        KWHr = calcKWHr(seriesRef.current);
        
        seriesRef.current = seriesRef.current.map(series => ({ cumulative: true, type:'area', ...series}));                

      }
      catch (error) {
        console.error(error);
      }


      setChartOptions((prevOptions) => ({
        ...prevOptions,
        subtitle:{text:`Total energy consumption: ${KWHr.toFixed(2)} KWhr`},
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

export default EnergyGraph;


