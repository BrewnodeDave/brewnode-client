import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {getBrewdata} from '../common/server-api';

const EnergyGraph = (props) => {
  const seriesRef = useRef([]);

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

  const ms = timestamp => new Date(timestamp).getTime();

  function setExtremes(event){
    const start = (event.min === undefined) ? 0 : event.min;
    const end = (event.min === undefined) ? Number.MAX_SAFE_INTEGER : event.max;
    
    const foo = (event.min === undefined) 
      ? (t, start, end) => true
      : (t, start, end) => (t > ms(start)) && (t < end);

    const f = seriesRef.current.map(series => {
      return {data: series.data.filter(([timestamp, value]) => {
        const t = ms(timestamp);
        return foo(t, start, end);
      })};
    });

    const KWHr = calcKWHr(f);
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      subtitle:{text:`Total energy consumption: ${KWHr.toFixed(20)} KWhr`},
      series: seriesRef.current,
    }));
  }


  const [chartOptions, setChartOptions] = useState({
        chart: {
          zooming: {type: 'x'},
          events: {
            // selection 
          },
        },
        title: {text: `${props.brewname}`},
        subtitle: {text: ``},
        xAxis: {
          type: 'datetime',
          events: {
            setExtremes
          },
        },
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


