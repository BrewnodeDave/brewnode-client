import {React, useContext} from 'react';

import Button from '@mui/material/Button';

import {MyContext } from '../App';
import * as server from '../common/server-api';

function Kettle2Ferment() {
    const {inProgress, setInProgress} = useContext(MyContext);

    return (
        <Button variant="contained"
        style={{ fontSize:"30px", width: "100%", height: "100%" }}
        size='large'
        disabled={inProgress!==''}
        onClick={() => {
            k2f();
        }}>Kettle => Fermenter</Button>
    );

    async function k2f() {
        try {
            setInProgress(`Transfering Kettle to Fermenter ...`);         
            const response = await server.k2f();
            setInProgress('');         
            return response.data;
        } catch (error) {
            console.error(error);
        } 
  }
}

export default Kettle2Ferment;