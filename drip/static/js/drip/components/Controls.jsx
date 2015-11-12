import React, { Component } from 'react';


export default class Controls extends Component {
  render() {
    return (
      <div className="node-controle">
        <div className="btn controle-btn success">
          <i className="fa fa-check"></i>
        </div>
        <div className="btn controle-btn danger">
          <i className="fa fa-trash"></i>
        </div>
        <div className="btn controle-btn primary">
          <i className="fa fa-pencil"></i>
        </div>
      </div>
    );
  }
}

