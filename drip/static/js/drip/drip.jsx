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
  NODE_DELETE
} from './constants/actions.jsx';


let campaignState = {
  campaign: {
    id: 'abc',
    name: 'gooof',
    userList: {id: 'abclist'}
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
      nodeIds: ['nodeid1', 'nodeid2']
    }
  ],

  nodes: [
    {
      id: 'nodeid1',
      name: '',
      description: '',
      template: {id: 'template1'},
      triggers: [
        {id: 'onetrigger1', actionId: 'actionOpen', nodeId: ''}
      ],
      complete: false
    },
    {
      id: 'nodeid2',
      name: 'foobar',
      description: 'barfoo',
      template: {id: 'template2'},
      triggers: [
        {id: 'onetrigger1', actionId: 'actionOpen', nodeId: ''}
      ],
      complete: true
    }
  ]
};


var reducer = (state, action) => {
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
    default:
      console.log('default');
      return state;
  }
};

let store = createStore(reducer, campaignState);
console.log(store);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('drip')
);
