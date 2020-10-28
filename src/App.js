import React, { useEffect, useState, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';

import { stream$ } from './services/stream';


function App() {
  const [state, updateState] = useState(null);
  // const forceUpdate = useCallback(() => updateState(stream$.value), []);

  useEffect(() => {
    stream$.subscribe(val => {
      updateState({ ...val });
    });
  },[]);

  return (
    <div className="App">
      <div className="temp"><span>{"temp: "}</span><span>{state?.temp.value}</span></div>
      <div className="pres">{["pres: ", state?.pres.value]}</div>
      <div className="hum">{["hum: ", state?.hum.value]}</div>
    </div>
  );
}

export default App;
