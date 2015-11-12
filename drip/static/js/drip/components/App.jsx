import React, { Component } from 'react';

import { connect } from 'react-redux';

import Campaign from './Campaign.jsx';


class App extends Component {
  render() {
    const { dispatch, campaign } = this.props;
    return (
      <Campaign campaign={campaign}></Campaign>
    );
  }
}

// use connect to inject redux state as components pops
export default connect((state) => {
  return state
})(App);
