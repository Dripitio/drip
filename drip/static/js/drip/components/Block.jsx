import React from 'react';
import { Row, Col } from 'react-bootstrap';

import Node from './Node.jsx';
import { NodeModal } from './Modal.jsx';
import DripDatetime from './DripDatetime.jsx';


var Block = React.createClass({
  getInitialState: function () {
    return {
      blockNodes: this.props.block.nodeIds
    }
  },

  getDefaultProps: function () {
    return {
      nodes: [],
      templates: [],
      actions: []
    }
  },

  handleAddNode: function () {
    //noinspection JSUnresolvedVariable
    this.refs.modal.modalShow();
  },

  handleEditNode: function (nodeId) {
    //noinspection JSUnresolvedVariable
    this.refs.modal.editNode(nodeId);
  },

  handleDeleteNode: function () {
    return (id) => {
      this.props.onDelete(id);
      this.setState({
        blockNodes: this.props.block.nodeIds
      });
    }
  },

  handleSetBlockDatetime: function (datetime) {
    this.props.setBlockDatetime({
      id: this.props.block.id, datetime: datetime
    });
  },

  render: function () {
    const { nodes, block, templates, actions } = this.props;
    return (
      <Row>
        <Col md={3}>
          <DripDatetime datetime={block.datetime}
                        handleSetBlockDatetime={this.handleSetBlockDatetime}/>
        </Col>
        <Col md={9}>
          <div className="drip-blocks">
            {block.nodeIds.map((nid) => {
              let node = nodes.find((n) => n.id === nid);
              return (
              <div key={node.id} className="card drip-block">
                <div className="content">
                  {(() => {
                    return <Node
                      node={node}
                      nodes={nodes}
                      templates={templates}
                      actions={actions}

                      onSave={this.props.onSave}
                      onEdit={this.handleEditNode}
                      onDelete={this.handleDeleteNode()}
                    />
                    })()}
                </div>
              </div>
                );
              })}
          </div>
          <div className="add-node"
               onClick={this.handleAddNode}>
            <div className="btn">+</div>
          </div>
        </Col>
        <NodeModal
          show={this.state.modalShow}
          onHide={this.modalClose}

          templates={templates}
          actions={actions}
          nodes={nodes}

          block={block}

          onSave={this.props.onSave}
          onEdit={this.props.onEdit}

          ref="modal"
        />
      </Row>
    );
  }
});

export default Block;
