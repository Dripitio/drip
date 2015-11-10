require('sass/dashboard.scss');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';


class App extends Component {
  render() {
    return (
      <h1>REACT IN THE HOUSE</h1>
    )
  }
}

ReactDOM.render(
  <App></App>,
  document.getElementById('drip')
);

