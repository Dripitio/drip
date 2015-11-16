require('sass/dashboard.scss');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux'
import moment from 'moment';
import * as _ from 'lodash';

import App from './components/App.jsx';

import {
  NODE_SAVE,
  NODE_EDIT,
  NODE_ADD,
  NODE_DELETE,
  BLOCK_ADD
} from './constants/actions.jsx';


let campaignState = {
  campaign: {
    id: 'abc'
  },
  userLists: [
    {id: 'abclist', name: 'Default List'},
    {id: 'abccustomlist', name: 'Shopify Orders List'}
  ],

  templates: [
    {
      id: 'template1',
      name: 'ML Template 1'
    },
    {
      id: 'template2',
      name: 'ML Template 2'
    },
    {
      id: 'template3',
      name: 'ML Template 3'
    }
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
      nodeIds: ['nodeid1']
    }
  ],

  nodes: [
    {
      id: 'nodeid1',
      complete: false,
      triggers: [{id: 'trigger1'}]
    }
  ]
};


var reducer = (state = campaignState, action) => {
  "use strict";
  var newState;
  console.log('reducing');
  switch (action.type) {
    case NODE_SAVE:
      newState = Object.assign({}, state);
      // Set node as completed
      _.findWhere(newState.nodes, {id: action.node.id}).complete = true;
      return newState;
    case NODE_EDIT:
      newState = Object.assign({}, state);
      // Set node as incomplete
      _.findWhere(newState.nodes, {id: action.node.id}).complete = false;
      return newState;
    case NODE_ADD:
      newState = Object.assign({}, state);
      var node = {id: _.uniqueId('node_'), triggers: [{id: _.uniqueId('trigger_')}]};
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
    case BLOCK_ADD:
      newState = Object.assign({}, state);
      newState.blocks.push({
        id: _.uniqueId('block_'),
        datetime: moment.utc().add(1, 'days').toISOString(),
        nodeIds: []
      });
      return newState;
    default:
      console.log('default');
      return state;
  }
};

let store = createStore(reducer);
console.log(store);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('drip')
);
