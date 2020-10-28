import { Subject } from 'rxjs';

/* eslint-disable jest/no-mocks-import */
import humEmit$ from './__mocks__/hum';
import presEmit$ from './__mocks__/pres';
import tempEmit$ from './__mocks__/temp';


import { stream$ } from './stream';

// jest.mock('./hum');
// jest.mock('./pres');
// jest.mock('./temp');


describe('tests', () => {
  beforeAll(() => {
    humEmit$.subscribe((val) => { console.log('ggg',val) });

  });

  it.skip('All 3 systems do not emit at least one value before 1 display obj.', async () => {
    const mockFn = jest.fn();
    stream$.subscribe(mockFn);
    humEmit$.next(0);
    presEmit$.next(4);
    humEmit$.next(1);

    // jest.runAllTimers();

    expect(mockFn).toBeCalledTimes(0);
  });

  it.skip('works with async/await', async () => {
    expect.assertions(1);
    const data = await new Promise((res, rej) => {
      setTimeout(() => res('Markk'), 2000);
    });
    expect(data).toEqual('Mark');
  });

  it.only('All 3 systems must emit at least one value before 1 display obj.', async () => {
    expect.assertions(1);

    const mockFn = jest.fn();
    stream$.subscribe(mockFn);
    humEmit$.next(0);
    // presEmit$.next(4);
    // humEmit$.next(1);
    // tempEmit$.next(5);
    // tempEmit$.next(5);
    // tempEmit$.next(5);
    // tempEmit$.next(5);

    await new Promise((res, rej) => {
      setTimeout(() => {

        res();
      }, 1000)
    });
    console.log(stream$.value);

    // expect(mockFn).toBeCalledTimes(1);

    console.log('end')

    // jest.runAllTimers();


  });
});
