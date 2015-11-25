import React, { Component } from 'react';
import { Input, Grid, Row, Col,  ButtonToolbar, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import Block from './Block.jsx';
import Campaign from './Campaign.jsx';

import {
  CAMPAIGN_SAVE
} from '../constants/actions.jsx';

import {
  handleAddBlock,
  handleAddNode,
  handleDeleteNode,
  handleEditNode,
  handleSaveNode,
  handleSetDatetime
} from '../actions/drip-actions.jsx';


var App = React.createClass({
  getInitialState: function () {
    return {
      nodes: this.props.nodes
    };
  },

  handleSaveCampaign: function (dispatch) {
    // FIXME: convert to action creator and make async call to BE
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

    const iDispatch = (data) => {
      // TODO: is this really only way to sync data?
      // sync nodes on state change
      this.setState({
        nodes: this.props.nodes
      });
      return dispatch(data);
    };

    return (
      <Grid fluid={true}>
        <Row>
          <Col md={12}>
            <div className="card">
              <div className="content">
                <ButtonToolbar>
                  <Button bsStyle="success"
                          className="btn-fill pull-right"
                          onClick={this.handleSaveCampaign(iDispatch)}
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

                    addNode={handleAddNode(iDispatch)}
                    setBlockDatetime={handleSetDatetime(iDispatch)}
                    onDelete={handleDeleteNode(iDispatch)}
                    onEdit={handleEditNode(iDispatch)}
                    onSave={handleSaveNode(iDispatch)}/>
                  <hr/>
                </div>
                  );
                })}
            </div>
            <div className="add-node"
                 onClick={handleAddBlock(iDispatch)}>
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
   * id is obtained if campaign has been saved to server
   */
  id: React.PropTypes.string,

  /**
   * General campaign configuration fields
   *
   * :name: Campaign name
   * :userLists: Array of available recipiant lists
   */
  campaign: React.PropTypes.shape({
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
