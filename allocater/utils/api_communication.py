import json
import requests

def send_request(url, type="GET" , data = {} , headers = {'Content-Type': 'application/json'}):
    response = requests.request(type , url , headers = headers , data = data)
    return json.loads(response.text)

