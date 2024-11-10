import {React, useContext} from 'react';

import Button from '@mui/material/Button';

import {MyContext } from '../App';
import * as server from '../common/server-api';

function Kettle2Mash() {
    const {inProgress, setInProgress} = useContext(MyContext);


    return (
        <Button 
        variant="contained"
        style={{ fontSize:"30px", width: "100%", height: "100%" }}
        size='large'
        disabled={inProgress!==''}
        onClick={() => {
            k2m();
        }}>Kettle => Mash</Button>
    );

    async function k2m() {
        try {
            const response = await server.k2m();
            return response.data;
        } catch (error) {
            setInProgress(error);   
            console.error(error);
            return error;    
              } 
  }
}

export default Kettle2Mash;