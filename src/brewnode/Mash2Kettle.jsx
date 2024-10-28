import {React, useContext} from 'react';

import Button from '@mui/material/Button';
import {MyContext } from '../App';
import * as server from '../common/server-api';

function Mash2Kettle() {
    const {inProgress, setInProgress} = useContext(MyContext);

    return (
        <Button variant="contained"
        style={{ fontSize:"30px", width: "100%", height: "100%" }}
        size='large'
        disabled={inProgress!==''}
        onClick={() => {
            m2k();
        }}>Mash => Kettle</Button>
    );

    async function m2k() {
        try {
            setInProgress("Transferring Mash Tun to Kettle...");         
            const response = await server.m2k();
            setInProgress('');        
            return response.data;
        } catch (error) {
            console.error(error);
        } 
  }
}

export default Mash2Kettle;