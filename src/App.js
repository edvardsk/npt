import React, { useEffect, useState, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';

import { stream$ } from './services/stream';


function App({ onStateChange }) {
  const [state, updateState] = useState(null);

  useEffect(() => {
    stream$.subscribe(val => {
      updateState({ ...val });
    });
  },[]);

  useEffect(() => {
    if (onStateChange) onStateChange(state);
  },[state]);


  return (
    <div className="App">
      <div className="temp"><span>{"temp: "}</span><span>{state?.temp.value || 'n/a'}</span></div>
      <div className="pres">{["pres: ", state?.pres.value || 'n/a']}</div>
      <div className="hum">{["hum: ", state?.hum.value || 'n/a']}</div>
    </div>
  );
}

export default App;
