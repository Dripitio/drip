import React from 'react';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';

import { DripInput, DripSelect } from './Fields.jsx';


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
      templateId: this.refs.template.state.value
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
      templateId: this.refs.template.state.value
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

  render() {
    let btn;
    if (this.state.edit) {
      btn = <Button bsStyle="primary" onClick={this.handleEdit}>Update</Button>
    } else {
      btn = <Button bsStyle="success" onClick={this.handleSave}>Save</Button>
    }
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