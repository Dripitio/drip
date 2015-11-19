from datetime import datetime
import traceback
import sys
from data_captain import DataCaptain
from model import DripCampaign, Node
from drip.backend.mailchimp_wrapper import MailchimpWrapper
from drip.db.user import User


def get_log_info(msg, additional=None, err=None):
    info = {
        "msg": msg,
        "time": datetime.utcnow(),
    }
    if additional is not None:
        info.update(additional)
    if err is not None:
        exc_type, exc_value, exc_traceback = sys.exc_info()
        tb = traceback.format_exception(exc_type, exc_value, exc_traceback)
        info.update({
            "exception": err,
            "traceback": tb,
        })
    return info


def process_campaigns(logger):
    """
    processes all campaigns
    looks for nodes that have to be processed
    (start time in the past but nod processed yet)
    form segments for the nodes, send emails, makes nodes as done
    """
    now = datetime.utcnow()
    logger.info(get_log_info("starting drip campaign processing.."))
    # iterate over all active drip campaigns
    for drip_campaign in list(DripCampaign.objects(active=True)):
        data_campaign = {
            "name": drip_campaign.name,
            "campaign_id": drip_campaign.id,
        }
        critical = False
        try:
            user_id = drip_campaign["user_id"]
            data_campaign["user_id"] = user_id
            logger.info(get_log_info("processing a drip campaign..", additional=data_campaign))
            # get user
            usr = User.objects(id=user_id)[0]
            # get mailchimp api key and initialize mailchimp wrapper
            mc_api_key = usr["mailchimp_integration"]["api_key"]
            mw = MailchimpWrapper(mc_api_key)
            # initialize data captain for this shop
            dc = DataCaptain(user_id, mw)
            dc.update_lists()
            dc.get_folder()
            # update lists
            dc.fetch_members_for_list(drip_campaign["list_id"])
            logger.info(get_log_info("checking campaign nodes..", additional=data_campaign))
            # iterate over all unprocessed drip campaign's nodes that have already surpassed start_time
            for node in list(Node.objects(drip_campaign_id=drip_campaign.id, done=False, start_time__lte=now)):
                data_node = {
                    "node_id": node.id,
                    "node_title": node.title,
                    "node_start_time": node.start_time,
                }
                data_node.update(data_campaign)
                logger.info(get_log_info("processing node..", additional=data_node))
                # from now on an occurring error will be considered critical
                # because we have started changing client's mailchimp data
                critical = True
                # create user segment for the node
                dc.form_segment(node.id)
                # prepare a mailchimp campaign for the node
                mc_campaign_id = dc.create_node_campaign(node.id)
                data_node.update({"mc_campaign_id": mc_campaign_id})
                logger.info(get_log_info("node segment formed", additional=data_node))
                # if successful, send the emails
                if mc_campaign_id is not None:
                    logger.info(get_log_info("sending node emails", additional=data_node))
                    dc.send_campaign(mc_campaign_id)
                # mark node as processed
                node.update(set__done=True, set__updated_at=datetime.utcnow())
                logger.info(get_log_info("node processing finished!", additional=data_node))
        except Exception, e:
            logger.error(get_log_info("failed processing drip campaign..", data_campaign, e))
            if critical:
                logger.error(get_log_info("campaign had reached a critical state, so we deactivate it",
                                          data_campaign))
                drip_campaign.update(set__active=False)
            else:
                logger.error(get_log_info("campaign had NOT reached a critical state, so we just leave it as it is",
                                          data_campaign))

    logger.info(get_log_info("drip campaign processing finished!"))
