import React from 'react';
import { Row, Col, FormControls } from 'react-bootstrap';

import Controls from './Controls.jsx';


var Node = React.createClass({
  getDefaultProps: function () {
    return {
      nodes: [],
      templates: [],
      actions: []
    }
  },

  handleEdit: function () {
    this.props.onEdit(this.props.node.id);
  },

  handleDelete: function () {
    this.props.onDelete(this.props.node.id);
  },

  render: function () {
    const template = this.props.templates.find(
      (template) => template.id === this.props.node.templateId
    );

    return (
      <form>
        <Controls
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
          value={template.name}/>
        <Row>
          <Col md={12}>
            <div className="form-group">
              <label className="control-label">
                <span>Triggers</span>
              </label>
            </div>
          </Col>
          {this.props.node.triggers.map((trigger) => {
            return (
            <div key={trigger.id} className="trigger">
              <Col md={6}>
                <FormControls.Static
                  value={trigger.actionId}/>
              </Col>
              <Col md={6}>
                <FormControls.Static
                  value={trigger.nodeId}/>
              </Col>
            </div>
              );
            })}
        </Row>
      </form>
    );
  }
});

export default Node;
