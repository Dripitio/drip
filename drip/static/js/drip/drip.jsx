require('sass/dashboard.scss');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux'
import moment from 'moment';

import App from './components/App.jsx';


let campaignState = {
  campaign: {
    id: 'abc',
    name: 'gooof',
    userLists: [
      {id: 'abclist', name: 'Default List', selected: false},
      {id: 'abccustomlist', name: 'Shopify Orders List', selected: false}
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
        templates: [
          {id: 'template1', name: 'ML Template 1', selected: false},
          {id: 'template2', name: 'ML Template 2', selected: true},
          {id: 'template3', name: 'ML Template 3', selected: false}
        ],
        actions: [
          {id: 'actionOpen', name: 'Open'},
          {id: 'actionAnyClicked', name: 'Clicked any link'}
        ],
        triggers: [
          {id: 'onetrigger1', actionId: 'actionOpen', nodeId: ''}
        ],
        complete: false
      },
      {
        id: 'nodeid2',
        name: 'foobar',
        description: 'barfoo',
        templates: [
          {id: 'template1', name: 'ML Template 1', selected: false},
          {id: 'template2', name: 'ML Template 2', selected: true},
          {id: 'template3', name: 'ML Template 3', selected: false}
        ],
        actions: [
          {id: 'actionOpen', name: 'Open'},
          {id: 'actionAnyClicked', name: 'Clicked any link'}
        ],
        triggers: [
          {id: 'onetrigger1', actionId: 'actionOpen', nodeId: ''}
        ],
        complete: true
      }
    ]
  }
};


var reducer = (state, action) => {
  "use strict";
  var newState;
  switch (action.type) {
    case 'SAVE_NODE':
      newState = Object.assign({}, state);
      // Set node as completed
      _.findWhere(newState.campaign.nodes, {id: action.node.id}).complete = true;
      return newState;
    case 'UPDATE_CAMPAIGN_NAME':
      newState = Object.assign(state.campaign, action.campaign);
      return {campaign: newState};
    case 'UPDATE_CAMPAIGN_LIST':
      newState = Object.assign({}, state), tmp;
      // TODO: simplify. too much iterations.
      tmp = _.findWhere(newState.campaign.userLists, {selected: true});
      if (tmp) {
        tmp.selected = false;
      }
      tmp = _.findWhere(newState.campaign.userLists, {id: action.campaign.userList});
      if (tmp) {
        tmp.selected = true
      }
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
