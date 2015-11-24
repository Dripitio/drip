import React from 'react';
import moment from 'moment';

import DateRangePicker from 'react-bootstrap-daterangepicker';


export default class DripDatetime extends React.Component {
  render() {
    let datetime = moment(this.props.datetime);
    return (
      <div className="drip-datetime-box">
        <DateRangePicker startDate={datetime}
                         minDate={datetime}
                         singleDatePicker
                         timePicker>
          <div className="date">
            {datetime.format('D MMM')}
          </div>
          <div className="time">
            {datetime.format('h:mm A')}
          </div>
        </DateRangePicker>
      </div>
    )
  }
}
