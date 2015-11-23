import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col, FormControls, ButtonToolbar, Button } from 'react-bootstrap';
import * as _ from 'lodash';

import Controls from './Controls.jsx';
import { DripInput, DripSelect } from './Fields.jsx';


var Node = React.createClass({
  getInitialState: function () {
    return {
      complete: this.props.node.complete
    };
  },

  validate: function () {
    return !!(this.refs.name.state.valid
    && this.refs.description.state.valid
    && this.refs.template.state.valid);
  },

  handleSave: function () {
    if (!this.validate()) {
      return;
    }
    this.props.onSave({
      id: this.props.node.id,
      name: this.refs.name.state.value,
      description: this.refs.description.state.value,
      templateId: this.refs.template.state.value,
      complete: true
    });
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
    let template = _.find(this.props.templates, {id: this.props.node.templateId});
    let actions = this.props.actions, nodes = this.props.nodes;

    const staticForm = (
      <form>
        <Controls
          complete={this.state.complete}
          onSave={this.handleSave}
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
        <Row>
          <Col md={12}>
            <div className="form-group">
              <label className="control-label"><span>Triggers</span></label>
            </div>
          </Col>
          {this.props.node.triggers.map((trigger) => {
            let action = actions.find((action) => action.id === trigger.actionId);
            let node = nodes.find((node) => node.id === trigger.nodeId);

            if (!action || !node) {return;}

            return (
            <div key={trigger.id} className="trigger">
              <Col md={6}>
                <FormControls.Static value={action.name}/>
              </Col>
              <Col md={6}>
                <FormControls.Static value={node.name}/>
              </Col>
            </div>
              );
            })}
        </Row>
      </form>
    );
    if (this.state.complete) {
      return staticForm;
    }

    return (
      <form>
        <Controls
          complete={this.state.complete}
          onSave={this.handleSave}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
        />
        <DripInput
          label="Name"
          placeholder="Name"
          defaultValue={this.props.node.name}
          validate={(value) => {
            return value.length > 0;
          }}
          ref="name"
        />
        <DripInput
          label="Description"
          placeholder="Description"
          defaultValue={this.props.node.description}
          validate={() => {
            return true;
          }}
          ref="description"
        />
        <DripSelect
          label="Templates"
          defaultValue={this.props.node.templateId}
          defaultOption="Select Template"
          options={this.props.templates}
          ref="template"
        />
        <Row>
          <Col md={12}>
            <div className="form-group">
              <label className="control-label"><span>Triggers</span></label>
            </div>
          </Col>
          {this.props.node.triggers.map((trigger) => {
            let action = actions.find((action) => action.id === trigger.actionId);
            let node = nodes.find((node) => node.id === trigger.nodeId);

            if (!action || !node) {return;}

            return (
            <div key={trigger.id} className="trigger">
              <Col md={5}>
                <DripSelect
                  defaultValue={trigger.actionId}
                  defaultOption="Select Event"
                  options={actions}
                />
              </Col>
              <Col md={5}>
                <DripSelect
                  defaultValue={trigger.nodeId}
                  defaultOption="Select Action"
                  options={nodes}
                />
              </Col>
              <Col md={2}>
                <ButtonToolbar>
                  <Button bsStyle="danger">-</Button>
                </ButtonToolbar>
              </Col>
            </div>
              );
            })}
          <Col md={12}>
            <ButtonToolbar>
              <Button bsStyle="success">Add trigger</Button>
            </ButtonToolbar>
          </Col>
        </Row>
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
  onDelete: React.PropTypes.func.isRequired
};

export default Node;
