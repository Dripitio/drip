import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col } from 'react-bootstrap';
import * as _ from 'lodash';

import Controls from './Controls.jsx';

class FormControleStaticInput extends Component {
  render() {
    if (this.props.complete) {
      return (
        <div>
          <label>{this.props.label}</label>
          <div>
            <p>{this.props.defaultValue}</p>
          </div>
        </div>
      );
    } else {
      return (
        <Input
          type={this.props.type}
          placeholder={this.props.placeholder}
          defaultValue={this.props.defaultValue}
          label={this.props.label}
        />
      );
    }
  }
}

class Trigger extends Component {
  render() {
    let actions = this.props.actions;

    return (
      <Row>
        <Col md={6}>
          <Input type="select" label="Events">
            <option value="">Select List</option>
            {actions.map((action) => {
              return (
              <option key={action.id} value={action.id}>{action.name}</option>
                );
              })}
          </Input>
        </Col>
        <Col md={6}>
          <Input type="select" label="Actions">
            <option value="">Select List</option>
            {this.props.nodes.map((node) => {
              return (
              <option key={node.id} value={node.id}>{node.name}</option>
                );
              })}
          </Input>
        </Col>
      </Row>
    );
  }
}

export default Node = React.createClass({
  getInitialState: function() {
    return {
      complete: this.props.node.complete
    };
  },

  handleSave: function() {
    this.props.onSave(this.props.node.id);
    // TODO: validate fields before saving
    this.setState({
      complete: this.props.node.complete
    });
  },

  handleEdit: function() {
    this.props.onEdit(this.props.node.id);
    this.setState({
      complete: this.props.node.complete
    });
  },

  render: function() {
    let templates = this.props.templates,
      triggers = this.props.node.triggers,
      actions = this.props.actions;

    var template;
    if (this.props.node.complete) {
      template = _.result(_.findWhere(templates, {selected: true}), 'name');
    }

    return (
      <form action="">
        <Controls
          complete={this.props.node.complete}
          onSave={this.handleSave}
          onEdit={this.handleEdit}
        />
        <FormControleStaticInput
          type="text"
          placeholder="Name"
          defaultValue={this.props.node.name}
          label="Name"
          complete={this.props.node.complete}
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
              defaultValue={template}
              label="Template"
              complete={this.props.node.complete}
            />
              );
            }
            else {
            return (
            <Input type="select" label="Templates">
              <option value="">Select Template</option>
              {templates.map((t) => {return <option key={t.id} value={t.id}>{t.name}</option>})}
            </Input>
              );
            }
          })()}
        {triggers.map((trigger) => {
          if (this.props.node.complete) {
            return (
            <Row key={trigger.id}>
              <Col md={6}>
                <FormControleStaticInput
                  label="Event"
                  defaultValue={_.result(_.findWhere(actions, {id: trigger.actionId}), 'name')}
                  complete={this.props.node.complete}
                />
              </Col>
              <Col md={6}>
                <FormControleStaticInput
                  label="Action"
                  defaultValue={_.result(_.findWhere(this.props.nodes, {id: trigger.nodeId}), 'name')}
                  complete={this.props.node.complete}
                />
              </Col>
            </Row>
              );
            } else {

            return (
            <Trigger key={trigger.id}
                     trigger={trigger}
                     actions={actions}
                     nodes={this.props.nodes}
            />);
            }
          })}
      </form>
    )
  }
});

Node.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired
};