import React from 'react';
import { Input } from 'react-bootstrap';


export var DripInput = React.createClass({
  /**
   * DripInput component used as Drip campaign dynamic form text input field
   */
  propTypes: {
    placeholder: React.PropTypes.string,
    label: React.PropTypes.string,
    defaultValue: React.PropTypes.string,

    validate: React.PropTypes.func.isRequired
  },

  getInitialState() {
    // store input value and its validity
    return {
      value: this.props.defaultValue,
      valid: this.props.validate(this.props.defaultValue)
    }
  },

  handleChange() {
    let value = this.refs.input.getValue();

    // validate that value is valid by checking
    let valid = this.props.validate(value);

    this.setState({value: value, valid: valid});
  },

  render() {
    return (
      <Input
        type="text"
        placeholder={this.props.placeholder}
        defaultValue={this.props.defaultValue}
        label={this.props.label}
        ref="input"
        bsStyle={this.state.valid ? undefined : 'error'}
        onChange={this.handleChange}
      />
    );
  }
});

export var DripSelect = React.createClass({
  propTypes: {
    placeholder: React.PropTypes.string,
    label: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    defaultOption: React.PropTypes.string.isRequired,
    options: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string
    }))
  },

  getInitialState() {
    // store input value and its validity
    return {
      value: this.props.defaultValue,
      valid: this.validate(this.props.defaultValue)
    }
  },

  validate(value) {
    return !!value;
  },

  handleChange() {
    let value = this.refs.input.getValue();

    // validate that value is valid by checking
    let valid = this.validate(value);

    this.setState({value: value, valid: valid});
  },

  render() {
    return (
      <div>
        {(() => {
          return (
          <Input
            type="select"
            label={this.props.label}
            defaultValue={this.props.defaultValue}
            ref="input"
            bsStyle={this.state.valid ? undefined : 'error'}
            onChange={this.handleChange}
          >
            <option value="">{this.props.defaultOption}</option>
            {this.props.options.map((o) => {
              return <option key={o.id} value={o.id}>{o.name}</option>
              })}
          </Input>
            );
          })()}
      </div>
    );
  }
});