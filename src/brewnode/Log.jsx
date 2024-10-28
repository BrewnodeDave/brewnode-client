import React, {useEffect, useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import SocketListener from './socketListener.js';

const columns = [
  { field: 'id', headerName: 'timestamp', width:200},
  { field: 'severity', width: 100 },
  { field: 'value', width: 500},
];

const createRow = (x) => ({
    id: new Date(x.ts).toLocaleString(), 
    severity:x.level.toUpperCase(), 
    value: `${x.msg[0]} ${x.msg[1]}`  
});

export default function Log() {
  const [rows, setRows] = useState(() => []);

  useEffect(() => {
    SocketListener('log', entry => {
      if (entry.value){
        setRows((prevRows) => [createRow(entry.value), ...prevRows]);
      }
    });
   
    return function cleanup (){
      console.log("log stop")
    }
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 200, mt: 0 }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
}