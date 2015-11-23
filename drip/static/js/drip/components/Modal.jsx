import React from 'react';
import { Row, Col, Modal, ButtonToolbar, Button } from 'react-bootstrap';
import * as _ from 'lodash';

import { DripInput, DripSelect } from './Fields.jsx';


var Trigger = React.createClass({
  getInitialState() {
    return {
      actionId: this.props.trigger.actionId,
      nodeId: this.props.trigger.nodeId
    }
  },

  handleChange() {
    this.props.onValueChange({
      id: this.props.trigger.id,
      actionId: this.refs.event.refs.input.getValue(),
      nodeId: this.refs.action.refs.input.getValue()
    });
  },

  render() {
    return (
      <div className="trigger">
        <Col md={5}>
          <DripSelect
            defaultValue={this.props.trigger.actionId}
            defaultOption="Select Event"
            options={this.props.actions}
            onChange={this.handleChange}
            ref="event"
          />
        </Col>
        <Col md={5}>
          <DripSelect
            defaultValue={this.props.trigger.nodeId}
            defaultOption="Select Action"
            options={this.props.nodes}
            onChange={this.handleChange}
            ref="action"
          />
        </Col>
        <Col md={2}>
              <span className="removeTrigger"
                    onClick={() => console.log('remove trigger')}>Remove</span>
        </Col>
      </div>
    );
  }
});

export var NodeModal = React.createClass({
  getInitialState() {
    return {
      show: false,
      edit: false,

      name: '',
      description: '',
      templateId: '',
      triggers: []
    };
  },

  validate() {
    return !!(this.refs.name.state.valid
    && this.refs.description.state.valid
    && this.refs.template.state.valid);
  },

  handleSave() {
    if (!this.validate()) {
      return;
    }

    this.props.onSave({
      blockId: this.props.block.id,
      name: this.refs.name.state.value,
      description: this.refs.description.state.value,
      templateId: this.refs.template.state.value,
      triggers: this.state.triggers
    });
    this.modalClose();
  },

  handleEdit() {
    if (!this.validate()) {
      return;
    }

    this.props.onEdit({
      id: this.state.id,
      name: this.refs.name.state.value,
      description: this.refs.description.state.value,
      templateId: this.refs.template.state.value,
      triggers: this.state.triggers
    });
    this.modalClose();
  },

  modalClose: function () {
    this.setState(this.getInitialState());
  },

  modalShow: function () {
    this.setState({show: true});
  },

  editNode: function (nodeId) {
    const node = this.props.nodes.find((node) => node.id === nodeId);
    if (node) {
      this.setState(node);
      this.setState({edit: true});
      this.modalShow();
    }
  },

  handleAddTrigger: function () {
    this.setState((previousState, currentProps) => {
      previousState.triggers.push({
        id: _.uniqueId('trigger'),
        actionId: '',
        nodeId: ''
      });
      return previousState;
    });
  },

  handleValueChange: function (trigger) {
    this.setState((previousState, currentProps) => {
      let t = previousState.triggers.find((t) => t.id === trigger.id);
      t.actionId = trigger.actionId;
      t.nodeId = trigger.nodeId;
      return previousState;
    });
  },

  render() {
    let btn, triggers;
    if (this.state.edit) {
      btn = <Button bsStyle="primary" onClick={this.handleEdit}>Update</Button>
    } else {
      btn = <Button bsStyle="success" onClick={this.handleSave}>Save</Button>
    }

    triggers = this.state.triggers.map(((trigger) => {
      return (
        <Trigger
          ref="trigger"
          key={trigger.id}
          actions={this.props.actions}
          nodes={this.props.nodes}
          trigger={trigger}
          onValueChange={this.handleValueChange}
        />
      );
    }).bind(this));

    return (
      <Modal show={this.state.show} onHide={this.modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Node</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <DripInput
              label="Name"
              placeholder="Name"
              defaultValue={this.state.name}
              validate={(value) => value.length > 0}
              ref="name"
            />
            <DripInput
              label="Description"
              placeholder="Description"
              defaultValue={this.state.description}
              validate={() => true}
              ref="description"
            />
            <DripSelect
              label="Templates"
              defaultValue={this.state.templateId}
              defaultOption="Select Template"
              options={this.props.templates}
              ref="template"
            />
            <Row>
              <Col md={12}>
                <div className="form-group">
                  <label className="control-label">
                    <span>Triggers</span>
                  </label>
                </div>
              </Col>
              {triggers}
              <Col md={12}>
                <span className="addTrigger"
                      onClick={this.handleAddTrigger}>Add trigger</span>
              </Col>
            </Row>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            {btn}
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
});