import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col, FormControls, ButtonToolbar, Button } from 'react-bootstrap';
import * as _ from 'lodash';

import Controls from './Controls.jsx';
import { DripInput, DripSelect } from './Fields.jsx';


var Node = React.createClass({
  handleEdit: function () {
    this.props.onEdit(this.props.node.id);
  },

  handleDelete: function () {
    this.props.onDelete(this.props.node.id);
  },

  render: function () {
    let template = _.find(this.props.templates, {id: this.props.node.templateId});
    let actions = this.props.actions, nodes = this.props.nodes;

    return (
      <form>
        <Controls
          complete={true}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
        />
        <FormControls.Static
          label="Name"
          value={this.props.node.name}/>
        <FormControls.Static
          label="Description"
          value={this.props.node.description}/>
        <FormControls.Static
          label="Template"
          value={(() => {
            if (template && template.name) {
              return template.name;
            }
            return '';
          })()}/>
      </form>
    );
  }
});

Node.propTypes = {
  node: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    description: React.PropTypes.string,

    template: React.PropTypes.shape({
      id: React.PropTypes.string
    }),

    triggers: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      actionId: React.PropTypes.string,
      nodeId: React.PropTypes.string
    })),

    // if form not complete show edit form
    complete: React.PropTypes.bool
  }),

  nodes: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    description: React.PropTypes.string,

    template: React.PropTypes.shape({
      id: React.PropTypes.string
    }),

    triggers: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      actionId: React.PropTypes.string,
      nodeId: React.PropTypes.string
    })),

    // if form not complete show edit form
    complete: React.PropTypes.bool
  })).isRequired,

  templates: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  })).isRequired,

  actions: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    templates: React.PropTypes.arrayOf(React.PropTypes.string)
  })).isRequired,

  onEdit: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired
};

export default Node;
