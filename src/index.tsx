import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import InkFlowApp from './InkFlowApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <InkFlowApp />
  </React.StrictMode>
); 