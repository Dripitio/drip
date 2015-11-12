import React, { Component } from 'react';
import { Input, Grid, Row, Col } from 'react-bootstrap';

import Block from './Block.jsx';


export default class Campaign extends Component {
  render() {
    let blocks = this.props.campaign.blocks,
      lists = this.props.campaign.userLists;

    return (
      <Grid fluid={true}>
        <Row>
          <Col md={12}>
            <div className="card">
              <div className="content">
                <div>
                  <Input
                    type="text"
                    placeholder="Campaign name"
                    value={this.props.campaign.name}
                    label="Campaing name"
                  />
                  <Input type="select" label="List">
                    <option value="">Select List</option>
                    {lists.map((list) =>
                      <option key={list.id} value={list.id}>{list.name}</option>
                      )}
                  </Input>
                </div>
              </div>
            </div>
            <div className="drip-blocks">
              {blocks.map((block) => {
                return (
                <div key={block.id} className="drip-block">
                  <Block block={block} nodes={this.props.campaign.nodes}/>
                  <hr/>
                </div>
                  );
                })}
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

Campaign.propTypes = {
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
