from rest_framework import viewsets, status
from rest_framework.response import Response

class ErrorHandler():
    def PickError(self,error):
        err ={}
        err['success'] = False
        err['error'] = {
            'message' : str(error)
        }
        return err

