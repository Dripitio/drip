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


export default Campaign;