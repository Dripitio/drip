from drip.backend.campaign_processor import process_campaigns


def process_drip_campaigns_task():
    from drip.config import Config
    conf = Config()
    import mongoengine
    mongoengine.connect(
        conf.MONGODB_SETTINGS["db"],
        host=conf.MONGODB_SETTINGS["host"],
        port=conf.MONGODB_SETTINGS["port"])
    process_campaigns()
