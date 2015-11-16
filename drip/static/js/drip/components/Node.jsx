import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col, FormControls } from 'react-bootstrap';
import * as _ from 'lodash';

import Controls from './Controls.jsx';

var FormControleStaticInput = React.createClass({
  render() {
    if (this.props.complete) {
      return (
        <FormControls.Static
          value={this.props.defaultValue}
          label={this.props.label}/>
      );
    } else {
      return (
        <Input
          type={this.props.type}
          placeholder={this.props.placeholder}
          defaultValue={this.props.defaultValue}
          label={this.props.label}
          onChange={this.props.onChange}
        />
      );
    }
  }
});


var Node = React.createClass({
  getInitialState: function () {
    return {
      complete: this.props.node.complete
    };
  },

  handleSave: function () {
    this.props.onSave(this.props.node.id);
    // TODO: validate fields before saving
    this.setState({
      complete: this.props.node.complete
    });
  },

  handleEdit: function () {
    this.props.onEdit(this.props.node.id);
    this.setState({
      complete: this.props.node.complete
    });
  },

  handleDelete: function () {
    this.props.onDelete(this.props.node.id);
  },

  render: function () {
    let templates = this.props.templates

    return (
      <form action="">
        <Controls
          complete={this.props.node.complete}
          onSave={this.handleSave}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
        />
        <FormControleStaticInput
          type="text"
          placeholder="Name"
          defaultValue={this.props.node.name}
          label="Name"
          complete={this.props.node.complete}
          onChange={this.handleInput}
        />
        <FormControleStaticInput
          type="text"
          placeholder="Description"
          defaultValue={this.props.node.description}
          label="Description"
          complete={this.props.node.complete}
        />
        {(() => {
          if (this.props.node.complete) {
            return (
            <FormControleStaticInput
              defaultValue={(() => _.findWhere(templates, {id: this.props.node.template.id}))()}
              label="Template"
              complete={this.props.node.complete}
            />
              );
            }
            else {
            return (
            <Input type="select"
                   label="Templates"
                   defaultValue={this.props.node.template ? this.props.node.template.id : ''}>
              <option value="">Select Template</option>
              {templates.map((t) => {return <option key={t.id} value={t.id}>{t.name}</option>})}
            </Input>
              );
            }
          })()}
      </form>
    )
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
  onDelete: React.PropTypes.func.isRequired,
};

export default Node;
