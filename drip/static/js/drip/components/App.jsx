import React, { Component } from 'react';
import { Input, Grid, Row, Col,  ButtonToolbar, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import Block from './Block.jsx';

import {
  NODE_EDIT, NODE_SAVE
} from '../constants/actions.jsx';


class App extends Component {
  handleEditNode(dispatch) {
    return (id) => dispatch({type:NODE_EDIT, node: {id: id}});
  }

  handleSaveNode(dispatch) {
    return (id) => dispatch({type:NODE_SAVE, node: {id: id}});
  }

  render() {
    const { dispatch, campaign } = this.props;
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
                  label="Campaing name"
                  onChange={(e) => dispatch({type: 'UPDATE_CAMPAIGN_NAME', campaign: {name: e.target.value}})}
                />
                <Input
                  type="select"
                  label="List"
                  onChange={(e) => dispatch({type: 'UPDATE_CAMPAIGN_LIST', campaign: {userList: e.target.value}})}
                >
                  <option value="">Select List</option>
                  {campaign.userLists.map((list) =>
                  <option key={list.id} value={list.id}>{list.name}</option>
                    )}
                </Input>
              </div>
            </div>
            <div className="drip-blocks">
              {campaign.blocks.map((block) => {
                return (
                <div key={block.id} className="drip-block">
                  <Block
                    block={block}
                    nodes={campaign.nodes}
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
  campaign: React.PropTypes.shape({

    /**
     * General campaign configuration fields
     *
     * :name: Campaign name
     * :userLists: Array of available recipiant lists
     */
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    userLists: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      selected: React.PropTypes.bool
    })),
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
    nodes: React.PropTypes.arrayOf(React.PropTypes.shape({
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
    }))
  })
};

// use connect to inject redux state as components pops
export default connect((state) => {
  return state
})(App);
