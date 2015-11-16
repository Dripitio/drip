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
                        nodes={this.props.nodes}
                        templates={this.props.templates}
                        actions={this.props.actions}

                        onSave={this.props.onSave}
                        onEdit={this.props.onEdit}
                      />
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
  onSave: React.PropTypes.func.isRequired
};
