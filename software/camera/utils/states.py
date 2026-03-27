from enum import Enum, auto

class States(Enum):
    IDLE = auto()
    CAPTURING = auto()
    PROCESSING = auto()