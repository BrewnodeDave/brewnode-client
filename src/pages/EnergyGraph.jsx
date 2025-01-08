import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {getBrewdata} from '../common/server-api';

const POUNDS_PER_KWHR = 0.2291;
const BASE_POWER = 200;
      

const EnergyGraph = (props) => {

  const seriesRef = useRef([]);
  const subtitleRef = useRef('');

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

  const addBasePowerSeries = (series) => {
    const basePowerSeries = (start, end) => ({
      name: "Base Power",
      data: [[start, BASE_POWER], [end, BASE_POWER]]
    });
    
    const ms = timestamp => new Date(timestamp).getTime();
    const mins = series.current.map(sensor => sensor.data[0][0]).map(ms);
    const minValue = Math.min(...mins);
    const maxs = series.current.map(sensor => sensor.data[sensor.data.length-1][0]).map(ms);
    const maxValue = Math.max(...maxs);
    series.current.push(basePowerSeries(minValue, maxValue));
  };
  
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
    subtitleRef.current = `Total energy consumption: ${KWHr.toFixed(2)} KWhr (£${(KWHr*POUNDS_PER_KWHR).toFixed(2)})`;

    setChartOptions((prevOptions) => ({
      ...prevOptions,
      subtitle:{text: subtitleRef.current},
      series: seriesRef.current,
    }));
  }


  const [chartOptions, setChartOptions] = useState({
        chart: {
          zooming: {type: 'x'},
        },
        title: {text: `${props.brewname}`},
        subtitle: {text: subtitleRef.current},
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

        // addBasePowerSeries(seriesRef);

        KWHr = calcKWHr(seriesRef.current);
        subtitleRef.current = `Total energy consumption: ${KWHr.toFixed(2)} KWhr (£${(KWHr*POUNDS_PER_KWHR).toFixed(2)})`;

        seriesRef.current = seriesRef.current.map(series => ({ cumulative: true, type:'area', ...series}));                
          
      }
      catch (error) {
        console.error(error);
      }

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        subtitle:{text:`Total energy consumption: ${KWHr.toFixed(2)} KWhr (£${(KWHr*POUNDS_PER_KWHR).toFixed(2)})`},
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


