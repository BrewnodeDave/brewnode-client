import React, { useEffect, useState, useCallback, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getBrewdata } from '../brewnode/php-service';
import EggTimer from './EggTimer';
import { memo } from 'react';


const sensorNames = [
  "Kettle Heater",
  "Valve Chiller wort-out",
  "Valve Chiller wort-in",
  "Valve Kettle-in",
  "Valve Mash-in",
  "Pump Mash",
  "Pump Kettle",
  "Pump Glycol",
  "Glycol Heater",
  "Glycol Chiller",
  "Fan",
];

const CombinedGraph = memo((props) => {
  const shownNames = useRef(new Set());

  const [chartSubtitle, setChartSubtitle] = useState();
  const [loading/*, setLoading*/] = useState(false);

  const inView = useRef([]);

  const setExtremes = useCallback((event) => {
    const start = event.min === undefined ? 0 : event.min;
    const end = event.min === undefined ? Number.MAX_SAFE_INTEGER : event.max;

    const isInView = (event.min === undefined)
      ? (t, start, end) => true
      : (t, start, end) => t > ms(start) && t < end;

    const filteredPoints = (s) => ({
      name: s.name,
      data: s.data.filter(([timestamp, value]) => {
        const t = ms(timestamp);
        return isInView(t, start, end);
      })
    })

    inView.current = JSON.parse(localStorage.getItem('series')).map(filteredPoints);
    calcKWHr();

  }, []);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      zooming: { type: "x" },
    },
    title: { text: props.brewname },
    subtitle: { text: chartSubtitle },
    xAxis: {
      type: "datetime",
      events: { setExtremes },
    },
    yAxis: [
      {
        title: { text: "Temp(°C)", style: { fontSize: '30px' } },
        opposite: true,
        labels: { style: { fontSize: '20px' } }
      },
      {
        title: { text: "Power(W)" },
        labels: { style: { fontSize: '20px' } }
      }
    ],
    legend: { enabled: true },
    plotOptions: {
      area: {
        marker: { radius: 2 },
        lineWidth: 2,
        states: { hover: { lineWidth: 1 } },
        threshold: null,
      },
    },
    series: JSON.parse(localStorage.getItem('series')),
    responsive: {
      rules: [
        {
          condition: {
            // maxWidth: 768, // Apply this rule for screens smaller than 768px
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },

  }, []);

  
  useEffect(() => {
    const responsive = {
      rules: [
        {
          condition: {
            // maxWidth: 768, // Apply this rule for screens smaller than 768px
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    };

    setChartOptions({
      chart: { zooming: { type: "x" } },
      title: { text: props.brewname },
      subtitle: { text: chartSubtitle },
      xAxis: {
        type: "datetime",
        events: { setExtremes },
        labels: { style: { fontSize: '16px' } },
      },
      yAxis: [
        { title: { text: "Power(W)", style: { fontSize: '30px' } }, opposite: true },
        { title: { text: "Temp(°C)", style: { fontSize: '30px' } } }
      ],
      legend: {
        enabled: true,
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'middle',
        itemStyle: { fontSize: '16px' }
      },
      plotOptions: {
        area: {
          marker: { radius: 2 },
          lineWidth: 2,
          states: { hover: { lineWidth: 1 } },
          threshold: null
        },
      },
      series: JSON.parse(localStorage.getItem('series')),
      responsive 
    });
  }, [chartSubtitle, setExtremes, props.brewname]);

  const clearLocalStorage = () => {
    localStorage.removeItem('series');
    localStorage.removeItem('prevTimestamp');
  };

  useEffect(clearLocalStorage, [props.brewname]);

  useEffect(clearLocalStorage, []);

  const fetchData = async (brew) => {
    if (typeof brew !== 'string') return null;

    const addBasePowerSeries = (series) => {
      const BASE_POWER = 10; // Watts
      const basePowerSeries = (start, end) => ({
        name: "Base Power",
        data: [
          [start, 0],
          [start + 1, BASE_POWER],
          [end, BASE_POWER],
          [end + 1, 0],
        ],
      });

      const milliSecs = (timestamp) => new Date(timestamp).getTime();
      const mins = series.map((sensor) => sensor.data[0][0]).map(ms);
      const minValue = Math.min(...mins);

      const timestamp = (sensor) => sensor.data[sensor.data.length - 1][0];

      const maxs = series.map(sensor => milliSecs(timestamp(sensor)));

      const maxValue = Math.max(...maxs);
      return basePowerSeries(minValue, maxValue);
    };

    try {
      // setLoading(true);
      const latestString = localStorage.prevTimestamp ? localStorage.prevTimestamp : '';
      const { highcharts: sensors, latestTimestamp, err } = await getBrewdata(brew, latestString);
      // setLoading(false);
      if (err) {
        console.error(err);
        return;
      }
      localStorage.setItem('prevTimestamp', latestTimestamp);
      const energySensors = sensors.filter(({ name }) => sensorNames.includes(name));

      const tempSensorNames = ['Temp Glycol', 'Temp Ambient', 'Temp Kettle', 'Temp Mash', 'Temp Fermenter', 'Temp Glycol'];
      const tempSensors = sensors.filter(({ name }) => tempSensorNames.includes(name));

      if (energySensors.length > 0) {
        const basePower = addBasePowerSeries(energySensors);
        energySensors.push(basePower);
      }
      
      const energyChart = (energySensor) => {
        shownNames.current.add(energySensor.name);
        return {
          cumulative: true,
          type: "area",
          yAxis: 0,
          events: {
            hide: () => {
              shownNames.current.delete(energySensor.name);
              calcKWHr();
            },
            show: () => {
              shownNames.current.add(energySensor.name);
              calcKWHr();
            },
          },
          ...energySensor,
        };
      }
      const tempChart = (tempSensor) => ({
        type: "line",
        yAxis: 1,
        ...tempSensor,
      });

      const energySensorsChart = energySensors.map(energyChart);
      const tempSensorsChart = tempSensors.map(tempChart);

      const newSeries = [...energySensorsChart, ...tempSensorsChart];
      const series2 = JSON.parse(localStorage.getItem('series'));
      const series = series2 ? series2 : [];
      merge(newSeries, series);
      localStorage.setItem('series', JSON.stringify(series));

      setExtremes({ min: undefined, max: undefined });

      function merge(newSeries, series) {
        // const toSet = a => [...new Set(a)];

        const removeDuplicatePairs = (array) => {
          const map = new Map();
          array.forEach(pair => {
            const key = JSON.stringify(pair);
            if (!map.has(key)) {
              map.set(key, pair);
            }
          });
          return Array.from(map.values());
        };

        // const foo = new Map(series.map((s) => [s.name, s]));
        newSeries.forEach((newS) => {
          const oldS = series.find((s) => s.name === newS.name);
          if (oldS) {
            oldS.data = [...oldS.data, ...newS.data];
            const foo = removeDuplicatePairs(oldS.data);
            oldS.data = foo;

            console.log(oldS.data.length)
          } else {
            series.push(newS);
            // foo.add(newS.name, newS);
          }
        });
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetch = async () => await fetchData(props.brewname);
    fetch();
  }); // Empty dependency array ensures this runs only once

  function calcKWHr() {
    let totalE = 0;
    const shownSeries = inView.current.filter((s) => shownNames.current.has(s.name));

    shownSeries.reduce((prevSeries, currSeries) => {
      return currSeries.data.reduce(
        ([prevTimestamp, prevValue], [currTimestamp, currValue]) => {
          const prevms = new Date(prevTimestamp).getTime();
          const currms = new Date(currTimestamp).getTime();

          const deltaSecs = (currms - prevms) / 1000;
          totalE += prevValue * deltaSecs;
          return [currTimestamp, currValue];
        },
        currSeries.data[0]
      );
    }, inView.current[0]);

    const KWHr = totalE / 1000 / (60 * 60);
    const POUNDS_PER_KWHR = 0.2392;

    setChartSubtitle(`Total energy consumption: ${KWHr.toFixed(2)} KWhr (£${(KWHr * POUNDS_PER_KWHR).toFixed(2)})`);
  }

  const ms = (timestamp) => new Date(timestamp).getTime();

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      {loading && <EggTimer />}
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: "100%", height: "100%" } }}
      />
    </div>
  );
});

export default CombinedGraph;
