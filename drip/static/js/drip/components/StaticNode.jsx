import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col } from 'react-bootstrap';

import Controls from './Controls.jsx';
import * as _ from 'lodash';


class FormControleStaticInput extends Component {
  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <div>
          <p>{this.props.value}</p>
        </div>
      </div>
    )
  }
}

export default class StaticNode extends Component {
  render() {
    let template = _.result(_.findWhere(this.props.node.templates, {selected: true}), 'name');
    let actions = this.props.node.actions;
    let triggers = this.props.node.triggers;

    return (
      <div>
        <Controls complete={this.props.node.complete}/>
        <FormControleStaticInput
          value={this.props.node.name}
          label="Name"
        />
        <FormControleStaticInput
          value={this.props.node.description}
          label="Description"
        />
        <FormControleStaticInput
          value={template}
          label="Template"
        />
        {triggers.map((trigger) => {
          return (
          <Row key={trigger.id}>
            <Col md={6}>
              <FormControleStaticInput
                label="Event"
                value={_.result(_.findWhere(actions, {id: trigger.actionId}), 'name')}
              />
            </Col>
            <Col md={6}>
              <FormControleStaticInput
                label="Action"
                value={_.result(_.findWhere(this.props.nodes, {id: trigger.nodeId}), 'name')}
              />
            </Col>
          </Row>
            );
          })}
      </div>
    )
  }
}

StaticNode.propTypes = {
  node: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    description: React.PropTypes.string,
    templates: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      selected: React.PropTypes.bool
    })),
    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      /**
       * Reference template if this action is specific to it.
       */
      templateId: React.PropTypes.string
    })),
    triggers: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      actionId: React.PropTypes.string,
      nodeId: React.PropTypes.string
    }))
  }),
  nodes: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    description: React.PropTypes.string,
    templates: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      selected: React.PropTypes.bool
    })),
    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      /**
       * Reference template if this action is specific to it.
       */
      templateId: React.PropTypes.string
    })),
    triggers: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      actionId: React.PropTypes.string,
      nodeId: React.PropTypes.string
    }))
  }))
};