from datetime import datetime
from data_captain import DataCaptain
from model import DripCampaign, Node


def process_campaigns(mw):
    """
    processes all campaigns
    looks for nodes that have to be processed
    (start time in the past but nod processed yet)
    form segments for the nodes, send emails, makes nodes as done
    """
    now = datetime.utcnow()
    print "it's", now, "now! checking drip campaigns.."
    # iterate over all active drip campaigns
    for drip_campaign in DripCampaign.objects(active=True):
        print "   ", "checking drip campaign", drip_campaign.name, drip_campaign.id
        # initialize data captain for this shop
        dc = DataCaptain(drip_campaign["shop_url"], mw)
        dc.update_lists()
        dc.get_folder()
        # update lists
        dc.fetch_members_for_list(drip_campaign["list_id"])
        print "   ", "checking nodes"
        # iterate over all unprocessed drip campaign's nodes that have already surpassed start_time
        for node in list(Node.objects(drip_campaign_id=drip_campaign.id, done=False, start_time__lte=now)):
            print "   ", "   ", "processing node", node.title, node.start_time, node.id
            # create user segment for the node
            dc.form_segment(node.id)
            # prepare a mailchimp campaign for the node
            mc_campaign_id = dc.create_node_campaign(node.id)
            print "   ", "   ", "node segment formed:", mc_campaign_id
            # if successful, send the emails
            if mc_campaign_id is not None:
                print "   ", "   ", "sending node emails"
                dc.send_campaign(mc_campaign_id)
            # mark node as processed
            node.update(set__done=True, set__updated_at=datetime.utcnow())
            print "   ", "   ", "node processing finished!"
