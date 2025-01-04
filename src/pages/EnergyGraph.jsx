import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {getBrewdata} from '../common/server-api';

const EnergyGraph = (props) => {
  const seriesRef = useRef([]);

  const [chartOptions, setChartOptions] = useState({
    chart: {
            zooming: {
                type: 'x'
            }
        },
        title: {
            text: `${props.brewname} energy consumption`
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' :
                'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Watts'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgb(199, 113, 243)'],
                        [0.7, 'rgb(76, 175, 254)']
                    ]
                },
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        
        series: seriesRef.current,
  });

  useEffect(() => {
    const fetchData = async () => {
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
        seriesRef.current = seriesRef.current.map(series => ({type:'area', ...series}));
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

export default EnergyGraph;


