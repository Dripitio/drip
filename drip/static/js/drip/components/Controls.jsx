import React, { Component } from 'react';


export default class Controls extends Component {
  render() {
    return (
      <div className="node-controle">
        {(() => {
          if (this.props.complete) {
            return (
            <div className="btn controle-btn primary"
                 onClick={this.props.onEdit}>
              <i className="fa fa-pencil"></i>
            </div>
              );
            }
          return (
          <div className="btn controle-btn success"
               onClick={this.props.onSave}>
            <i className="fa fa-check"></i>
          </div>
            );
          })()}
        <div className="btn controle-btn danger">
          <i className="fa fa-trash"></i>
        </div>
      </div>
    );
  }
}

Controls.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired
};