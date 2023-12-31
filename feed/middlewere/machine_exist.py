from django.http import JsonResponse
import json
from machines.service import MachineService

def machine_exists(view_func):
    def _wrapped_view(request, *args, **kwargs):
        raw_data = request.body.decode("utf-8")
        machine_id = json.loads(raw_data).get('machine_id')
        if not machine_id:
            return JsonResponse({"error":"No such machine exist"},status=400)
        machine = MachineService().find(machine_id=machine_id)
        if not machine :
            return JsonResponse({"error":"No such machine exist"},status=400)
        return view_func(request,*args,**kwargs)

    return _wrapped_view