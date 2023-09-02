class CustomBaseException(Exception):
    """Base class for custom exceptions."""
    def __init__(self, message=None, **kwargs):
        self.message = message
        for key, value in kwargs.items():
            setattr(self, key, value)
        super().__init__(self.message)

class ContainerError(CustomBaseException):
    """Exception raised when a container is not found."""
    def __init__(self, message):
        super().__init__(message=message)
