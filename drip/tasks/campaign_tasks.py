import os
from drip.backend.campaign_processor import process_campaigns
from logging.handlers import RotatingFileHandler
from drip.config import Config
import mongoengine
import logging


# initiates a single drip campaign processor run
# currently initializes mongo connection and logger independently
# based on config (so that we can run this as cron job)
def process_drip_campaigns_task():
    # get config
    conf = Config()
    # initialize mongo connection
    mongoengine.connect(
        conf.MONGODB_SETTINGS["db"],
        host=conf.MONGODB_SETTINGS["host"],
        port=conf.MONGODB_SETTINGS["port"])
    # get log directory and name and initialize logger
    log_dir = conf.LOG_SETTINGS["log_dir"]
    log_name = conf.LOG_SETTINGS["log_name"]
    file_handler = RotatingFileHandler(
        filename=os.path.join(log_dir, log_name + ".log"),
        maxBytes=200000000,  # 200MB
        backupCount=20,  # 20*200MB=4GB=nice
    )
    logger = logging.getLogger(name=log_name)
    logger.addHandler(file_handler)
    logger.setLevel(logging.INFO)
    # run the processor
    process_campaigns(logger)


if __name__ == "__main__":
    process_drip_campaigns_task()
