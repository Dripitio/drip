import React, { Component } from 'react';
import { Input, Grid, Row, Col,  ButtonToolbar, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import Block from './Block.jsx';

import {
  NODE_EDIT, NODE_SAVE
} from '../constants/actions.jsx';


class App extends Component {
  handleEditNode(dispatch) {
    return (id) => dispatch({type: NODE_EDIT, node: {id: id}});
  }

  handleSaveNode(dispatch) {
    return (id) => dispatch({type: NODE_SAVE, node: {id: id}});
  }

  render() {
    const { dispatch, campaign, blocks, nodes, userLists, templates, actions } = this.props;
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={12}>
            <div className="card">
              <div className="content">
                <ButtonToolbar>
                  <Button bsStyle="success" className="btn-fill pull-right">
                    Save campaign
                  </Button>
                </ButtonToolbar>
                <div className="clearfix"></div>
                <Input
                  type="text"
                  placeholder="Campaign name"
                  defaultValue={campaign.name}
                  label="Campaing name"/>
                <Input
                  type="select"
                  label="List">
                  <option value="">Select List</option>
                  {userLists.map((list) =>
                  <option key={list.id} value={list.id}>{list.name}</option>
                    )}
                </Input>
              </div>
            </div>
            <div className="drip-blocks">
              {blocks.map((block) => {
                return (
                <div key={block.id} className="drip-block">
                  <Block
                    block={block}
                    nodes={nodes}
                    templates={templates}
                    actions={actions}

                    onEdit={this.handleEditNode(dispatch)}
                    onSave={this.handleSaveNode(dispatch)}/>
                  <hr/>
                </div>
                  );
                })}
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

App.propTypes = {
  /**
   * General campaign configuration fields
   *
   * :name: Campaign name
   * :userLists: Array of available recipiant lists
   */
  campaign: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    userList: React.PropTypes.shape({
      id: React.PropTypes.string
    })
  }),

  /**
   * Campaign nodes are grouped in blocks. Each block has `datetime` attribute for scheduling
   * of given nodes
   *
   * :datetime: timestamp in UTC
   */
  blocks: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    datetime: React.PropTypes.string,
    nodeIds: React.PropTypes.arrayOf(React.PropTypes.string)
  })),

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
  })),

  userLists: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  })),

  templates: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  })),

  actions: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    templates: React.PropTypes.arrayOf(React.PropTypes.string)
  }))
};

// use connect to inject redux state as components pops
export default connect((state) => {
  return state
})(App);
