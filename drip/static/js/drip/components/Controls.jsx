import React, { Component } from 'react';


export default class Controls extends Component {
  render() {
    return (
      <div className="node-controle">
        <div className="btn controle-btn primary"
             onClick={this.props.onEdit}>
          <i className="fa fa-pencil"></i>
        </div>
        <div className="btn controle-btn danger"
             onClick={this.props.onDelete}>
          <i className="fa fa-trash"></i>
        </div>
      </div>
    );
  }
}

Controls.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired
};