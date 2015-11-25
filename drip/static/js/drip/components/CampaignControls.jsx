import React, { PropTypes } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';


const CampaignControls = React.createClass({
  propTypes: {
    saved: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    publish: PropTypes.func.isRequired
  },

  render() {
    if (this.props.saved) {
      return (
        <ButtonToolbar>
          <Button bsStyle="info"
                  className="btn-fill pull-right"
                  onClick={this.props.update}
          >
            Update campaign
          </Button>
          <Button bsStyle="primary"
                  className="btn-fill pull-right"
                  onClick={this.props.publish}
          >
            Publish
          </Button>
        </ButtonToolbar>);
    }

    return (
      <ButtonToolbar>
        <Button bsStyle="success"
                className="btn-fill pull-right"
                onClick={this.props.save}
        >
          Save campaign
        </Button>
      </ButtonToolbar>);
  }
});


function campaignControls(saved, save, update, publish) {
  if (saved) {
    return (
      <ButtonToolbar>
        <Button bsStyle="info"
                className="btn-fill pull-right"
                onClick={update}
        >
          Update campaign
        </Button>
        <Button bsStyle="primary"
                className="btn-fill pull-right"
                onClick={publish}
        >
          Publish
        </Button>
      </ButtonToolbar>);
  }

  return (
    <ButtonToolbar>
      <Button bsStyle="success"
              className="btn-fill pull-right"
              onClick={save}
      >
        Save campaign
      </Button>
    </ButtonToolbar>);
}

export default CampaignControls;
