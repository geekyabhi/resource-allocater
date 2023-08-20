const amqplib = require("amqplib");
const {
	MESSAGE_QUEUE_URL,
	EXCHANGE_NAME,
	MAIL_BINDING_KEY,
} = require("../../config");
const { AsyncAPIError } = require("../error/app-errors");

class RabbitMQ {
	constructor() {
		this.MESSAGE_QUEUE_URL = MESSAGE_QUEUE_URL;
		this.EXCHANGE_NAME = EXCHANGE_NAME;
		this.MAIL_BINDING_KEY = MAIL_BINDING_KEY;
	}

	async CreateChannel() {
		try {
			const connection = await amqplib.connect(this.MESSAGE_QUEUE_URL);
			const channel = await connection.createChannel();
			await channel.assertExchange(this.EXCHANGE_NAME, "direct", false);
			console.log("Rabbit mq connected".green);
			this.channel = channel;
			return channel;
		} catch (e) {
			throw new Error(e);
		}
	}

	async PublishMessage(binding_key, message) {
		try {
			await this.channel.publish(
				this.EXCHANGE_NAME,
				binding_key,
				Buffer.from(message)
			);
			console.log(
				"Message has been published from customer service",
				message
			);
		} catch (e) {
			console.log(e);
			throw new AsyncAPIError(e);
		}
	}

	async SubscribeMessage(service) {
		try {
			// await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
			const appQueue = await this.channel.assertQueue("", {
				exclusive: true,
			});

			channel.bindQueue(
				appQueue.queue,
				this.EXCHANGE_NAME,
				this.CUSTOMER_BINDING_KEY
			);
			channel.consume(
				appQueue.queue,
				async (data) => {
					try {
						console.log("Message subscribed in customer service");
						await service.SubscribeEvents(data.content.toString());
					} catch (e) {
						throw new AsyncAPIError(e);
					}
				},
				{ noAck: true }
			);
		} catch (e) {
			throw new AsyncAPIError(e);
		}
	}
}

module.exports = { RabbitMQ };
