import React from 'react';
import moment from 'moment';

import DateRangePicker from 'react-bootstrap-daterangepicker';


var DripDatetime = React.createClass({
  getInitialState() {
    return {
      datetime: this.props.datetime,
      minDate: this.props.datetime
    }
  },

  handleDatetimeChange(e, datetime) {
    this.setState({
      datetime: datetime.startDate.toISOString()
    });
    this.props.handleSetBlockDatetime(this.state.datetime)
  },

  render() {
    let datetime = moment(this.state.datetime);
    return (
      <div className="drip-datetime-box">
        <DateRangePicker startDate={datetime}
                         minDate={moment(this.state.minDate)}
                         singleDatePicker
                         timePicker
                         autoApply
                         onApply={this.handleDatetimeChange}
        >
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
});

export default DripDatetime;
