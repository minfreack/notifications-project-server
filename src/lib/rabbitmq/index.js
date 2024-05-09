const amqp = require('amqplib');
require('dotenv').config()

let connection;
let channel;

const rabbitMQURL = process.env.RABBITMQ_URL

async function connectRabbitMQ() {
  if (!connection) {
    connection = await amqp.connect(rabbitMQURL);
  }
  if (!channel) {
    channel = await connection.createChannel();
  }
  await channel.assertQueue('notifications', { durable: true });
  return channel;
}

module.exports = { connectRabbitMQ };