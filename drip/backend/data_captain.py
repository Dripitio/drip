from collections import defaultdict
import re

from BeautifulSoup import BeautifulSoup as soup

from model import List, Template, DripCampaign, Node, Content, Trigger, \
    Member, Segment, Block

from datetime import datetime


class DataCaptain:

    PREFIX = "REACHLY"
    FOLDER_NAME = "DripCampaignWorkFolder"

    def __init__(self, user_id, mailchimp_wrapper):
        self.user_id = user_id
        self.mw = mailchimp_wrapper
        # no need to call this externally every time
        self.get_folder()

    def update_lists(self):
        """
        there are three types of lists:
        * not in db but in current list - get, save, set active
        * in db and in current list - set active
        * in db but not in current list - set inactive
        returns all active lists
        """
        current_lists = self.mw.get_lists()
        current_list_ids = set([lst["list_id"] for lst in current_lists])
        previous_list_ids = set([lst["list_id"] for lst in List.objects(user_id=self.user_id)])
        # set active:false to all not in current set
        List.objects(list_id__in=list(previous_list_ids-current_list_ids)).update(set__active=False,
                                                                                  set__updated_at=datetime.utcnow())
        # delete duplicates
        List.objects(list_id__in=list(previous_list_ids & current_list_ids)).delete()
        # save all new lsits
        for lst in current_lists:
            new_list = List(user_id=self.user_id, name=lst["name"], list_id=lst["list_id"], active=True,
                            members_euid=[])
            new_list.save()

        # return all active lists
        return self.get_lists()

    def get_lists(self):
        """
        get all active lists for this user
        return in form of dicts with list id "id" and name "name"
        """
        return [{"id": lst["list_id"], "name": lst["name"]}
                for lst in List.objects(user_id=self.user_id, active=True)]

    def update_templates(self):
        """
        there are three types of templates:
        * not in db but in current list - get, save, set active
        * in db and in current list - set active
        * in db but not in current list - set inactive
        returns all active templates
        """
        current_templates = self.mw.get_templates()
        current_template_ids = set([tmplt["template_id"] for tmplt in current_templates])
        previous_template_ids = set([tmplt["template_id"] for tmplt in Template.objects(user_id=self.user_id)])
        # set active:false to all not in current set
        Template.objects(template_id__in=list(previous_template_ids-current_template_ids)).update(set__active=False,
                                                                                                  set__updated_at=datetime.utcnow())
        # delete duplicates
        Template.objects(template_id__in=list(previous_template_ids&current_template_ids)).delete()
        # save all new lsits
        for tmplt in current_templates:
            source = self.mw.get_template_source(tmplt["template_id"])
            links = self.parse_links(source)
            new_template = Template(user_id=self.user_id, name=tmplt["name"], template_id=tmplt["template_id"],
                                    source=source, links=links, active=True)
            new_template.save()

        # return all active templates
        return self.get_templates()

    def get_templates(self):
        """
        get all active templates for this user
        return in form of dicts with template id "id" and name "name"
        """
        return [{"id": tmplt["template_id"], "name": tmplt["name"]}
                for tmplt in Template.objects(user_id=self.user_id, active=True)]

    def parse_links(self, source):
        """
        a bit hacky
        parses all href attributes from html
        then "find all urls" in them
        second step is because some href attributes in template
        can be placeholders etc., which we don't need
        """
        all_links = set()
        for tag in soup(source).findAll("a", {"href": True}):
            val = tag.attrMap["href"]
            urls = re.findall("""http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+""", val)
            if len(urls) == 1:
                all_links.add(urls[0])
        return sorted(list(all_links))

    def get_links(self, template_id):
        """
        get links for template 'template_id'
        see parse_links() for details
        """
        return self.parse_links(Template.objects(template_id=template_id)[0]["source"])

    def get_folder(self):
        """
        get folder id to work with
        in case folder doesn't exist (new user) create it
        """
        name = "%s_%s" % (self.PREFIX, self.FOLDER_NAME)
        folders = self.mw.get_folders()
        for fldr in folders:
            if fldr["name"] == name:
                self.folder_id = fldr["folder_id"]
                return
        self.folder_id = self.mw.create_folder(name)

    def create_drip_campaign(self, name, list_id, description=None):
        """
        save drip campaign to mongo
        return object id
        """
        new_drip_campaign = DripCampaign(
            user_id=self.user_id,
            name=name,
            list_id=list_id,
            description=description,
            active=False,
        )
        new_drip_campaign.save()
        return new_drip_campaign.id

    def activate_drip_campaign(self, id):
        """
        set campaign with given id to active
        """
        DripCampaign.objects(id=id).update(set__active=True, set__updated_at=datetime.utcnow())

    def deactivate_drip_campaign(self, id):
        """
        set campaign with given id to inactive
        """
        DripCampaign.objects(id=id).update(set__active=False, set__updated_at=datetime.utcnow())

    def get_drip_campaigns(self):
        """
        return list of all drip campaigns for this shop
        """
        return list(DripCampaign.objects(user_id=self.user_id))

    def create_node(self, drip_campaign_id, title, start_time, template_id, subject, from_email, from_name, initial,
                    description=None):
        """
        create a single drip campaign node, save to mongo
        return object id
        """
        new_content = Content(template_id=template_id, subject=subject, from_email=from_email, from_name=from_name)
        new_node = Node(
            drip_campaign_id=drip_campaign_id,
            title=title,
            start_time=start_time,
            description=description,
            content=new_content,
            initial=initial,
            done=False,
        )
        new_node.save()
        return new_node.id

    def create_trigger(self, drip_campaign_id, node_from, node_to, opened, clicked, any_click, default):
        """
        create a single drip campaign trigger link, save to mongo
        exactly three of [opened, clicked, any_click, default] must be None!!
        """
        # if any click, set it to a list of all links in the template
        if any_click:
            node = Node.objects(id=node_from)[0]
            any_click = self.get_links(node["content"]["template_id"])
        # assert int(opened is None) + int(clicked is None) + int(any_click is None) + int(default is None) == 2
        new_trigger = Trigger(
            drip_campaign_id=drip_campaign_id,
            node_from=node_from,
            node_to=node_to,
            opened=opened,
            clicked=clicked,
            any_click=any_click,
            default=default,
        )
        new_trigger.save()

    def save_block(self, drip_campaign_id, start_time, nodes_id):
        """
        save basic block info
        """
        new_block = Block(
            drip_campaign_id=drip_campaign_id,
            start_time=start_time,
            nodes_id=nodes_id
        )
        new_block.save()

    def fetch_members_for_list(self, list_id):
        """
        gets all members from given list
        saves to mongo
        updates member list for list_id
        """
        def save_member(mbr):
            Member.objects(member_id=mbr["member_id"]).update_one(upsert=True, set__email=mbr["email"],
                                                                  set__updated_at=datetime.utcnow())
            return mbr["member_id"]
        members_euid = [save_member(mbr) for mbr in self.mw.get_members(list_id)]
        List.objects(list_id=list_id).update(set__members_euid=members_euid,
                                             set__updated_at=datetime.utcnow())

    def form_segment(self, node_oid):
        """
        for given drip campaign node
        get the set of applicable members for this node
        and create a segment based on it
        there are two cases:
        1. node is initial node - then the segment is the whole list
        2. node is not initial node - gather the set based on segments of
           previous nodes by applying the trigger filters
        """
        # init empty segment and stuff
        new_segment = Segment()
        new_segment.save()
        name = "%s_seg_%s" % (self.PREFIX, new_segment.id)
        node = Node.objects(id=node_oid)[0]
        list_id = DripCampaign.objects(id=node["drip_campaign_id"])[0]["list_id"]
        node.update(set__segment_oid=new_segment.id, set__updated_at=datetime.utcnow())

        # gather all users that apply for this node after triggers on previous nodes
        all_euids = set()
        if node["initial"]:
            all_euids = set(List.objects(list_id=list_id)[0]["members_euid"])
        else:
            for trg in Trigger.objects(node_to=node_oid):
                for euids, to_node_oid in self.segment_by_triggers(trg["node_from"]):
                    if to_node_oid == node_oid:
                        all_euids.update(set(euids))

        # # intersect euids with current state of the list
        # # it might be the case that some people are removed from the list since previous email
        self.fetch_members_for_list(list_id)
        all_euids = all_euids & set(List.objects(list_id=list_id)[0]["members_euid"])

        all_euids = list(all_euids)

        # apply the user list to segment n stuff
        # if user list is empty, save only meta info and don't actually work with mailchimp
        if all_euids:
            segment_id = self.mw.create_segment(list_id, name)
            self.mw.update_segment_members(list_id, segment_id, all_euids)
        else:
            segment_id = None
        new_segment.update(set__segment_id=segment_id, set__name=name, members_euid=all_euids,
                           set__updated_at=datetime.utcnow())

    def segment_by_triggers(self, node_oid):
        """
        segments users of given node by triggers they have set
        deals with trigger priorities correctly
        each euid will be assigned to 0 or 1 succeeding node

        we assume triggers are not broken (e.g., a node has triggers for both specific links
        and any_click at the same time)

        returns a list of (euids, node_oid) pairs that describe that
        the set of euids are assigned to node node_oid after segmentation by triggers
        (there might be multiple sets of euids assigned to the same node)
        """
        # fetch member activity for all members of given node
        node = Node.objects(id=node_oid)[0]
        all_euids = Segment.objects(id=node.segment_oid)[0]["members_euid"]
        member_activity = self.mw.get_member_activity(node["campaign_id"], all_euids)

        # find which actions we are actually interested in here according to triggers
        check_opened = False
        check_clicked = set()
        for trg in Trigger.objects(node_from=node.id):
            if trg["opened"]:
                check_opened = True
            elif trg["clicked"]:
                check_clicked.add(trg["clicked"])
            elif trg["any_click"]:
                # if any click, add all links to interesting actions
                for link in trg["any_click"]:
                    check_clicked.add(link)

        # check if specific action is interesting to us
        def is_interesting(action):
            if action["action"] == "open":
                return check_opened
            if action["action"] == "click":
                return action["url"] in check_clicked
            return False

        # go through all member activities
        # and decide which segment it belongs to according to priorities
        # priorities are roughly like this: open < click < latest click
        # where click is a click on a link with a trigger assigned to it
        # everything not raising any of defined triggers is assigned to default segment
        # EXCEPT when there is an open trigger, and user has opened and clicked a non-trigger link
        # that's an open, not default
        segments = defaultdict(list)
        for ma in member_activity:
            interesting_actions = [action for action in ma["activity"] if is_interesting(action)]
            if not interesting_actions:
                segments["default"].append(ma["euid"])
            else:
                last_open = None
                last_click = None
                for action in sorted(interesting_actions, key=lambda a: a["timestamp"]):
                    if action["action"] == "open":
                        last_open = action
                    elif action["action"] == "click":
                        last_click = action
                if last_click is None and last_open is None:
                    segments["default"].append(ma["euid"])
                elif last_click is None and last_open is not None:
                    segments["opened"].append(ma["euid"])
                elif last_click is not None:
                    segments[last_click["url"]].append(ma["euid"])
                    segments["any_click"].append(ma["euid"])

        # go through defined triggers again and assign sets of users
        split = []
        for trg in Trigger.objects(node_from=node.id):
            if trg["opened"]:
                split.append((segments["opened"], trg.node_to))
            elif trg["clicked"]:
                split.append((segments[trg["clicked"]], trg.node_to))
            elif trg["default"]:
                split.append((segments["default"], trg.node_to))
            elif trg["any_click"]:
                split.append((segments["any_click"], trg.node_to))

        return split

    def create_node_campaign(self, node_oid):
        """
        create mailchimp campaign for given node
        node must be fully processed (we have all content and segment info)
        returns campaign id, or None if failed
        (usually fails if segment is empty - pointless campaign)
        """
        node = Node.objects(id=node_oid)[0]
        list_id = DripCampaign.objects(id=node["drip_campaign_id"])[0]["list_id"]
        segment = Segment.objects(id=node["segment_oid"])[0]
        if segment["members_euid"]:
            campaign_id = self.mw.create_campaign(
                list_id=list_id,
                segment_id=segment["segment_id"],
                template_id=node["content"]["template_id"],
                subject=node["content"]["subject"],
                from_email=node["content"]["from_email"],
                from_name=node["content"]["from_name"],
                folder_id=self.folder_id,
            )
            node.update(set__campaign_id=campaign_id, set__updated_at=datetime.utcnow())
            return campaign_id
        else:
            return None

    def send_campaign(self, campaign_id):
        """
        send campaign campaign_id
        """
        self.mw.send_campaign(campaign_id)

    DEFAULT_ACTIONS = ["open", "any click", "default"]

    FRONTEND_ACTION_ID_MAP = {
        "open": "actionOpen",
        "click": "{url}",
        "any click": "actionAnyClicked",
        "default": "actionDefault",
    }

    def get_frontend_action_id(self, val):
        """
        helper to get action id that frontend understands
        """
        if val in self.DEFAULT_ACTIONS:
            return self.FRONTEND_ACTION_ID_MAP[val]
        # if not default, then it's a click of a specific link
        return self.FRONTEND_ACTION_ID_MAP["click"].format(url=val)

    FRONTEND_ACTION_NAME_MAP = {
        "open": "Open",
        "click": "Clicks {url}",
        "any click": "Clicks any link",
        "default": "Default",
    }

    def get_frontend_action_name(self, val):
        """
        helper to get action name that frontend understands
        """
        if val in self.DEFAULT_ACTIONS:
            return self.FRONTEND_ACTION_NAME_MAP[val]
        # if not default, then it's a click of a specific link
        return self.FRONTEND_ACTION_NAME_MAP["click"].format(url=val)

    def save_entire_campaign(self, drip_campaign):
        """
        helps frontend with saving entire campaigns
        takes drip campaign superstructure as is from frontend
        and saves them properly through data captain
        works under assumption that all data is accurate with respect
        to backend data (existing lists, templates, etc.) and correctly formed
        returns drip campaign id
        """
        # get necessary substructures
        campaign = drip_campaign["campaign"]
        blocks = drip_campaign["blocks"]
        nodes = drip_campaign["nodes"]
        # save campaign
        drip_campaign_id = self.create_drip_campaign(campaign["name"], campaign["userListId"])
        # helpers
        node_id_to_node = {node["id"]: node for node in nodes}
        node_id_to_oid = {}
        # find the first block
        first_block = None
        for block in blocks:
            if first_block is None or block["datetime"] < first_block["datetime"]:
                first_block = block
        # iterate over blocks and save their nodes, and the blocks themselves
        for block in blocks:
            # set nodes to initial if this is the first block chronologically
            initial = True if block["id"] == first_block["id"] else None
            # collect oids for all new nodes for block saving
            nodes_oid = []
            for node_id in block["nodeIds"]:
                node = node_id_to_node[node_id]
                node_oid = self.create_node(
                    drip_campaign_id=drip_campaign_id,
                    title=node["name"],
                    start_time=block["datetime"],
                    template_id=node["templateId"],
                    subject=None,
                    from_email=None,
                    from_name=None,
                    initial=initial,
                    description=node["description"],
                )
                node_id_to_oid[node_id] = node_oid
                nodes_oid.append(node_oid)
            self.save_block(drip_campaign_id, block["datetime"], nodes_oid)
        # iterate over all triggers of all nodes and save them accordingly
        for node in nodes:
            for trigger in node["triggers"]:
                # get trigger defining params
                opened, clicked, any_click, default = None, None, None, None
                action_id = trigger["action_id"]
                if action_id == self.get_frontend_action_id("open"):
                    opened = True
                elif action_id == self.get_frontend_action_id("any click"):
                    any_click = True
                elif action_id == self.get_frontend_action_id("default"):
                    default = True
                else:
                    clicked = action_id
                # save trigger for each click variant
                # normally there is only one, thus, a single trigger is created
                # if `any click` is set, we make a new trigger for each link
                self.create_trigger(
                    drip_campaign_id=drip_campaign_id,
                    node_from=node_id_to_oid[node["id"]],
                    node_to=node_id_to_oid[trigger["nodeId"]],
                    opened=opened,
                    clicked=clicked,
                    any_click=any_click,
                    default=default,
                )
        # return campaign's id
        return drip_campaign_id

    def load_entire_campaign(self, drip_campaign_id):
        """
        helps frontend with loading entire campaigns
        takes drip campaign id and loads all of its components
        in a drip superstructure as frontend wants
        """
        # load campaign
        drip_campaign = DripCampaign.objects(id=drip_campaign_id)[0]
        drip_campaign_frontend = {
            "id": drip_campaign["id"],
            "name": drip_campaign["name"],
            "userListId": drip_campaign["list_id"],
        }
        # load blocks
        blocks = Block.objects(drip_campaign_id=drip_campaign_id)
        blocks_frontend = [
            {
                "id": block["id"],
                "datetime": block["start_time"],
                "nodeIds": block["nodes_id"],
            }
            for block in blocks
        ]
        # load nodes
        nodes_frontend = []
        for node in Node.objects(drip_campaign_id=drip_campaign_id):
            def get_trigger_action_id(trigger):
                if trigger.opened:
                    return self.get_frontend_action_id("open")
                if trigger.any_click:
                    return self.get_frontend_action_id("any click")
                if trigger.default:
                    return self.get_frontend_action_id("default")
                return self.get_frontend_action_id(trigger.clicked)
            triggers = [
                {
                    "id": trigger["id"],
                    "actionId":  get_trigger_action_id(trigger),
                    "nodeId": trigger["node_to"],
                }
                for trigger in Trigger.objects(node_from=node["id"])
            ]
            nodes_frontend.append({
                "id": node["id"],
                "name": node["title"],
                "description": node["description"],
                "templateId": node["content"]["template_id"],
                "triggers": triggers,
            })
        # update and load lists and templates
        lists = self.update_lists()
        lists_frontend = [
            {
                "id": lst["id"],
                "name": lst["name"],
            }
            for lst in lists
        ]
        templates = self.update_templates()
        templates_frontend = [
            {
                "id": tmplt["id"],
                "name": tmplt["name"],
            }
            for tmplt in templates
        ]

        # create actions for frontend
        # set default actions that apply to all templates
        actions = {
            self.get_frontend_action_id(action_type): {
                "id": self.get_frontend_action_id(action_type),
                "name": self.get_frontend_action_name(action_type),
                "templates": [],
            }
            for action_type in self.DEFAULT_ACTIONS
        }
        # iterate over all tempaltes and update actions
        for tmplt in templates:
            # first, add the template to all default actions
            for action_type in self.DEFAULT_ACTIONS:
                action_frontend_id = self.get_frontend_action_id(action_type)
                actions[action_frontend_id]["templates"].append(tmplt["id"])
            # second, add template to all its link click actions
            for link in self.get_links(tmplt["template_id"]):
                action_frontend_id = self.get_frontend_action_id(link)
                # if this link is new, add a new action
                if action_frontend_id not in actions:
                    actions[action_frontend_id] = {
                        "id": action_frontend_id,
                        "name": self.get_frontend_action_name(link),
                        "templates": [],
                    }
                # add the template to this link's click action
                actions[action_frontend_id]["templates"].append(tmplt["id"])
        # ditch the mapping
        actions_frontend = actions.values()

        # form the resulting frontend superstructure
        return {
            "campaign": drip_campaign_frontend,
            "userLists": lists_frontend,
            "templates": templates_frontend,
            "actions": actions_frontend,
            "blocks": blocks_frontend,
            "nodes": nodes_frontend,
        }
