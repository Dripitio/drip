import React from 'react';

import { Row, Col, Input } from 'react-bootstrap';


var Triggers = React.createClass({
  render() {
    <Row>
      <Col md={6}>
        <Input type="select"
               label="Events"
               defaultValue={this.props.node.actionId}>
          <option value="">Select List</option>
          {actions.map((action) => {
            return (
            <option key={action.id} value={action.id}>{action.name}</option>
              );
            })}
        </Input>
      </Col>
      <Col md={6}>
        <Input type="select"
               label="Actions"
               defaultValue={this.props.node.nodeId}>
          <option value="">Select List</option>
          {this.props.nodes.map((node) => {
            return (
            <option key={node.id} value={node.id}>{node.name}</option>
              );
            })}
        </Input>
      </Col>
    </Row>
  }
});


Triggers.propTypes = {

};


export default Triggers;