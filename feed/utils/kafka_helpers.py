from confluent_kafka import Producer
from confluent_kafka.serialization import StringSerializer
from allocater.env_config import ConfigUtil

configuration = ConfigUtil().get_config_data()


class KafkaProducerHandler:
    def __init__(self):
        self.bootstrap_servers = configuration.get("KAFKA_BROKER_URI")
        self.sasl_username = configuration.get("KAFKA_USER_NAME")
        self.sasl_password = configuration.get("KAFKA_PASSWORD")

        self.producer_config = {
            "bootstrap.servers": self.bootstrap_servers,
            "sasl.mechanisms": "SCRAM-SHA-512",
            "sasl.username": self.sasl_username,
            "sasl.password": self.sasl_password,
            'security.protocol': 'SASL_SSL'
        }

        self.producer = Producer(self.producer_config)

    def produce_message(self, topic, message ,key=None):
        try:
            self.producer.produce(topic, key=key, value=message)
            self.producer.flush()
            print(f"JSON Message produced to Kafka topic '{topic}': {message}")
        except Exception as e:
            print(f"Failed to produce JSON message to Kafka: {e}")

    def close_producer(self):
        self.producer.flush()
        self.producer.close()
