require('sass/dashboard.scss');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col } from 'react-bootstrap';

import moment from 'moment';


class GeneralFields extends Component {
  render() {
    let lists = this.props.campaign.userList;
    return (
      <div>
        <Input
          type="text"
          placeholder="Campaign name"
          value={this.props.campaign.name}
          label="Campaing name"
        />
        <Input type="select" label="List">
          <option value="">Select List</option>
          {lists.map((list) => {return <option key={list.id} value={list.id}>{list.name}</option>})}
        </Input>
      </div>
    )
  }
}


class DripDatetime extends Component {
  render() {
    return (
      <div className="drip-datetime-box">
        <div className="date">
          Dec 20
        </div>
        <div className="time">
          11:00 PM
        </div>
      </div>
    )
  }
}


class DripNode extends Component {
  render() {
    let templates = this.props.node.templates;
    return (
      <form action="">
        <Input
          type="text"
          placeholder="Name"
          value={this.props.node.name}
          label="Name"
        />
        <Input
          type="text"
          placeholder="Description"
          value={this.props.node.description}
          label="Description"
        />
        <Input type="select" label="Templates">
          <option value="">Select Template</option>
          {templates.map((t) => {return <option key={t.id} value={t.id}>{t.name}</option>})}
        </Input>
      </form>
    )
  }
}


class DripNodes extends Component {
  render() {
    let nodes = this.props.nodes;
    return (
      <div className="drip-blocks">
        {nodes.map((node) => {
          return (
          <DripNode key={node.id} node={node}/>
            );
          })}
      </div>
    );
  }
}


class DripBlock extends Component {
  render() {
    return (
      <Row>
        <div>
          <Col md={3}>
            <DripDatetime datetime={this.props.block.datetime}></DripDatetime>
          </Col>
          <Col md={9}>
            <DripNodes nodes={this.props.block.nodes}></DripNodes>
          </Col>
        </div>
      </Row>
    )
  }
}

class DripBlocks extends Component {
  render() {
    let blocks = this.props.blocks;
    return (
      <div className="drip-blocks">
        {blocks.map((block) => {
          return (
          <DripBlock key={block.id} block={block}/>
            );
          })}
      </div>
    );
  }
}


class DripCampaign extends Component {
  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={12}>
            <div className="card">
              <div className="content">
                <GeneralFields campaign={this.props.campaign}/>
                <hr/>
                <DripBlocks blocks={this.props.campaign.blocks}></DripBlocks>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

DripCampaign.propTypes = {
  campaign: React.PropTypes.shape({

    /**
     * General campaign configuration fields
     *
     * :name: Just for convinience. Each campaign should have a name
     * :userList: Array of available recipiant lists
     */
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    userList: React.PropTypes.arrayOf(React.PropTypes.shape({
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
          name: React.PropTypes.string
        })),
        triggers: React.PropTypes.arrayOf(React.PropTypes.shape({
          id: React.PropTypes.string,
          actionId: React.PropTypes.string,
          nodeId: React.PropTypes.string
        }))
      }))
    }))
  })
};


let campaignState = {
  id: 'abc',
  name: '',
  userList: [
    {id: 'abclist', name: 'Default List', selected: false},
    {id: 'abccustomlist', name: 'Shopify Orders List', selected: false}
  ],

  blocks: [
    {
      id: 'blockid1',
      datetime: moment.utc().toISOString(),

      nodes: [
        {
          id: 'nodeid1',
          name: '',
          description: '',
          templates: [
            {id: 'template1', name: 'ML Template 1', selected: false},
            {id: 'template2', name: 'ML Template 2', selected: false},
            {id: 'template3', name: 'ML Template 3', selected: false}
          ],
          actions: [
            {id: 'actionOpen', name: 'Open'},
            {id: 'actionAnyClicked', name: 'Clicked any link'}
          ],
          triggers: []
        }
      ]
    }
  ]
};

ReactDOM.render(
  <DripCampaign campaign={campaignState}></DripCampaign>,
  document.getElementById('drip')
);
