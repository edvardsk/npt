import { concatMap, debounceTime, map, bufferTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import humEmit$ from './hum';
import presEmit$ from './pres';
import tempEmit$ from './temp';

/*
Display object should not be emitted more often than every 100ms
Display object should only be emitted when one of the systems sends a new value
If a value is not received from a specific system for more than 1000ms, its reading (in the display object) should be 'N/A'
All 3 systems must emit at least one value before 1 display object is ever sent to the dashboard.
* */

let obj = {
  hum: {
    updateTime: null,
    value: null,
    isInit: false,
  },
  temp: {
    updateTime: null,
    value: null,
    isInit: false,
  },
  pres: {
    updateTime: null,
    value: null,
    isInit: false,
  }
};

export const stream$ = new BehaviorSubject(obj).pipe(debounceTime(100)); // 100ms condition

let delayTimeout;
function delayWait(type) { // 1000ms 'n/a' condition
  clearTimeout(delayTimeout);

  setTimeout(() => {
    obj[type].value = 'n/a';
  }, 1000);
}

function emitUpdate(date, type) {
  delayWait(type);
  obj[type].updateTime = date;

  if (!obj.hum.isInit || !obj.temp.isInit || !obj.pres.isInit) { // '3 systems must emit' condition
    return;
  }
  stream$.next(obj);
}

export const normalize = type => data => {
  obj[type].value = data;
  obj[type].isInit = true;

  let date = Date.now();
  let delta = date - obj[type].updateTime;
  if (delta < 100) { // 100ms condition for each
    setTimeout(() => {
      emitUpdate(date, type);
    }, (100 - delta))
  } else {
    emitUpdate(date, type);
  }
}

const normHum = normalize('hum');
const normPres = normalize('pres');
const normTemp = normalize('temp');

humEmit$.subscribe(normHum);
presEmit$.subscribe(normPres);
tempEmit$.subscribe(normTemp);
