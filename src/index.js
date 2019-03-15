import React from 'react';
import ReactDOM from 'react-dom';
import MultiSicesVideoPlayer from './MultiSlicesVideoPlayer';


const slices = [
  'http://127.0.0.1:8080/sample0.mp4',
  'http://127.0.0.1:8080/sample1.mp4',
  'http://127.0.0.1:8080/sample2.mp4',
  'http://127.0.0.1:8080/sample3.mp4',
  'http://127.0.0.1:8080/sample4.mp4',
];


const root = document.createElement('div');
document.body.appendChild(root);


ReactDOM.render(
  <MultiSicesVideoPlayer slices={slices}/>,
  root
)







