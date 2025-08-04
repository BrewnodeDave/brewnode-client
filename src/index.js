import React from 'react';
import ReactDOM from 'react-dom/client';

import './common/index.css';
import { App } from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={{ width: '100vw', height: '100vh', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
      <App />
    </div>
  </React.StrictMode>
);
