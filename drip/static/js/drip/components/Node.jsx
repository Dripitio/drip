import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col } from 'react-bootstrap';


class Controls extends Component {
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


class Trigger extends Component {
  render() {
    let actions = this.props.actions,
      allNodes = this.props.allNodes;

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
            {allNodes.map((node) => {
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
        <Controls />
        <Input
          type="text"
          placeholder="Name"
          value={this.props.node.name}
          label="Name"
        />
        <Input
          type="text"
          placeholder="Description"
          value={this.props.node.description}
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
                   allNodes={this.props.allNodes}
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
  allNodes: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }))
};