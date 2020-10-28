import React from 'react';
import { render } from '@testing-library/react';
import App from '../App.js';

import { stream$ } from './stream';

import humEmit$ from './hum';
import presEmit$ from './pres';
import tempEmit$ from './temp';

jest.setTimeout(10000);

describe('tests', () => {
  it('Not all 3 systems emit at least one value => no display obj.',done => {
    const mockFn = jest.fn();
    stream$.subscribe(mockFn);
    humEmit$.next(0);
    presEmit$.next(1);

    setTimeout(() => {
      expect(mockFn).toBeCalledTimes(0);
      done();
    }, 2000);
  });

  it('All 3 systems must emit at least one value before 1 display obj.', done => {
    const mockFn = jest.fn();
    stream$.subscribe(mockFn);
    humEmit$.next(0);
    presEmit$.next(1);
    tempEmit$.next(2);

    setTimeout(() => {
      expect(mockFn).toBeCalledTimes(1);
      done();
    }, 2000);
  });

  it('update stream only with new values.', done => {
    const mockFn = jest.fn();
    stream$.subscribe((val) => mockFn(val));
    humEmit$.next(0);
    presEmit$.next(1);
    tempEmit$.next(2);

    setTimeout(() => {
      tempEmit$.next(9); // new value
    }, 200);

    setTimeout(() => {
      expect(mockFn).toBeCalledTimes(2);
      done();
    }, 3000);
  });

  it('Not update stream with old values.', done => {
    const mockFn = jest.fn();
    stream$.subscribe(mockFn);
    humEmit$.next(0);
    presEmit$.next(1);
    tempEmit$.next(2);

    setTimeout(() => {
      tempEmit$.next(2); // same as previous
    }, 200);

    setTimeout(() => {
      expect(mockFn).toBeCalledTimes(1);
      done();
    }, 2000);
  });

  it('value is not received from a specific system for more than 1000ms => null, displayed n/a', done => {
    const mockFn = jest.fn();
    stream$.subscribe(mockFn);
    humEmit$.next(0);
    presEmit$.next(1); // pres should be null (n/a)
    tempEmit$.next(2);

    setTimeout(() => {
      tempEmit$.next(4);
    }, 1200);

    setTimeout(() => {
      expect(mockFn.mock.calls[1][0].pres.value).toBeNull();
      done();
    }, 2000);
  });

  it('Obj. should not be emitted more often than every 100ms', done => {
    const mockFn = jest.fn();
    stream$.subscribe(mockFn);
    humEmit$.next(0);
    presEmit$.next(1);
    tempEmit$.next(2);

    setTimeout(() => {
      tempEmit$.next(4); // new value too fast
    }, 20);

    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1); // no second val in stream
      done();
    }, 2000);
  });

  it('Obj. should be emitted 100ms each after each', done => {
    const mockFn = jest.fn();
    stream$.subscribe(mockFn);
    humEmit$.next(0);
    presEmit$.next(1);
    tempEmit$.next(2);

    setTimeout(() => {
      tempEmit$.next(4); // new value 100+ ms
    }, 120);

    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(2); // second val is here
      done();
    }, 2000);
  });

  it('Test ui is visible and render values.', done => {
    const mockFn = jest.fn();
    stream$.subscribe(() => {});
    humEmit$.next(22);
    presEmit$.next(7);
    tempEmit$.next(99);

    const { getByText } = render(<App onStateChange={mockFn} />);
    presEmit$.next(88);
    const valueField = getByText('n/a');
    expect(valueField).toBeVisible();

    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(2);
      done();
    }, 500);
  });
});
