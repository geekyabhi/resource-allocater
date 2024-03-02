import json
from utils.exceptions import CustomException
from microservice_comm.grpc_comm.verifire.machine.service import MachineService

def machine_exists(view_func):
    def _wrapped_view(request, *args, **kwargs):
        raw_data = request.body.decode("utf-8")
        machine_id = json.loads(raw_data).get("machine_id")
        if not machine_id:
            raise CustomException("No such machine exist", status_code=400)
        machine = MachineService().get_machine(machine_data=machine_id)
        if not machine:
            raise CustomException("No such machine exist", status_code=400)
        return view_func(request, *args, **kwargs)

    return _wrapped_view
