// import React from 'react';
// import jsdom from 'jsdom';
// const { JSDOM } = jsdom;
//
// /*
//  * jest-dom
//  * https://github.com/testing-library/jest-dom
//  */
// import '@testing-library/jest-dom/extend-expect';
//
// /*
//  * jest-fetch-mock
//  * https://github.com/jefflau/jest-fetch-mock
//  */
// require('jest-fetch-mock').enableMocks();
//
// if (global.document) {
//   global.document.createRange = () => ({
//     setStart: () => {
//     },
//     setEnd: () => {
//     },
//     commonAncestorContainer: {
//       nodeName: 'BODY',
//       ownerDocument: document,
//     },
//     createContextualFragment: str => JSDOM.fragment(str),
//     // createContextualFragment: str => document.createElement('hr'),
//   });
//   global.open = () => undefined;
// }
//
