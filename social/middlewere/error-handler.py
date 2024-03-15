# middleware.py
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import serializers
from utils.exceptions import CustomException
from utils.logger import CustomerLogger


class ErrorSerializer(serializers.Serializer):
    success = serializers.BooleanField(default=False)
    error = serializers.CharField()


class ErrorHandlerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except Exception as exception:
            response = self.process_exception(request, exception)
        return response

    def process_exception(self, request, exception):
        status_code = 500
        error_message = str(exception)
        logger = CustomerLogger(log_file="error.log").setup_logger()

        logger.error(error_message)
        print(error_message)
        status_code = getattr(exception, "status_code", 500)
        if status_code / 100 == 5:
            error_message = "Internal server error"

        serialized_data = ErrorSerializer(
            {"success": False, "error": error_message}
        ).data
        response = Response(serialized_data, status=status_code)

        renderer = JSONRenderer()
        response.content = renderer.render(serialized_data)
        return response
