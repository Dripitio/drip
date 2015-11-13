import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col } from 'react-bootstrap';

import Controls from './Controls.jsx';


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

export default class Node extends Component {
  render() {
    let templates = this.props.node.templates,
      triggers = this.props.node.triggers,
      actions = this.props.node.actions;

    return (
      <form action="">
        <Controls complete={this.props.node.complete}/>
        <Input
          type="text"
          placeholder="Name"
          defaultValue={this.props.node.name}
          label="Name"
        />
        <Input
          type="text"
          placeholder="Description"
          defaultValue={this.props.node.description}
          label="Description"
        />
        <Input type="select" label="Templates">
          <option value="">Select Template</option>
          {templates.map((t) => {return <option key={t.id} value={t.id}>{t.name}</option>})}
        </Input>
        {triggers.map((trigger) => {
          return (
          <Trigger key={trigger.id}
                   trigger={trigger}
                   actions={actions}
                   nodes={this.props.nodes}
          />);
          })}
      </form>
    )
  }
}

Node.propTypes = {
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