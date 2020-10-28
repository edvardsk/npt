import { concatMap, delay } from 'rxjs/operators';
import { range, of } from 'rxjs';

const randomTime = (min = 10, max = 2000) => Math.random() * (max - min) + min;

const tempEmit$ = range(100, 200)
  .pipe(concatMap(val => of(val)
    .pipe(delay(randomTime()))
))

export default tempEmit$;
