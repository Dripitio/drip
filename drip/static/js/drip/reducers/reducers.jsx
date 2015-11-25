import moment from 'moment';
import * as _ from 'lodash';

import {
  NODE_SAVE,
  NODE_EDIT,
  NODE_ADD,
  NODE_DELETE,
  NODE_CHANGE,

  BLOCK_ADD,
  BLOCK_SET_DATETIME,

  CAMPAIGN_SAVE
} from '../constants/actions.jsx';


const campaignState = {
  campaign: {name: '', userListId: ''},

  userLists: [
    {id: 'abclist', name: 'Default List'},
    {id: 'abccust', name: 'Shopify Orders List'}
  ],

  templates: [
    {id: 'template1', name: 'ML Template 1'},
    {id: 'template2', name: 'ML Template 2'},
    {id: 'template3', name: 'ML Template 3'}
  ],

  actions: [
    {
      id: 'actionOpen',
      name: 'Open',
      templates: ['template1', 'template2', 'template3']
    },
    {
      id: 'actionAnyClicked',
      name: 'Clicked any link',
      templates: ['template1', 'template2', 'template3']
    }
  ],

  blocks: [
    {
      id: 'blockid1',
      datetime: moment.utc().add(1, 'days').toISOString(),
      nodeIds: []
    }
  ],

  nodes: []
};


export var dripReducer = (state = window.preload ? window.preload : campaignState, action) => {
  "use strict";
  var newState;

  console.log('reducing');

  switch (action.type) {
    case NODE_SAVE:
      newState = Object.assign({}, state);

      const nodeId = _.uniqueId('node_');
      newState.nodes.push({
        id: nodeId,
        name: action.node.name,
        description: action.node.description,
        templateId: action.node.templateId,
        triggers: action.node.triggers
      });

      _.findWhere(newState.blocks, {id: action.node.blockId}).nodeIds.push(nodeId);

      return newState;

    case NODE_EDIT:
      newState = Object.assign({}, state);

      // Set node as incomplete
      _.assign(_.findWhere(newState.nodes, {id: action.node.id}), action.node);

      return newState;

    case NODE_ADD:
      newState = Object.assign({}, state);
      var node = {
        id: _.uniqueId('node_'),
        name: '',
        description: '',
        templateId: '',
        triggers: [{id: _.uniqueId('trigger_')}]
      };
      newState.nodes.push(node);
      _.findWhere(newState.blocks, {id: action.block.id}).nodeIds.push(node.id);
      return newState;

    case NODE_DELETE:
      newState = Object.assign({}, state);
      // remove node and references to from ALL nodes in ALL blocks
      _.remove(newState.nodes, (node) => node.id == action.node.id);
      _.forEach(newState.blocks, (block) => {
        _.remove(block.nodeIds, (id) => id == action.node.id);
      });
      return newState;

    case NODE_CHANGE:
      newState = Object.assign({}, state);
      let node = newState.nodes.find((node) => node.id === action.node.id);
      _.assign(node, action.node);
      return newState;

    case BLOCK_ADD:
      newState = Object.assign({}, state);
      newState.blocks.push({
        id: _.uniqueId('block_'),
        datetime: moment.utc().add(1, 'days').toISOString(),
        nodeIds: []
      });
      return newState;

    case BLOCK_SET_DATETIME:
      newState = Object.assign({}, state);
      let block = newState.blocks.find((b) => b.id === action.block.id);
      block.datetime = action.block.datetime;
      return newState;

    case CAMPAIGN_SAVE:
      newState = Object.assign({}, state);
      console.log('saving state');
      return newState;

    default:
      console.log('default');
      console.log(action);
      return state;
  }
};