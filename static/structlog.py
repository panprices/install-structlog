import logging
import os
from typing import Any

import structlog
from structlog.dev import set_exc_info, ConsoleRenderer
from structlog.processors import StackInfoRenderer, TimeStamper, add_log_level


def config_structlog():
    # Custom renderer when in development:
    if os.getenv("PANPRICES_ENVIRONMENT") == "local":
        structlog.configure_once(
            processors=[
                add_log_level,
                StackInfoRenderer(),
                set_exc_info,
                TimeStamper(fmt="%Y-%m-%d %H:%M.%S", utc=False),
                ConsoleRenderer(),
            ],
            wrapper_class=structlog.make_filtering_bound_logger(logging.DEBUG),
        )
    else:
        structlog.configure_once(
            processors=[
                add_log_level,
                StackInfoRenderer(),
                set_exc_info,
                _GCP_severity_processor,
                structlog.processors.JSONRenderer(),
            ],
            wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        )


def _GCP_severity_processor(
    logger: Any,
    method_name: str,
    event_dict: Any,
) -> Any:
    """
    Add GCP severity to event_dict.

    Method name is not a perfect one to one mapping to GCP severity.
    Here are the avaliable method names:
        - debug
        - info
        - warning
        - warn
        - error
        - err
        - fatal
        - exception
        - critical
        - msg
    """
    event_dict["severity"] = method_name.upper()
    del event_dict["level"]
    return event_dict
