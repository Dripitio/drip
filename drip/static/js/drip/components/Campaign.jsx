import React from 'react';
import { Input } from 'react-bootstrap';


var Campaign = React.createClass({
  render() {
    let selected = this.props.campaign.userList ? this.props.campaign.userList.id : '';

    return (
      <div>
        <Input
          type="text"
          placeholder="Campaign name"
          defaultValue={this.props.campaign.name}
          label="Campaing name"/>
        <Input
          type="select"
          defaultValue={selected}
          label="List">
          <option value="">Select List</option>
          {this.props.userLists.map((list) =>
          <option key={list.id} value={list.id}>{list.name}</option>
            )}
        </Input>
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
    userList: React.PropTypes.shape({
      id: React.PropTypes.string
    })
  }).isRequired
};


export default Campaign;