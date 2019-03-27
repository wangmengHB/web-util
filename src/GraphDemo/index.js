import React, {PureComponent} from 'react';

import data from './mock';
import { drawGraph } from './graph';



export default class Demo extends PureComponent {

  componentDidMount() {
    drawGraph(data, "mountNode");
  }

  render() {
    return (
      <div className="container">
        <div id="mountNode"/>
      </div>
    );
  }
}