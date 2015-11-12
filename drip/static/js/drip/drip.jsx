require('sass/dashboard.scss');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Grid, Row, Col } from 'react-bootstrap';

import moment from 'moment';

import Utils from './utils.jsx';


class GeneralFields extends Component {
  render() {
    let lists = this.props.userLists;
    return (
      <div>
        <Input
          type="text"
          placeholder="Campaign name"
          value={this.props.name}
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


class Trigger extends Component {
  render() {
    let actions = this.props.actions,
      allNodes = this.props.allNodes;

    return (
      <Row>
        <Col md={6}>
          <Input type="select" label="Events">
            <option value="">Select List</option>
            {actions.map((action) => {
              return (
              <option key={action.id} value={action.id}>{action.name}</option>
                );
              })}
          </Input>
        </Col>
        <Col md={6}>
          <Input type="select" label="Actions">
            <option value="">Select List</option>
            {allNodes.map((node) => {
              return (
              <option key={node.id} value={node.id}>{node.name}</option>
                );
              })}
          </Input>
        </Col>
      </Row>
    );
  }
}


class FormControleStaticInput extends Component {
  render() {
    return (
      <div class="form-group">
        <label class="col-sm-2 control-label">{this.props.label}</label>
        <div class="col-sm-10">
          <p class="form-control-static">{this.props.value}</p>
        </div>
      </div>
    )
  }
}


class DripNode extends Component {
  render() {
    let templates = this.props.node.templates,
      triggers = this.props.node.triggers,
      actions = this.props.node.actions;

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
        {triggers.map((trigger) => {
          return (
          <Trigger key={trigger.id}
                   trigger={trigger}
                   actions={actions}
                   allNodes={this.props.allNodes}
          />);
          })}
      </form>
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

class DripBlock extends Component {
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
                    <DripNode node={node} allNodes={this.props.allNodes}/>
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

class DripCampaign extends Component {
  render() {
    let blocks = this.props.campaign.blocks;
    let allNodes = this.props.campaign.blocks.map((block) => {
      return block.nodes.map((node) => {
        return {
          id: node.id,
          name: node.name
        };
      });
    });
    allNodes = Utils.flatten(allNodes);

    return (
      <Grid fluid={true}>
        <Row>
          <Col md={12}>
            <div className="card">
              <div className="content">
                <GeneralFields name={this.props.campaign.name}
                               userLists={this.props.campaign.userLists}/>
              </div>
            </div>
            <div className="drip-blocks">
              {blocks.map((block) => {
                return (
                <div key={block.id} className="drip-block">
                  <DripBlock block={block} allNodes={allNodes}/>
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

DripCampaign.propTypes = {
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
    }))
  })
};


let campaignState = {
  id: 'abc',
  name: '',
  userLists: [
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
          triggers: [
            {id: 'onetrigger1', actionId: 'actionOpen', nodeId: ''}
          ]
        }
      ]
    }
  ]
};

ReactDOM.render(
  <DripCampaign campaign={campaignState}></DripCampaign>,
  document.getElementById('drip')
);
