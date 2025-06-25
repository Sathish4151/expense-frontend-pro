import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Point axios to Render in prod, fallback to localhost in dev
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

ReactDOM.render(<App />, document.getElementById('root'));
