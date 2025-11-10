import React, { useState, useEffect } from 'react';
import { deleteLog, streamLog } from '../brewnode/server-api';
const { addSocketListener, removeSocketListener } = require('../brewnode/socketListener');

const FileStreamer = () => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debugInfo, setDebugInfo] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [linesPerPage, setLinesPerPage] = useState(20);
  const [jumpToPage, setJumpToPage] = useState('');
  const [logFilter, setLogFilter] = useState({ info: true, warn: true, error: true, debug: true });
  const logContentRef = React.useRef(null);

  // Helper function to extract log level from log entry
  const getLogLevel = (logLine) => {
    if (typeof logLine === 'string') {
      const levelMatch = logLine.match(/\[(INFO|WARN|ERROR|CRITICAL)\]/i);
      if (levelMatch) {
        return levelMatch[1].toLowerCase();
      }
      // Check for common patterns without brackets
      if (logLine.toLowerCase().includes('error')) return 'error';
      if (logLine.toLowerCase().includes('warn')) return 'warn'; 
      if (logLine.toLowerCase().includes('critical')) return 'critical';
      return 'info'; // default to info
    }
    return 'info';
  };

  // Helper function to format timestamps in log entries to be more human-readable
  const formatLogTimestamp = (logLine) => {
    if (typeof logLine !== 'string') return logLine;

    // Match various timestamp patterns commonly found in logs
    const patterns = [
      // ISO 8601: 2024-11-04T15:30:45.123Z or 2024-11-04T15:30:45Z
      /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?)/g,
      // Unix timestamp in milliseconds: 1699108245123
      /\b(\d{13})\b/g,
      // Unix timestamp in seconds: 1699108245
      /\b(\d{10})\b/g,
      // Date format: 2024-11-04 15:30:45
      /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/g,
      // Syslog format: Nov  4 15:30:45
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}/g
    ];

    let formattedLine = logLine;

    patterns.forEach(pattern => {
      formattedLine = formattedLine.replace(pattern, (match) => {
        try {
          let date;
          
          // Handle different timestamp formats
          if (match.match(/^\d{13}$/)) {
            // Unix timestamp in milliseconds
            date = new Date(parseInt(match));
          } else if (match.match(/^\d{10}$/)) {
            // Unix timestamp in seconds
            date = new Date(parseInt(match) * 1000);
          } else {
            // ISO string or other date formats
            date = new Date(match);
          }

          // Check if date is valid
          if (isNaN(date.getTime())) return match;

          // Format as readable timestamp
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const logDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          
          const timeStr = date.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          });

          if (logDate.getTime() === today.getTime()) {
            // Today - just show time
            return `${timeStr}`;
          } else if (logDate.getTime() === today.getTime() - 86400000) {
            // Yesterday
            return `Yesterday ${timeStr}`;
          } else {
            // Other dates - show date and time
            const dateStr = date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
            return `${dateStr} ${timeStr}`;
          }
        } catch (e) {
          // If formatting fails, return original
          return match;
        }
      });
    });

    return formattedLine;
  };

  // Delete log file function
  const deleteLogFile = async () => {
    if (!window.confirm('Are you sure you want to delete the log file? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const response = await deleteLog();

    if (response.error) {
      console.error('Error deleting log file:', response.error);
      alert(`Error deleting log file: ${response.error.message}`);
    } else {
      // Clear the current logs and reset pagination
      setLines([]);
      setCurrentPage(1);
      alert('Log file deleted successfully!');
    }
    setIsDeleting(false);
  };

  // Filter logs based on selected log levels
  const filteredLines = lines.filter(line => {
    const level = getLogLevel(line);
    return logFilter[level];
  });

  const totalPages = Math.ceil(filteredLines.length / linesPerPage);

  // Reset to page 1 when filter changes and current page becomes invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredLines.length, currentPage, totalPages]);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get configuration info for debugging
        const host = localStorage.getItem('ipAddress') || process.env.REACT_APP_IP_ADDRESS;
        const port = localStorage.getItem('ipPort') || process.env.REACT_APP_IP_PORT;
        setDebugInfo(`Attempting to connect to: http://${host}:${port}/streamLog`);
        
        const response = await streamLog();
        
        // Check if response has an error property
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Check if response body exists
        if (!response.body) {
          throw new Error('No response body received from server');
        }
        
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

          // Add lines in chronological order (append to end)
          setLines((prevLines) => [...prevLines, ...chunkLines]);
        }

        if (partialLine) {
          // Prepend the last partial line if it exists
          const sanitizedPartialLine = partialLine.replace(ansiEscapeRegex, '');
          setLines((prevLines) => [sanitizedPartialLine, ...prevLines]);
        }
      } catch (error) {
        console.error('Error streaming file:', error);
        
        // If it's a network error, show demo data so users can see how logs should appear
        if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          console.log('🔄 Network error detected, showing demo log data');
          const demoLogs = [
            `${new Date().toISOString()} [INFO] BrewNode server started successfully`,
            `${new Date().toISOString()} [INFO] Temperature sensor initialized: Kettle`,
            `${new Date().toISOString()} [INFO] Temperature sensor initialized: Mash`,
            `${new Date().toISOString()} [INFO] Temperature sensor initialized: Fermenter`,
            `${new Date().toISOString()} [INFO] Socket server listening on port 3001`,
            `${new Date().toISOString()} [CRITICAL] Client connected from 192.168.1.100`,
            `${new Date().toISOString()} [INFO] Starting mash process`,
            `${new Date().toISOString()} [INFO] Kettle temperature: 65.2°C`,
            `${new Date().toISOString()} [INFO] Mash temperature: 63.8°C`,
            `${new Date().toISOString()} [INFO] Pump activated: Mash circulation`,
            `${new Date().toISOString()} [WARN] Temperature deviation detected: +2.1°C`,
            `${new Date().toISOString()} [INFO] Automatic temperature adjustment triggered`,
            `${new Date().toISOString()} [INFO] Process step completed: Mashing`,
            `${new Date().toISOString()} [INFO] Starting boil process`,
            `${new Date().toISOString()} [ERROR] This is a demo - server not available`,
            '--- Demo log data (server connection failed) ---'
          ];
          setLines(demoLogs);
          setError(`Network connection failed: ${error.message}`);
        } else {
          setError(error.message || 'Failed to load log file');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, []);

  // Listen for live log updates via socket
  useEffect(() => {
    console.log('🔌 Setting up socket listener for live logs...');
    
    const handleLiveLogEntry = (entry) => {
      console.log('📨 Received live log entry:', entry);
      
      if (entry) {
        // Format the socket log entry to match file log format
        
        // Add new log entry to the end of the array (most recent)
        setLines((prevLines) => {
          const newLines = [...prevLines, entry];
          console.log(`📊 Updated lines count: ${prevLines.length} → ${newLines.length}`);
          
          // If user is on page 1, keep them there to see live updates
          if (currentPage === 1) {
            console.log('🏠 User is on page 1');
            // Calculate if we need to adjust pagination after adding the log
            const oldTotalPages = Math.ceil(prevLines.length / linesPerPage);
            const newTotalPages = Math.ceil(newLines.length / linesPerPage);
            if (newTotalPages > oldTotalPages) {
              console.log('📄 New page created, adjusting pagination');
              // A new page was created, user stays on page 1 to see latest
              setTimeout(() => {
                setCurrentPage(1);
                // Auto-scroll to top to show newest entry (since new entries appear at top of page 1)
                if (logContentRef.current) {
                  logContentRef.current.scrollTop = 0;
                }
              }, 100);
            } else {
              // No new page created, just scroll to top to show the new entry
              setTimeout(() => {
                if (logContentRef.current) {
                  logContentRef.current.scrollTop = 0;
                }
              }, 50);
            }
          }
          
          return newLines;
        });
      } else {
        console.log('⚠️ Received invalid log entry:', entry);
      }
    };

    addSocketListener('log', handleLiveLogEntry);
    console.log('✅ Socket listener added for "log" events');
    
    return () => {
      console.log('🔌 Removing socket listener for live logs');
      removeSocketListener('log', handleLiveLogEntry);
    };
  }, [currentPage, linesPerPage]);

  // Expose fetchFile as fetchLogs for retry functionality
  const fetchLogs = () => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        setError(null);
        setLines([]); // Clear existing logs
        
        // Get configuration info for debugging
        const host = localStorage.getItem('ipAddress') || process.env.REACT_APP_IP_ADDRESS;
        const port = localStorage.getItem('ipPort') || process.env.REACT_APP_IP_PORT;
        setDebugInfo(`Attempting to connect to: http://${host}:${port}/streamLog`);
        
        const response = await streamLog();
        
        // Check if response has an error property
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Check if response body exists
        if (!response.body) {
          throw new Error('No response body received from server');
        }
        
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

          // Add lines in chronological order (append to end)
          setLines((prevLines) => [...prevLines, ...chunkLines]);
        }

        if (partialLine) {
          setLines((prevLines) => [...prevLines, partialLine]);
        }
      } catch (error) {
        console.error('Error streaming file:', error);
        
        // If it's a network error, show demo data so users can see how logs should appear
        if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          console.log('🔄 Network error detected, showing demo log data');
          const demoLogs = [
            `${new Date().toISOString()} [INFO] BrewNode server started successfully`,
            `${new Date().toISOString()} [INFO] Temperature sensor initialized: Kettle`,
            `${new Date().toISOString()} [INFO] Temperature sensor initialized: Mash`,
            `${new Date().toISOString()} [INFO] Temperature sensor initialized: Fermenter`,
            `${new Date().toISOString()} [INFO] Socket server listening on port 3001`,
            `${new Date().toISOString()} [CRITICAL] Client connected from 192.168.1.100`,
            `${new Date().toISOString()} [INFO] Starting mash process`,
            `${new Date().toISOString()} [INFO] Kettle temperature: 65.2°C`,
            `${new Date().toISOString()} [INFO] Mash temperature: 63.8°C`,
            `${new Date().toISOString()} [INFO] Pump activated: Mash circulation`,
            `${new Date().toISOString()} [WARN] Temperature deviation detected: +2.1°C`,
            `${new Date().toISOString()} [INFO] Automatic temperature adjustment triggered`,
            `${new Date().toISOString()} [INFO] Process step completed: Mashing`,
            `${new Date().toISOString()} [INFO] Starting boil process`,
            `${new Date().toISOString()} [ERROR] This is a demo - server not available`,
            '--- Demo log data (server connection failed) ---'
          ];
          setLines(demoLogs);
          setError(`Network connection failed: ${error.message}`);
        } else {
          setError(error.message || 'Failed to load log file');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  };

  // Calculate the lines to display for the current page using filtered lines
  // Show most recent logs on page 1, in chronological order (oldest to newest) within each page
  const reversePage = totalPages - currentPage + 1; // Reverse page order so page 1 shows most recent
  const startIndex = (reversePage - 1) * linesPerPage;
  const endIndex = startIndex + linesPerPage;
  const pageLines = filteredLines.slice(startIndex, endIndex);
  const currentLines = [...pageLines].reverse(); // Reverse to show newest logs at top of each page

  // Handle pagination (totalPages already declared above)

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

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle keyboard navigation when not typing in an input
      if (event.target.tagName === 'INPUT') return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          setCurrentPage(1);
          break;
        case 'End':
          event.preventDefault();
          setCurrentPage(totalPages || 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages]);

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Loading log file...</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>{debugInfo}</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>❌ Error Loading Logs</h3>
        <p><strong>Error:</strong> {error}</p>
        <p style={{ color: '#666', fontSize: '14px' }}><strong>Endpoint:</strong> {debugInfo}</p>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px', textAlign: 'left' }}>
          <h4>Troubleshooting:</h4>
          <ol>
            <li>Check if the BrewNode server is running</li>
            <li>Verify the IP address and port in settings</li>
            <li>Ensure the `/streamLog` endpoint is available on the server</li>
            <li>Check browser console for additional error details</li>
          </ol>
        </div>
        <button 
          onClick={fetchLogs} 
          style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100%', 
      maxHeight: 'calc(100vh - 200px)',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header with title and refresh button */}
      <div style={{ 
        padding: '8px',
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        borderBottom: '1px solid #dee2e6',
        flexShrink: 0
      }}>
       
      </div>

      {/* Log Level Filter Controls - Prominent Row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '12px', 
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #e9ecef',
        flexShrink: 0
      }}>
        <span style={{ 
          fontSize: '14px', 
          color: '#495057', 
          fontWeight: '600',
          alignSelf: 'center',
          marginRight: '8px'
        }}>
          📋 Filter Log Levels:
        </span>
        
        <button
          onClick={() => setLogFilter(prev => ({ ...prev, info: !prev.info }))}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            border: '2px solid #198754',
            borderRadius: '6px',
            backgroundColor: logFilter.info ? '#198754' : 'white',
            color: logFilter.info ? 'white' : '#198754',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '70px'
          }}
          onMouseEnter={(e) => {
            if (!logFilter.info) {
              e.target.style.backgroundColor = '#19875420';
            }
          }}
          onMouseLeave={(e) => {
            if (!logFilter.info) {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          INFO
        </button>
        
        <button
          onClick={() => setLogFilter(prev => ({ ...prev, warn: !prev.warn }))}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            border: '2px solid #ffc107',
            borderRadius: '6px',
            backgroundColor: logFilter.warn ? '#ffc107' : 'white',
            color: logFilter.warn ? 'white' : '#ffc107',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '70px'
          }}
          onMouseEnter={(e) => {
            if (!logFilter.warn) {
              e.target.style.backgroundColor = '#ffc10720';
            }
          }}
          onMouseLeave={(e) => {
            if (!logFilter.warn) {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          WARN
        </button>
        
        <button
          onClick={() => setLogFilter(prev => ({ ...prev, error: !prev.error }))}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            border: '2px solid #dc3545',
            borderRadius: '6px',
            backgroundColor: logFilter.error ? '#dc3545' : 'white',
            color: logFilter.error ? 'white' : '#dc3545',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '70px'
          }}
          onMouseEnter={(e) => {
            if (!logFilter.error) {
              e.target.style.backgroundColor = '#dc354520';
            }
          }}
          onMouseLeave={(e) => {
            if (!logFilter.error) {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          ERROR
        </button>
        
        <button
          onClick={() => setLogFilter(prev => ({ ...prev, debug: !prev.debug }))}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            border: '2px solid #6c757d',
            borderRadius: '6px',
            backgroundColor: logFilter.debug ? '#6c757d' : 'white',
            color: logFilter.debug ? 'white' : '#6c757d',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '70px'
          }}
          onMouseEnter={(e) => {
            if (!logFilter.debug) {
              e.target.style.backgroundColor = '#6c757d20';
            }
          }}
          onMouseLeave={(e) => {
            if (!logFilter.debug) {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          CRITICAL
        </button>

        {/* Delete Log Button */}
        <button
          onClick={deleteLogFile}
          disabled={isDeleting}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            border: '2px solid #dc3545',
            borderRadius: '6px',
            backgroundColor: isDeleting ? '#ccc' : '#dc3545',
            color: 'white',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '100px',
            marginLeft: '20px'
          }}
          onMouseEnter={(e) => {
            if (!isDeleting) {
              e.target.style.backgroundColor = '#c82333';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDeleting) {
              e.target.style.backgroundColor = '#dc3545';
            }
          }}
        >
          {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete Logs'}
        </button>
      </div>

      {/* Log content area */}
      <div 
        ref={logContentRef}
        style={{ 
          whiteSpace: 'pre-wrap', 
          fontFamily: 'monospace', 
          textAlign: 'left', 
          backgroundColor: '#f8f9fa', 
          padding: '8px',
          margin: '8px',
          border: '1px solid #dee2e6', 
          overflow: 'auto',
          flex: '1',
          minHeight: '0'
        }}>
        {currentLines.map((line, index) => (
          <div key={index} style={{ borderBottom: '1px solid #eee', padding: '3px 0', fontSize: '16px', lineHeight: '1.5' }}>
            {formatLogTimestamp(line)}
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#f8f9fa', 
        borderTop: '1px solid #dee2e6',
        flexShrink: 0,
        minHeight: '80px',
        boxSizing: 'border-box'
      }}>
        {/* Unified pagination layout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '14px' }}>
          {/* Left side: Per page controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap' }}>
              Per page:
              <select 
                value={linesPerPage} 
                onChange={(e) => {
                  const newLinesPerPage = parseInt(e.target.value);
                  setLinesPerPage(newLinesPerPage);
                  // Adjust current page if needed
                  const newTotalPages = Math.ceil(lines.length / newLinesPerPage);
                  if (currentPage > newTotalPages) {
                    setCurrentPage(Math.max(1, newTotalPages));
                  }
                }}
                style={{ 
                  fontSize: '18px', 
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
            
            <span style={{ color: '#666', fontSize: '18px', whiteSpace: 'nowrap' }}>
              ({lines.length === 0 ? 0 : ((currentPage - 1) * linesPerPage + 1)}-{Math.min(currentPage * linesPerPage, lines.length)} of {lines.length})
            </span>
          </div>

          {/* Center: Navigation controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', justifyContent: 'center' }}>
          {/* Larger navigation buttons */}
          <button 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
            title="First page"
            style={{ 
              padding: '8px 12px', 
              backgroundColor: currentPage === 1 ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              minWidth: '50px'
            }}
          >
            ⏮
          </button>
          
          <button 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1}
            title="Previous page"
            style={{ 
              padding: '8px 14px', 
              backgroundColor: currentPage === 1 ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              minWidth: '60px'
            }}
          >
            ←
          </button>

          {/* Page input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
            <input 
              type="number" 
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const pageNum = parseInt(jumpToPage);
                  if (pageNum >= 1 && pageNum <= totalPages) {
                    setCurrentPage(pageNum);
                    setJumpToPage('');
                  }
                }
              }}
              placeholder={currentPage.toString()}
              style={{ 
                width: '60px', 
                padding: '6px 8px', 
                textAlign: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '13px'
              }}
            />
            <span>/{totalPages}</span>
          </div>
          
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            title="Next page"
            style={{ 
              padding: '8px 14px', 
              backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              minWidth: '60px'
            }}
          >
            →
          </button>

          <button 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
            title="Last page"
            style={{ 
              padding: '8px 12px', 
              backgroundColor: currentPage === totalPages ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              minWidth: '50px'
            }}
          >
            ⏭
          </button>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default FileStreamer;