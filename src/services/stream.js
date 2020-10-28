import { concatMap, debounceTime, map, bufferTime } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

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
    value: null,
    isInit: false,
    delayTimeout: null,
  },
  temp: {
    value: null,
    isInit: false,
    delayTimeout: null,
  },
  pres: {
    value: null,
    isInit: false,
    delayTimeout: null,
  }
};

export const stream$ = new Subject().pipe(debounceTime(100)); // 100ms condition

function delayWait(type) { // 1000ms 'n/a' condition
  clearTimeout(obj[type].delayTimeout);

  obj[type].delayTimeout = setTimeout(() => {
    obj[type].value = null;
  }, 1000);
}

function emitUpdate() {
  if (!obj.hum.isInit || !obj.temp.isInit || !obj.pres.isInit) { // '3 systems must emit' condition
    return;
  }
  stream$.next(obj);
}

export const normalize = type => data => {
  delayWait(type);
  if (data === obj[type].value) return; // new value check
  obj[type].value = data;
  obj[type].isInit = true;
  emitUpdate('date', type);
}

const normHum = normalize('hum');
const normPres = normalize('pres');
const normTemp = normalize('temp');

humEmit$.subscribe(normHum);
presEmit$.subscribe(normPres);
tempEmit$.subscribe(normTemp);
