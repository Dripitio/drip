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

export default Campaign;