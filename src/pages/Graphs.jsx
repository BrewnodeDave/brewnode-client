import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TempGraph from './TempGraph.jsx';
import EnergyGraph from './EnergyGraph.jsx';

const numPages = 2;

const Graphs = (props) => {  
  const [page, setPage] = useState(1);
  const [brewnames] = useState(props.brewnames);
    
  const handlePrev = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNext = () => {
    setPage((prevPage) => (prevPage < numPages ? prevPage + 1 : prevPage)); // Adjust the max page number as needed
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Button
        size="large"
        onClick={handlePrev}
        disabled={page === 1}
        sx={{ position: 'absolute', left: -30, top: '50%', transform: 'translateY(-50%)' }}
      >
        <Typography sx={{ fontSize: 100 }}>&lt;</Typography>
      </Button>

      <Container>
        {page === 1 && (
          <TempGraph brewnames = {brewnames}/>
          )}
        {page === 2 && (
          <EnergyGraph brewnames = {brewnames}/>
        )}
      </Container>

      <Button
        size="large"
        onClick={handleNext}
        disabled={page === numPages}
        sx={{ position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)' }}
      >
        <Typography sx={{ fontSize: 100 }}>&gt;</Typography>
      </Button>
    </div>
  );
};

export {Graphs};