import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col } from 'react-bootstrap';

import moment from 'moment';

import Node from './Node.jsx';
import StaticNode from './StaticNode.jsx';


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
                      if (node.complete) {
                        return <StaticNode node={node} nodes={this.props.nodes}/>
                        } else {
                        return <Node node={node} nodes={this.props.nodes}/>
                        }
                      })()}
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
    nodeIds: React.PropTypes.arrayOf(React.PropTypes.string)
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
    })),
    // if form not complete show edit form
    complete: React.PropTypes.bool
  })),

  onSave: React.PropTypes.func.isRequired
};
