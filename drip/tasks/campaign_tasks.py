from drip.backend.campaign_processor import process_campaigns


def process_drip_campaigns_task():
    from drip.config import Config
    conf = Config()
    import mongoengine
    mongoengine.connect(
        conf.MONGODB_SETTINGS["db"],
        host=conf.MONGODB_SETTINGS["host"],
        port=conf.MONGODB_SETTINGS["port"])

    import logging
    from logging.handlers import RotatingFileHandler
    file_handler = RotatingFileHandler(filename="nice.log")
    logger = logging.getLogger(name="nice")
    logger.addHandler(file_handler)
    logger.setLevel(logging.INFO)
    process_campaigns(logger)


if __name__ == "__main__":
    process_drip_campaigns_task()