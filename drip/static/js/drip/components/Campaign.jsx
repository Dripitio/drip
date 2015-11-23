import React from 'react';
import { Input } from 'react-bootstrap';

import { DripInput, DripSelect } from './Fields.jsx';


var Campaign = React.createClass({
  render() {
    return (
      <div>
        <DripInput
          label="Campaing name"
          placeholder="Campaign name"
          defaultValue={this.props.campaign.name}
          validate={(value) => value.length > 0}
          ref="name"
        />
        <DripSelect
          label="List"
          defaultValue={this.props.campaign.userListId}
          defaultOption="Select List"
          options={this.props.userLists}
          ref="userList"
        />
      </div>
    )
  }
});


Campaign.propTypes = {
  userLists: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  })).isRequired,

  campaign: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    userListId: React.PropTypes.string
  }).isRequired
};


export default Campaign;