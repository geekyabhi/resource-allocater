from confluent_kafka import Producer
from allocater.env_config import ConfigUtil
from .exceptions import CustomException

configuration = ConfigUtil().get_config_data()


class KafkaProducerHandler:
    def __init__(self):
        self.bootstrap_servers = configuration.get("KAFKA_BROKER_URI")
        print(self.bootstrap_servers)
        self.producer = Producer({'bootstrap.servers': self.bootstrap_servers})

    def __del__(self):
        self.close_producer()

    def delivery_report(self, err, msg):
        if err is not None:
            print('Message delivery failed: {}'.format(err))
        else:
            print('Message delivered to {} [{}]'.format(msg.topic(), msg.partition()))

    def produce_message(self, topic, message, key=None):
        self.producer.produce(topic, key=key, value=message, callback=self.delivery_report)
        # Wait for any outstanding messages to be delivered and delivery reports to be received.
        self.producer.flush()

    def close_producer(self):
        self.producer.flush()
        self.producer.close()
