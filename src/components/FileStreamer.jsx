import React, { useState, useEffect } from 'react';
import { streamLog } from '../brewnode/server-api';

const FileStreamer = () => {
  const [lines, setLines] = useState([]);

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
          setLines((prevLines) => [partialLine, ...prevLines]);
        }
      } catch (error) {
        console.error('Error streaming file:', error);
      }
    };

    fetchFile();
  }, []);

  return (
    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left' }}>
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};

export default FileStreamer;