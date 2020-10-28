import { concatMap, delay } from 'rxjs/operators';
import { range, of, Subject } from 'rxjs';

// const temperature = new EventEmitter();
// temperature.on('data', data => { // data = '24.2' })

const randomTime = (min = 10, max = 2000) => Math.random() * (max - min) + min;

const presEmit$ = process.env.NODE_ENV === 'test' ? new Subject() : range(1, 100)
  .pipe(concatMap(val => of(val)
    .pipe(delay(randomTime()))
  ))

export default presEmit$;
