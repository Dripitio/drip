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


class AddButton extends Component {
  render() {
    return (
      <div className="add-node">
        <div className="btn">+</div>
      </div>
    );
  }
}

export default class Block extends Component {
  render() {
    let nodes = this.props.block.nodes;
    return (
      <Row>
        <div>
          <Col md={3}>
            <DripDatetime datetime={this.props.block.datetime}></DripDatetime>
          </Col>
          <Col md={9}>
            <div className="drip-blocks">
              {nodes.map((node) => {
                return (
                <div key={node.id} className="card">
                  <div className="content">
                    <Node node={node} allNodes={this.props.allNodes}/>
                  </div>
                </div>
                  );
                })}
            </div>
            <AddButton />
          </Col>
        </div>
      </Row>
    );
  }
}

Block.propTypes = {
  block: React.PropTypes.shape({
    id: React.PropTypes.string,
    datetime: React.PropTypes.string,

    /**
     * Each block contains multiple nodes. Node represents an message, with template,
     * action triggers
     *
     * :name: node name
     * :description: users note about given node
     * :templates: available templates from e.g. mailchimp
     * :actions: events that can trigger next message scheduling
     * :triggers: couples actions with nodes
     */
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
  }),

  allNodes: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }))
};
