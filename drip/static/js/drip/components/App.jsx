import React, { Component } from 'react';
import { Input, Grid, Row, Col,  ButtonToolbar, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import Block from './Block.jsx';
import Campaign from './Campaign.jsx';

import {
  NODE_EDIT,
  NODE_SAVE,
  NODE_ADD,
  NODE_DELETE,
  NODE_CHANGE,

  BLOCK_ADD,

  CAMPAIGN_SAVE
} from '../constants/actions.jsx';


var App = React.createClass({
  getInitialState: function () {
    // FIXME: do we really need to store nodes state? I think there is simpler solution for node
    // list sync between blocks;
    return {
      nodes: this.props.nodes
    };
  },

  updateNodeState: function () {
    this.setState({
      nodes: this.props.nodes
    });
  },

  handleEditNode: function (dispatch) {
    return (node) => {
      dispatch({type: NODE_EDIT, node});
      this.updateNodeState();
    };
  },

  handleSaveNode: function (dispatch) {
    return (node) => {
      dispatch({type: NODE_SAVE, node: node});
      this.updateNodeState();
    };
  },

  handleAddNode: function (dispatch) {
    return (id) => {
      dispatch({type: NODE_ADD, block: {id: id}});
      this.updateNodeState();
    };
  },

  handleDeleteNode: function (dispatch) {
    return (id) => {
      dispatch({type: NODE_DELETE, node: {id: id}});
      this.updateNodeState();
    };
  },

  handleAddBlock: function (dispatch) {
    return () => {
      dispatch({type: BLOCK_ADD});
      this.updateNodeState();
    };
  },

  handleSaveCampaign: function (dispatch) {
    return () => {
      dispatch({
        type: CAMPAIGN_SAVE,
        campaign: {
          name: this.refs.campaign.refs.name.state.value,
          userListId: this.refs.campaign.refs.userList.state.value
        }
      });
    };
  },

  render: function () {
    const { dispatch, campaign, blocks, nodes, userLists, templates, actions } = this.props;
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={12}>
            <div className="card">
              <div className="content">
                <ButtonToolbar>
                  <Button bsStyle="success"
                          className="btn-fill pull-right"
                          onClick={this.handleSaveCampaign(dispatch)}
                  >
                    Save campaign
                  </Button>
                </ButtonToolbar>
                <Campaign
                  userLists={userLists}
                  campaign={campaign}
                  ref="campaign"/>
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

                    addNode={this.handleAddNode(dispatch)}
                    onDelete={this.handleDeleteNode(dispatch)}
                    onEdit={this.handleEditNode(dispatch)}
                    onSave={this.handleSaveNode(dispatch)}/>
                  <hr/>
                </div>
                  );
                })}
            </div>
            <div className="add-node"
                 onClick={this.handleAddBlock(dispatch)}>
              <div className="btn">+</div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
});

App.propTypes = {
  /**
   * General campaign configuration fields
   *
   * :name: Campaign name
   * :userLists: Array of available recipiant lists
   */
  campaign: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    userListId: React.PropTypes.string
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
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,

    templateId: React.PropTypes.string.isRequired,

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
    // list of templates that can use this action
    templates: React.PropTypes.arrayOf(React.PropTypes.string)
  }))
};

// use connect to inject redux state as components pops
export default connect((state) => {
  return state
})(App);
