import React, { useState, useEffect } from 'react';
import { streamLog } from '../brewnode/server-api';

const FileStreamer = () => {
  const [lines, setLines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const linesPerPage = 20; // Number of lines to display per page

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await streamLog();
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let partialLine = '';

        // eslint-disable-next-line no-control-regex
        const ansiEscapeRegex = /\x1b\[[0-9;]*m/g;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const sanitizedChunk = chunk.replace(ansiEscapeRegex, ''); // Remove ANSI escape sequences
          const chunkLines = (partialLine + sanitizedChunk).split('\n');
          partialLine = chunkLines.pop(); // Save the last partial line for the next chunk

          // Prepend the new lines to the existing lines
          setLines((prevLines) => [...chunkLines.reverse(), ...prevLines]);
        }

        if (partialLine) {
          // Prepend the last partial line if it exists
          const sanitizedPartialLine = partialLine.replace(ansiEscapeRegex, '');
          setLines((prevLines) => [sanitizedPartialLine, ...prevLines]);
        }
      } catch (error) {
        console.error('Error streaming file:', error);
      }
    };

    fetchFile();
  }, []);

  // Calculate the lines to display for the current page
  const startIndex = (currentPage - 1) * linesPerPage;
  const endIndex = startIndex + linesPerPage;
  const currentLines = lines.slice(startIndex, endIndex);

  // Handle pagination
  const totalPages = Math.ceil(lines.length / linesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left' }}>
      {currentLines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <div style={{ marginTop: '10px' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FileStreamer;