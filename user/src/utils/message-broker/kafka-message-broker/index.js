const { KAFKA_BROKER_URI } = require("../../../config");

const { Kafka } = require("kafkajs");

class KafkaProducerHandler {
	constructor() {
		this.bootstrapServers = KAFKA_BROKER_URI;

		this.kafka = new Kafka({
			clientId: "resource-allocator-user", // Update with your desired client ID
			brokers: [this.bootstrapServers], // Use the provided bootstrap servers
		});
		this.producer = this.kafka.producer();
	}

	async connectProducer() {
		return new Promise(async (resolve, reject) => {
			try {
				await this.producer.connect();
				resolve(true);
			} catch (e) {
				reject(e);
			}
		});
	}

	async sendMessage(topic, message) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.producer.send({
					topic: topic,
					messages: [{ value: message }],
				});
				resolve(true);
			} catch (e) {
				reject(e);
			}
		});
	}

	async Produce(topic, message) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.connectProducer();
				await this.sendMessage(topic, message);
				resolve(true);
			} catch (e) {
				reject(e);
			}
		});
	}
}

module.exports = KafkaProducerHandler;
