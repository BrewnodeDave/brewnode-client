import React, { useEffect, useRef, useState, useCallback } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getBrewdata } from "../common/server-api";

const POUNDS_PER_KWHR = 0.2531;
const BASE_POWER = 50;

const EnergyGraph = (props) => {
  const shownNames = useRef(new Set());

  const [series, setSeries] = useState([]);
  const [chartSubtitle, setChartSubtitle] = useState('');
  
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

    inView.current = series.map(filteredPoints);
    calcKWHr();

  },[series]);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      zooming: { type: "x" },
    },
    title: { text: `Energy Use` },
    subtitle: { text: chartSubtitle },
    xAxis: {
      type: "datetime",
      events: {setExtremes},
    },
    yAxis: { title: { text: "Watts" } },
    legend: { enabled: true },
    plotOptions: {
      area: {
        marker: { radius: 2 },
        lineWidth: 2,
        states: {hover: { lineWidth: 1 }},
        threshold: null,
      },
    },
    series,
  },[]);

  useEffect(() => {
    setChartOptions({
      chart: {zooming: { type: "x" }},
      title: { text: 'Energy Use' },
      subtitle: { text: chartSubtitle },
      xAxis: {
        type: "datetime",
        events: {setExtremes}, 
        labels: {style: {fontSize: '16px'}},        
      },
      yAxis: { title: { text: "Watts" } },
      legend: { 
        enabled: true,
        itemStyle: {fontSize: '20px'}
      },
      plotOptions: {
        area: {
          marker: { radius: 2 },
          lineWidth: 2,
          states: {hover: { lineWidth: 1 }},
          threshold: null
        },
      },
      series
    });
  }, [series, chartSubtitle, setExtremes]);

  const fetchData = useCallback(async (brew) => {
    const addBasePowerSeries = (series) => {
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
      const sensors = await getBrewdata(brew);
      const sensorNames = [
        "Heater",
        "ValveFermentIn",
        "ValveChillWortIn",
        "ValveKettleIn",
        "ValveMashIn",
        "PumpMash",
        "PumpKettle",
        "PumpGlycol",
        "GlycolHeater",
        "GlycolChiller",
        "Fan",
      ];
      const energySensors = sensors.filter(({ name }) => sensorNames.includes(name));

      const basePower = addBasePowerSeries(energySensors);

      energySensors.push(basePower);
      
      setSeries(
        energySensors.map((energySensor) => {
          shownNames.current.add(energySensor.name);
          return {
            cumulative: true,
            type: "area",
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
        })
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    async function foo() {
      await fetchData(props.brewname);
    }
    foo();
  }, [props.brewname, fetchData]);


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
    setChartSubtitle(`Total energy consumption: ${KWHr.toFixed(2)} KWhr (£${(KWHr * POUNDS_PER_KWHR).toFixed(2)})`);
  }

  const ms = (timestamp) => new Date(timestamp).getTime();

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: "100%"} }}
      />
    </div>
  );
};

export default EnergyGraph;
