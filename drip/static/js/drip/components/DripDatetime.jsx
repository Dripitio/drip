import React from 'react';
import moment from 'moment';


export default class DripDatetime extends React.Component {
  render() {
    let datetime = moment(this.props.datetime);
    return (
      <div className="drip-datetime-box">
        <div className="date">
          {datetime.format('D MMM')}
        </div>
        <div className="time">
          {datetime.format('h:mm A')}
        </div>
      </div>
    )
  }
}
