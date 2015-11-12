require('sass/dashboard.scss');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';

import Campaign from './components/Campaign.jsx';
import Utils from './utils.jsx';

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
      datetime: moment.utc().add(1, 'days').toISOString(),

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
  <Campaign campaign={campaignState}></Campaign>,
  document.getElementById('drip')
);
