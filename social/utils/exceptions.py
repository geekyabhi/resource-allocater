class CustomException(Exception):
    def __init__(self, *args: object, status_code: int = 500) -> None:
        super().__init__(*args)
        self.status_code = status_code
