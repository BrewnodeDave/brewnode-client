import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { openDB } from 'idb';

import {addSocketListener, removeSocketListener} from '../brewnode/socketListener.js';

const DB_VERSION = 3;

// Register the required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const tempKettleColour = [255,0,0];
const tempFermenterColour = [0,255,0];
const tempMashColour = [0,255,255];

const clearDatabase = async () => {
  const db = await openDB('RealTimeDB', DB_VERSION);

  await db.clear('tempKettleData');
  // const tempKettleValues = await db.getAll('tempKettleData');
  // setTempKettle(tempKettleValues); // Refresh the data after clearing the database

  await db.clear('tempFermenterData');
  // const tempFermenterValues = await db.getAll('tempFermenterData');
  // setTempFermenter(tempFermenterValues); // Refresh the data after clearing the database

  await db.clear('tempMashData');
  // const tempMashValues = await db.getAll('tempMashData');
  // setTempMash(tempMashValues); // Refresh the data after clearing the database
};


const RealTimeGraph = () => {
  const [tempKettleData, setTempKettle] = useState([]);
  const [tempFermenterData, setTempFermenter] = useState([]);
  const [tempMashData, setTempMash] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Kettle Temp',
        data: [],
        borderColor: `rgba(${tempKettleColour},1)`,
        backgroundColor: `rgba(${tempKettleColour},0.2)`,
      },
      {
        label: 'Fermenter Temp',
        data: [],
        borderColor: `rgba(${tempFermenterColour},1)`,
        backgroundColor: `rgba(${tempFermenterColour},0.2)`,
      },
      {
        label: 'Mash Temp',
        data: [],
        borderColor: `rgba(${tempMashColour},1`,
        backgroundColor: `rgba(${tempMashColour},0.2)`,
      }
    ],
  });

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB('RealTimeDB', DB_VERSION, {
        upgrade: function(db) {
          if (!db.objectStoreNames.contains('tempKettleData')) {
            db.createObjectStore('tempKettleData', { keyPath: 'timestamp' });
          }
          if (!db.objectStoreNames.contains('tempFermenterData')) {
            db.createObjectStore('tempFermenterData', { keyPath: 'timestamp' });
          }
          if (!db.objectStoreNames.contains('tempMashData')) {
            db.createObjectStore('tempMashData', { keyPath: 'timestamp' });
          }
        },
      });
      return db;
    };

    const dbPromise = initDB();

    const addTempKettleToDB = async (value) => {
      const db = await dbPromise;
      await db.put('tempKettleData', { timestamp: Date.now(), value });
    };
    const addTempFermenterToDB = async (value) => {
      const db = await dbPromise;
      await db.put('tempFermenterData', { timestamp: Date.now(), value });
    };
    const addTempMashToDB = async (value) => {
      const db = await dbPromise;
      await db.put('tempMashData', { timestamp: Date.now(), value });
    };

    const fetchDataFromDB = async () => {
      const db = await dbPromise;
      const tempKettleData = await db.getAll('tempKettleData');
      setTempKettle(tempKettleData);
      const tempFermenterData = await db.getAll('tempFermenterData');
      setTempFermenter(tempFermenterData);
      const tempMashData = await db.getAll('tempMashData');
      setTempMash(tempMashData);
    };

    async function handleTempKettle ({ value }) {
      await addTempKettleToDB(value);
      fetchDataFromDB();
    }
    async function handleTempFermenter ({ value }) {
      await addTempFermenterToDB(value);
      fetchDataFromDB();
    }
    async function handleTempMash ({ value }) {
      await addTempMashToDB(value);
      fetchDataFromDB();
    }

    addSocketListener('TempKettle', handleTempKettle);
    addSocketListener('TempKettle', handleTempFermenter);
    addSocketListener('TempKettle', handleTempMash);

    fetchDataFromDB();

    return () => {
      removeSocketListener('TempKettle', handleTempKettle);
      removeSocketListener('TemFermenter', handleTempFermenter);
      removeSocketListener('TempMash', handleTempMash);
    };
  }, []);

  useEffect(() => {
    const labels = tempKettleData.map((d) => new Date(d.timestamp).toLocaleTimeString());
    const tempKettleValues = tempKettleData.map((d) => d.value);
    const tempFermenterValues = tempFermenterData.map((d) => d.value);
    const tempMashValues = tempMashData.map((d) => d.value);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Kettle Temp',
          data: tempKettleValues,
          borderColor: `rgba(${tempKettleColour},1)`,
          backgroundColor: `rgba(${tempKettleColour},0.2)`,
        },
        {
          label: 'Fermenter Temp',  
          data: tempFermenterValues,
          borderColor: `rgba(${tempFermenterColour},1)`,
          backgroundColor: `rgba(${tempFermenterColour},0.2)`,
        },
        {
          label: 'Mash Temp',  
          data: tempMashValues,
          borderColor: `rgba(${tempMashColour},1)`,
          backgroundColor: `rgba(${tempMashColour},0.2)`,
        },
      ],
    });
  }, [tempKettleData, tempFermenterData, tempMashData]);

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export {
  RealTimeGraph, 
  clearDatabase
};