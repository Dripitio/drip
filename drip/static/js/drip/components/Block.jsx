import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col } from 'react-bootstrap';

import moment from 'moment';

import Node from './Node.jsx';


class DripDatetime extends Component {
  render() {
    let datetime = moment(this.props.datetime);
    return (
      <div className="drip-datetime-box">
        <div className="date">
          {datetime.format('D MMM')}
        </div>
        <div className="time">
          {datetime.format('h:mm A')}
        </div>
      </div>
    )
  }
}

var Block = React.createClass({
  getInitialState: function () {
    return {
      blockNodes: this.props.block.nodeIds
    }
  },

  handleAddNode: function () {
    this.props.addNode(this.props.block.id);
    this.setState({
      blockNodes: this.props.block.nodeIds
    });
  },

  handleDeleteNode: function () {
    return (id) => {
      this.props.onDelete(id);
      this.setState({
        blockNodes: this.props.block.nodeIds
      });
    }
  },

  render: function () {
    let nodes = this.props.nodes;
    return (
      <Row>
        <div>
          <Col md={3}>
            <DripDatetime datetime={this.props.block.datetime}></DripDatetime>
          </Col>
          <Col md={9}>
            <div className="drip-blocks">
              {this.props.block.nodeIds.map((nid) => {
                let node = _.findWhere(nodes, {id: nid});
                return (
                <div key={node.id} className="card drip-block">
                  <div className="content">
                    {(() => {
                      return <Node
                        node={node}
                        nodes={this.props.nodes.filter((node) => !this.props.block.nodeIds.find((id) => (id == node.id)))}
                        templates={this.props.templates}
                        actions={this.props.actions}

                        onNodeChange={this.props.onNodeChange}
                        onSave={this.props.onSave}
                        onEdit={this.props.onEdit}
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
        </div>
      </Row>
    );
  }
});

export default Block;


Block.propTypes = {
  block: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    datetime: React.PropTypes.string,
    nodeIds: React.PropTypes.arrayOf(React.PropTypes.string)
  }).isRequired,

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
  onDelete: React.PropTypes.func.isRequired,
  addNode: React.PropTypes.func.isRequired,
  onNodeChange: React.PropTypes.func.isRequired
};
