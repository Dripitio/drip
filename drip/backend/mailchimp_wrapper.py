from mailchimp import Mailchimp


class MailchimpWrapper:
    def __init__(self, api_key):
        self.mc = Mailchimp(api_key)

    def get_lists(self):
        """
        returns list of lists
        each list is described by a dict of name and list_id
        """
        return [{"name": lst["name"], "list_id": lst["id"]}
                for lst in self.mc.lists.list()["data"]]

    def get_templates(self):
        """
        returns list of templates
        each template is described by a dict of name and template_id
        """
        return [{"name": tmplt["name"], "template_id": tmplt["id"]}
                for tmplt in self.mc.templates.list(filters={"include_drag_and_drop": True})["user"]]

    def get_folders(self):
        """
        returns list of folders
        each folder is described by a dict of name and folder_id
        """
        return [{"name": fldr["name"], "folder_id": fldr["folder_id"]}
                for fldr in self.mc.folders.list("campaign")]

    def get_template_source(self, template_id):
        """
        given template_id get source of template
        """
        return self.mc.templates.info(template_id)["source"]

    def create_folder(self, name):
        """
        create folder with name `name` and return folder_id
        """
        return self.mc.folders.add(name, "campaign")["folder_id"]

    def get_members(self, list_id):
        """
        returns list of members of given list
        each member is described by a dict of email address and member_id
        """
        return [{"email": mbr["email"], "member_id": mbr["id"]}
                for mbr in self.mc.lists.members(list_id)["data"]]

    def create_segment(self, list_id, name):
        """
        create a new, empty static segment for list list_id with name name
        return segment id
        """
        return self.mc.lists.static_segment_add(list_id, name)["id"]

    def delete_segment(self, list_id, segment_id):
        """
        delete segment segment segment_id for list list_id
        """
        self.mc.lists.static_segment_del(list_id, segment_id)

    def update_segment_members(self, list_id, segment_id, euids):
        """
        given batch of members
        sets it to the members in segment segment_id of list list_id
        ignore return
        """
        self.mc.lists.static_segment_reset(list_id, segment_id)
        formatted_euids = [{"euid": euid} for euid in euids]
        self.mc.lists.static_segment_members_add(list_id, segment_id, formatted_euids)

    def create_campaign(self, list_id, segment_id, template_id, subject, from_email, from_name, folder_id=None):
        """
        create mailchimp campaign for given list, segment, template, etc.
        optionally can pass which folder to save it in (folder_id)
        return campaign id
        """
        options = {
            "list_id": list_id,
            "subject": subject,
            "from_email": from_email,
            "from_name": from_name,
            "template_id": template_id,
        }
        if folder_id is not None:
            options["folder_id"] = folder_id
        segment_opts = {
            "saved_segment_id": segment_id,
        }
        response = self.mc.campaigns.create("regular", options, {}, segment_opts)
        return response["id"]

    def send_campaign(self, campaign_id):
        """
        send pre-made campaign campaign_id
        """
        self.mc.campaigns.send(campaign_id)

    def get_member_activity(self, campaign_id, euids):
        """
        return description of activities (opens, clicks) for all given users in campaign
        """
        # we have to batch by 5 users
        batches = [[{"euid": euid} for euid in euids[i: i+50]] for i in xrange(0, len(euids), 50)]
        res = []
        # call api for each batch, take only euid and the actual activity list
        for batch in batches:
            member_activity = self.mc.reports.member_activity(campaign_id, batch)["data"]
            res.extend([{"activity": ma["activity"], "euid": ma["member"]["euid"]} for ma in member_activity])
        return res

    def get_default_content_params(self, list_id):
        """
        returns list-specific default mail content params:
        from name, from email address, and subject line
        """
        lst = self.mc.lists.list({"list_id": list_id})["data"][0]
        return {
            "default_from_email": lst["default_from_email"],
            "default_from_name": lst["default_from_name"],
            "default_subject": lst["default_subject"],
        }
